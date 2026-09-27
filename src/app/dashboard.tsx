import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Award,
  Bookmark,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  Lock,
  Moon,
  Search,
  Sparkles,
  Sun,
  TrendingUp,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { ThemeColors, useAppTheme } from '@/context/theme-context';
import { ALL_BOOKS, BookItem, CATEGORIES } from '@/data/books';

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const { user, isLoggedIn, openProfile } = useAuth();
  const { colorMode, isNavy, setColorMode, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0);
  const styles = useMemo(() => getStyles(theme, isNavy), [theme, isNavy]);
  const readerScrollRef = useRef<ScrollView>(null);

  // States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingBook, setActiveReadingBook] = useState<BookItem | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Auto-open reader if bookId is passed in route params
  useEffect(() => {
    if (params?.bookId) {
      const target = ALL_BOOKS.find((b) => b.id === params.bookId);
      if (target) {
        setActiveReadingBook(target);
        setActiveChapterIndex(0);
      }
    }
  }, [params?.bookId]);

  // Clickable stat card expansion: 'time' | 'completed' | 'badges' | 'goal' | null
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  // Clickable continue reading card expansion: bookId | null
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);

  // Clickable discover card expansion
  const [expandedDiscoverId, setExpandedDiscoverId] = useState<string | null>(null);

  // Clickable reading challenge expansion
  const [isChallengeExpanded, setIsChallengeExpanded] = useState(false);

  // Show all currently reading toggle
  const [showAllCurrent, setShowAllCurrent] = useState(false);

  // Discover pagination count
  const [visibleDiscoverCount, setVisibleDiscoverCount] = useState(4);

  // Live page progress tracking
  const [readingProgress, setReadingProgress] = useState<{ [id: string]: number }>({
    'subtle-art': 45,
    'atomic-habits': 28,
    gatsby: 117,
  });

  // Reader settings
  const [readerFontSize, setReaderFontSize] = useState<number>(16);
  const [readerTheme, setReaderTheme] = useState<'slate' | 'sepia' | 'oled'>('slate');
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  // Continue reading books (first 3 books from catalog)
  const currentBooks = ALL_BOOKS.slice(0, 3);
  const displayedCurrent = showAllCurrent ? currentBooks : currentBooks.slice(0, 2);

  // Discover catalog books filtered by category & search
  const discoverBooks = ALL_BOOKS.filter((b) => {
    const matchesCat =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Trending'
        ? !!b.badge
        : b.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  const paginatedDiscover = discoverBooks.slice(0, visibleDiscoverCount);

  const toggleStatDetail = (statName: string) => {
    setExpandedStat((prev) => (prev === statName ? null : statName));
  };

  const toggleBookDetail = (bookId: string) => {
    setExpandedBookId((prev) => (prev === bookId ? null : bookId));
  };

  const toggleDiscoverDetail = (bookId: string) => {
    setExpandedDiscoverId((prev) => (prev === bookId ? null : bookId));
  };

  const openBookReader = (book: BookItem, chapterIdx = 0) => {
    setActiveReadingBook(book);
    setActiveChapterIndex(chapterIdx);
    setTimeout(() => {
      readerScrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 100);
  };

  const advanceChapter = (nextIdx: number) => {
    setActiveChapterIndex(nextIdx);
    setTimeout(() => {
      readerScrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const updatePage = (bookId: string, delta: number, total: number) => {
    setReadingProgress((prev) => {
      const current = prev[bookId] ?? 1;
      const next = Math.min(Math.max(1, current + delta), total);
      return { ...prev, [bookId]: next };
    });
  };

  const handleBookmark = () => {
    if (!activeReadingBook) return;
    const curPage = readingProgress[activeReadingBook.id] ?? 1;
    setBookmarkToast(`Bookmarked page ${curPage}!`);
    setTimeout(() => setBookmarkToast(null), 2500);
  };

  // Reader theme colors
  const readerStyles = {
    slate: { bg: '#090d16', cardBg: '#131b2e', text: '#cbd5e1', border: '#1e293b' },
    sepia: { bg: '#231b14', cardBg: '#2f2319', text: '#f3dfc8', border: '#433324' },
    oled: { bg: '#000000', cardBg: '#101010', text: '#e2e8f0', border: '#222222' },
  }[readerTheme];

  // Currently active chapter details
  const curChapter = activeReadingBook
    ? activeReadingBook.chapters[activeChapterIndex] ?? activeReadingBook.chapters[0]
    : null;

  const nextChapter = activeReadingBook
    ? activeReadingBook.chapters[activeChapterIndex + 1] ?? null
    : null;

  // Is chapter locked for guest?
  const isCurChapterLocked =
    !!activeReadingBook?.isMemberExclusive && !isLoggedIn && activeChapterIndex > 0;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <StatusBar
        barStyle={isNavy ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TOP ALIGNED HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeftCluster}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/')}
              accessibilityLabel="Back to Home"
            >
              <ArrowLeft size={18} color={theme.textSecondary} />
            </TouchableOpacity>

            <View style={styles.headerTitles}>
              <Text style={styles.headerGreeting}>Welcome back,</Text>
              <Text style={styles.headerName} numberOfLines={1}>
                {user?.name ?? 'Avid Reader'} 👋
              </Text>
            </View>
          </View>

          <View style={styles.headerRightCluster}>
            {/* White / Navy Blue Theme Toggle */}
            <View style={[styles.themePillWrapper, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
              <TouchableOpacity
                style={[
                  styles.themeTab,
                  !isNavy && styles.themeTabActiveWhite,
                ]}
                onPress={() => setColorMode('white')}
                activeOpacity={0.7}
              >
                <Sun size={12} color={!isNavy ? '#0a192f' : '#94a3b8'} />
                <Text style={[styles.themeTabText, { color: !isNavy ? '#0a192f' : '#94a3b8' }]}>
                  White
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeTab,
                  isNavy && styles.themeTabActiveNavy,
                ]}
                onPress={() => setColorMode('navy')}
                activeOpacity={0.7}
              >
                <Moon size={12} color={isNavy ? '#38bdf8' : '#64748b'} />
                <Text style={[styles.themeTabText, { color: isNavy ? '#38bdf8' : '#64748b' }]}>
                  Navy
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.streakBadge}>
              <Flame size={16} color="#f97316" />
              <Text style={styles.streakText}>{user?.streak ?? 5}d</Text>
            </View>

            <TouchableOpacity
              style={styles.profileAvatarBtn}
              onPress={openProfile}
              activeOpacity={0.8}
              accessibilityLabel="Open Profile"
            >
              {user?.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.profileAvatarImage} />
              ) : (
                <Text style={styles.profileAvatarText}>
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'AR'}
                </Text>
              )}
              <View style={styles.onlineDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search bestsellers, classics, or topics..."
            placeholderTextColor={theme.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setVisibleDiscoverCount(4);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <X size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* CLICKABLE STATS OVERVIEW ROW */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Reading Activity</Text>
            <Text style={styles.sectionSubtitle}>Tap card to display more details</Text>
          </View>
          {expandedStat && (
            <TouchableOpacity onPress={() => setExpandedStat(null)}>
              <Text style={styles.closeDetailLink}>Close details ✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 4-Item Stat Cards */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, expandedStat === 'time' && styles.statCardActive]}
            activeOpacity={0.7}
            onPress={() => toggleStatDetail('time')}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#0369a120' }]}>
              <Clock size={18} color="#38bdf8" />
            </View>
            <Text style={styles.statNumber}>42m</Text>
            <Text style={styles.statTitle}>Read Today</Text>
            <View style={styles.statExpandIndicator}>
              {expandedStat === 'time' ? (
                <ChevronUp size={14} color="#38bdf8" />
              ) : (
                <ChevronDown size={14} color="#64748b" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, expandedStat === 'completed' && styles.statCardActive]}
            activeOpacity={0.7}
            onPress={() => toggleStatDetail('completed')}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#7e22ce20' }]}>
              <BookOpen size={18} color="#c084fc" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statTitle}>Completed</Text>
            <View style={styles.statExpandIndicator}>
              {expandedStat === 'completed' ? (
                <ChevronUp size={14} color="#c084fc" />
              ) : (
                <ChevronDown size={14} color="#64748b" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, expandedStat === 'badges' && styles.statCardActive]}
            activeOpacity={0.7}
            onPress={() => toggleStatDetail('badges')}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#ca8a0420' }]}>
              <Award size={18} color="#facc15" />
            </View>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statTitle}>Badges</Text>
            <View style={styles.statExpandIndicator}>
              {expandedStat === 'badges' ? (
                <ChevronUp size={14} color="#facc15" />
              ) : (
                <ChevronDown size={14} color="#64748b" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, expandedStat === 'goal' && styles.statCardActive]}
            activeOpacity={0.7}
            onPress={() => toggleStatDetail('goal')}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#15803d20' }]}>
              <TrendingUp size={18} color="#4ade80" />
            </View>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statTitle}>Goal Met</Text>
            <View style={styles.statExpandIndicator}>
              {expandedStat === 'goal' ? (
                <ChevronUp size={14} color="#4ade80" />
              ) : (
                <ChevronDown size={14} color="#64748b" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* EXPANDABLE DETAIL DRAWER FOR STATS */}
        {expandedStat === 'time' && (
          <View style={styles.expandedStatBox}>
            <View style={styles.expandedStatHeader}>
              <Clock size={16} color="#38bdf8" />
              <Text style={styles.expandedStatHeading}>Today’s Reading Sessions (42 Mins)</Text>
            </View>
            <View style={styles.statDetailItem}>
              <Text style={styles.statDetailTime}>☀️ Morning: 8:15 AM - 8:40 AM (25m)</Text>
              <Text style={styles.statDetailBook}>Read 22 pages of The Subtle Art of Not Giving a F*ck</Text>
            </View>
            <View style={styles.statDetailItem}>
              <Text style={styles.statDetailTime}>🌙 Afternoon: 1:10 PM - 1:27 PM (17m)</Text>
              <Text style={styles.statDetailBook}>Read 14 pages of Atomic Habits</Text>
            </View>
            <View style={styles.statPaceRow}>
              <Text style={styles.statPaceText}>⚡ Speed: 52 pages/hr</Text>
              <Text style={styles.statPaceText}>🔥 Streak multiplier: 1.25x XP</Text>
            </View>
          </View>
        )}

        {expandedStat === 'completed' && (
          <View style={styles.expandedStatBox}>
            <View style={styles.expandedStatHeader}>
              <BookOpen size={16} color="#c084fc" />
              <Text style={styles.expandedStatHeading}>Recently Completed Books (12 Total)</Text>
            </View>
            <View style={styles.statDetailItem}>
              <Text style={styles.statDetailBook}>1. Meditations by Marcus Aurelius • 5.0 ⭐</Text>
              <Text style={styles.statDetailTime}>Finished on September 4, 2026 (180 pages)</Text>
            </View>
            <View style={styles.statDetailItem}>
              <Text style={styles.statDetailBook}>2. The Great Gatsby by F. Scott Fitzgerald • 4.8 ⭐</Text>
              <Text style={styles.statDetailTime}>Finished on August 28, 2026 (180 pages)</Text>
            </View>
            <View style={styles.statDetailItem}>
              <Text style={styles.statDetailBook}>3. Frankenstein by Mary Shelley • 4.7 ⭐</Text>
              <Text style={styles.statDetailTime}>Finished on August 15, 2026 (220 pages)</Text>
            </View>
          </View>
        )}

        {expandedStat === 'badges' && (
          <View style={styles.expandedStatBox}>
            <View style={styles.expandedStatHeader}>
              <Award size={16} color="#facc15" />
              <Text style={styles.expandedStatHeading}>Earned Achievements & Badges (4 / 8)</Text>
            </View>
            <View style={styles.badgeRowList}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>🦉</Text>
                <View style={styles.badgeTextCol}>
                  <Text style={styles.badgeName}>Night Owl</Text>
                  <Text style={styles.badgeDesc}>Read past 11:00 PM</Text>
                </View>
                <CheckCircle2 size={16} color="#4ade80" />
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>⚡</Text>
                <View style={styles.badgeTextCol}>
                  <Text style={styles.badgeName}>Speed Demon</Text>
                  <Text style={styles.badgeDesc}>50+ pages in one sitting</Text>
                </View>
                <CheckCircle2 size={16} color="#4ade80" />
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>📚</Text>
                <View style={styles.badgeTextCol}>
                  <Text style={styles.badgeName}>Classic Scholar</Text>
                  <Text style={styles.badgeDesc}>Finished 5 complete works</Text>
                </View>
                <CheckCircle2 size={16} color="#4ade80" />
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>🔥</Text>
                <View style={styles.badgeTextCol}>
                  <Text style={styles.badgeName}>5-Day Flame</Text>
                  <Text style={styles.badgeDesc}>Consistent reading streak</Text>
                </View>
                <CheckCircle2 size={16} color="#4ade80" />
              </View>
            </View>
          </View>
        )}

        {expandedStat === 'goal' && (
          <View style={styles.expandedStatBox}>
            <View style={styles.expandedStatHeader}>
              <TrendingUp size={16} color="#4ade80" />
              <Text style={styles.expandedStatHeading}>Weekly Target Pace (85% Met)</Text>
            </View>
            <Text style={styles.statDetailTime}>Daily Target: 30 minutes reading</Text>
            <View style={styles.weeklyBarsRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <View key={day} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayBar,
                      { height: idx < 5 ? 40 : idx === 5 ? 18 : 6 },
                      idx < 5 && styles.dayBarDone,
                    ]}
                  />
                  <Text style={styles.dayLabel}>{day}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.statPaceText}>
              ✅ 5 of 7 days completed. Only 25 mins needed this weekend to reach 100%!
            </Text>
          </View>
        )}

        {/* CURRENTLY READING SECTION */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Continue Reading</Text>
            <Text style={styles.sectionSubtitle}>Tap card to resume reading</Text>
          </View>
          <TouchableOpacity
            style={styles.sectionPill}
            onPress={() => setShowAllCurrent((prev) => !prev)}
          >
            <Text style={styles.sectionPillText}>
              {showAllCurrent ? 'Show Less' : `View All (${currentBooks.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.currentList}>
          {displayedCurrent.map((book) => {
            const curPage = readingProgress[book.id] ?? 25;
            const pct = Math.min(100, Math.round((curPage / book.totalPages) * 100));
            const isExpanded = expandedBookId === book.id;

            return (
              <View key={book.id} style={styles.currentCardWrapper}>
                <TouchableOpacity
                  style={[styles.currentCard, isExpanded && styles.currentCardExpanded]}
                  activeOpacity={0.8}
                  onPress={() => toggleBookDetail(book.id)}
                >
                  <Image source={{ uri: book.cover }} style={styles.bookThumbnail} />

                  <View style={styles.currentCardDetails}>
                    <View style={styles.cardHeaderFlex}>
                      <Text style={styles.bookTitle} numberOfLines={1}>
                        {book.title}
                      </Text>
                      {book.badge ? (
                        <View style={styles.trendingBadge}>
                          <Text style={styles.trendingBadgeText}>{book.badge}</Text>
                        </View>
                      ) : (
                        <View style={styles.ratingBadge}>
                          <Sparkles size={12} color="#facc15" />
                          <Text style={styles.ratingText}>{book.rating}</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.bookAuthor}>{book.author}</Text>

                    {/* PROGRESS BAR */}
                    <View style={styles.progressSection}>
                      <View style={styles.progressBarTrack}>
                        <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                      </View>
                      <View style={styles.progressLabels}>
                        <Text style={styles.progressPagesText}>
                          Page {curPage} of {book.totalPages}
                        </Text>
                        <Text style={styles.progressPctText}>{pct}%</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.continueActionIcon}>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#38bdf8" />
                    ) : (
                      <ChevronDown size={20} color="#64748b" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* EXPANDED ACCORDION VIEW ON CLICK */}
                {isExpanded && (
                  <View style={styles.cardAccordionDrawer}>
                    <Text style={styles.accordionSynopsis}>{book.synopsis}</Text>

                    <View style={styles.accordionTagsRow}>
                      {book.tags.map((tag) => (
                        <View key={tag} style={styles.miniTag}>
                          <Text style={styles.miniTagText}>{tag}</Text>
                        </View>
                      ))}
                      <View style={styles.miniTag}>
                        <Text style={styles.miniTagText}>Est. {book.readTime}</Text>
                      </View>
                    </View>

                    {/* FULL BOOK ACCESS */}
                    <View style={styles.chapterCountRow}>
                      <BookOpen size={14} color="#38bdf8" />
                      <Text style={styles.chapterCountText}>
                        Complete Book • Full Text Available Free
                      </Text>
                    </View>

                    <View style={styles.accordionButtonsRow}>
                      <TouchableOpacity
                        style={styles.accordionPrimaryBtn}
                        onPress={() => openBookReader(book, 0)}
                      >
                        <BookOpen size={16} color="#ffffff" />
                        <Text style={styles.accordionPrimaryBtnText}>Resume Reading</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.accordionSecondaryBtn}
                        onPress={() => {
                          updatePage(book.id, 20, book.totalPages);
                          setBookmarkToast(`Progress updated: +20 pages in ${book.title}!`);
                          setTimeout(() => setBookmarkToast(null), 2500);
                        }}
                      >
                        <CheckCircle2 size={16} color="#38bdf8" />
                        <Text style={styles.accordionSecondaryBtnText}>+20 Pages</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* CLICKABLE READING GOAL CARD */}
        <TouchableOpacity
          style={styles.goalCard}
          activeOpacity={0.8}
          onPress={() => setIsChallengeExpanded((prev) => !prev)}
        >
          <View style={styles.goalCardHeader}>
            <View style={styles.goalCardTitleRow}>
              <BookMarked size={20} color="#38bdf8" />
              <Text style={styles.goalTitle}>2026 Reading Challenge</Text>
            </View>
            <View style={styles.goalRightCluster}>
              <Text style={styles.goalPill}>On Track</Text>
              {isChallengeExpanded ? (
                <ChevronUp size={16} color="#64748b" />
              ) : (
                <ChevronDown size={16} color="#64748b" />
              )}
            </View>
          </View>

          <Text style={styles.goalDescription}>
            You’ve finished <Text style={styles.goalBold}>15 of 20</Text> books this year! You are 2
            books ahead of schedule. Tap for milestone breakdown.
          </Text>

          <View style={styles.goalProgressTrack}>
            <View style={[styles.goalProgressFill, { width: '75%' }]} />
          </View>

          {isChallengeExpanded && (
            <View style={styles.challengeExpandedBlock}>
              <Text style={styles.challengeExpandedSub}>Monthly Completion Milestones:</Text>
              <View style={styles.milestoneGrid}>
                {['Jan: 2', 'Feb: 1', 'Mar: 2', 'Apr: 1', 'May: 3', 'Jun: 1', 'Jul: 2', 'Aug: 2', 'Sep: 1'].map(
                  (m) => (
                    <View key={m} style={styles.milestonePill}>
                      <Text style={styles.milestonePillText}>{m}</Text>
                    </View>
                  )
                )}
              </View>
              <Text style={styles.quoteText}>
                “A reader lives a thousand lives before he dies . . . The man who never reads lives only one.”
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* CATEGORIES SECTION */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Explore Library Categories</Text>
            <Text style={styles.sectionSubtitle}>From bestsellers to timeless classics</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsScroll}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => {
                  setSelectedCategory(category);
                  setVisibleDiscoverCount(4);
                }}
              >
                <Text
                  style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DISCOVER BOOKS GRID */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All'
                ? 'Curated Books & Bestsellers'
                : `${selectedCategory} Collection`}
            </Text>
            <Text style={styles.sectionSubtitle}>
              Showing {paginatedDiscover.length} of {discoverBooks.length} titles
            </Text>
          </View>
        </View>

        {/* Standard 2-column Grid */}
        <View style={styles.discoverGrid}>
          {paginatedDiscover.map((book) => {
            const isCardExpanded = expandedDiscoverId === book.id;

            return (
              <View
                key={book.id}
                style={[
                  styles.discoverCard,
                  isCardExpanded && styles.discoverCardFullWidth,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleDiscoverDetail(book.id)}
                >
                  <View style={styles.coverImageContainer}>
                    <Image source={{ uri: book.cover }} style={styles.discoverCover} />
                    {book.badge && (
                      <View style={styles.bookBadgeOverlay}>
                        <Text style={styles.bookBadgeOverlayText}>{book.badge}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.discoverContent}>
                    <View style={styles.discoverMeta}>
                      <Text style={styles.categoryTag}>{book.category}</Text>
                      <Text style={styles.pagesTag}>{book.totalPages}p</Text>
                    </View>

                    <Text style={styles.discoverTitle} numberOfLines={1}>
                      {book.title}
                    </Text>
                    <Text style={styles.discoverAuthor} numberOfLines={1}>
                      {book.author}
                    </Text>

                    {/* TAP TO EXPAND / READ MORE */}
                    <View style={styles.discoverFooterRow}>
                      <TouchableOpacity
                        style={styles.detailsToggleBtn}
                        onPress={() => toggleDiscoverDetail(book.id)}
                      >
                        <Text style={styles.detailsToggleText}>
                          {isCardExpanded ? 'Hide ▲' : 'Details ▼'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.readNowBtn}
                        onPress={() => openBookReader(book, 0)}
                      >
                        <Text style={styles.readNowBtnText}>Read</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* EXPANDED DETAILS CARD */}
                {isCardExpanded && (
                  <View style={styles.discoverExpandedBody}>
                    <Text style={styles.expandedSynopsisText}>{book.synopsis}</Text>

                    <View style={styles.expandedDetailsRow}>
                      <Text style={styles.detailBadge}>
                        📅 {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                      </Text>
                      <Text style={styles.detailBadge}>⏱️ {book.readTime}</Text>
                      <Text style={styles.detailBadge}>⭐ {book.rating}</Text>
                      {book.isMemberExclusive && (
                        <Text style={[styles.detailBadge, styles.memberOnlyBadge]}>
                          🔓 Free with Account
                        </Text>
                      )}
                    </View>

                    <View style={styles.expandedTagsGroup}>
                      {book.tags.map((t) => (
                        <View key={t} style={styles.miniTag}>
                          <Text style={styles.miniTagText}>{t}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.expandedStartReadingBtn}
                      onPress={() => openBookReader(book, 0)}
                    >
                      <BookOpen size={16} color="#ffffff" />
                      <Text style={styles.expandedStartReadingText}>Open Reader & Chapter 1</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* LOAD MORE BUTTON */}
        {visibleDiscoverCount < discoverBooks.length && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={() => setVisibleDiscoverCount((prev) => prev + 4)}
          >
            <Text style={styles.loadMoreBtnText}>
              Load More Books ({discoverBooks.length - visibleDiscoverCount} remaining)
            </Text>
          </TouchableOpacity>
        )}

        {visibleDiscoverCount >= discoverBooks.length && discoverBooks.length > 4 && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={() => setVisibleDiscoverCount(4)}
          >
            <Text style={styles.loadMoreBtnText}>Show Less Books ▲</Text>
          </TouchableOpacity>
        )}

        {/* BOTTOM SPACER */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* FLOATING BOOKMARK TOAST */}
      {bookmarkToast && (
        <View style={styles.toastContainer}>
          <Bookmark size={18} color="#38bdf8" />
          <Text style={styles.toastText}>{bookmarkToast}</Text>
        </View>
      )}

      {/* MULTI-CHAPTER READER MODAL */}
      <Modal
        visible={!!activeReadingBook}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setActiveReadingBook(null)}
      >
        <View style={[styles.readerModalContainer, { backgroundColor: readerStyles.bg, paddingTop: topPadding }]}>
          <StatusBar barStyle="light-content" backgroundColor={readerStyles.bg} />

          {/* READER TOP BAR */}
          <View style={[styles.readerTopBar, { borderBottomColor: readerStyles.border }]}>
            <TouchableOpacity
              style={styles.readerCloseBtn}
              onPress={() => setActiveReadingBook(null)}
            >
              <X size={22} color="#f8fafc" />
            </TouchableOpacity>

            <View style={styles.readerTitleBlock}>
              <Text style={styles.readerModalTitle} numberOfLines={1}>
                {activeReadingBook?.title}
              </Text>
              <Text style={styles.readerModalAuthor}>{activeReadingBook?.author}</Text>
            </View>

            <TouchableOpacity style={styles.readerBookmarkBtn} onPress={handleBookmark}>
              <Bookmark size={18} color="#38bdf8" />
            </TouchableOpacity>
          </View>

          {/* CONTROLS BAR: FONT SIZE & THEME */}
          <View style={[styles.readerToolbar, { borderBottomColor: readerStyles.border }]}>
            <View style={styles.fontControls}>
              <Text style={styles.toolbarLabel}>Size:</Text>
              <TouchableOpacity
                style={styles.fontBtn}
                onPress={() => setReaderFontSize((prev) => Math.max(13, prev - 2))}
              >
                <Text style={styles.fontBtnText}>A-</Text>
              </TouchableOpacity>
              <Text style={styles.currentFontSizeText}>{readerFontSize}px</Text>
              <TouchableOpacity
                style={styles.fontBtn}
                onPress={() => setReaderFontSize((prev) => Math.min(24, prev + 2))}
              >
                <Text style={styles.fontBtnText}>A+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.themeControls}>
              <TouchableOpacity
                style={[styles.themePill, readerTheme === 'slate' && styles.themePillActive]}
                onPress={() => setReaderTheme('slate')}
              >
                <Text style={styles.themePillText}>Slate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themePill, readerTheme === 'sepia' && styles.themePillActive]}
                onPress={() => setReaderTheme('sepia')}
              >
                <Text style={styles.themePillText}>Sepia</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themePill, readerTheme === 'oled' && styles.themePillActive]}
                onPress={() => setReaderTheme('oled')}
              >
                <Text style={styles.themePillText}>OLED</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* READER CONTENT SCROLL - WHOLE TEXT VIEW */}
          <ScrollView
            ref={readerScrollRef}
            style={styles.readerScroll}
            contentContainerStyle={styles.readerScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* BOOK HEADER */}
            <View style={styles.readerCoverPreview}>
              {activeReadingBook && (
                <Image source={{ uri: activeReadingBook.cover }} style={styles.readerCoverImage} />
              )}
              <Text style={[styles.readerBookHeading, { color: readerStyles.text }]}>
                {activeReadingBook?.title}
              </Text>
              <Text style={styles.readerBookSubheading}>by {activeReadingBook?.author}</Text>
              <View style={styles.fullTextBadge}>
                <Sparkles size={12} color="#38bdf8" />
                <Text style={styles.fullTextBadgeText}>
                  {activeReadingBook?.category} • Full Text Reading • Est. {activeReadingBook?.readTime}
                </Text>
              </View>
            </View>

            {/* CONTINUOUS WHOLE TEXT CHAPTERS */}
            {activeReadingBook?.chapters.map((ch, idx) => (
              <View key={ch.number} style={styles.wholeChapterBlock}>
                {/* Chapter Heading */}
                <View style={styles.chapterHeader}>
                  <Text style={styles.chapterNumberBadge}>CHAPTER {ch.number}</Text>
                  <Text style={[styles.wholeChapterTitle, { color: readerStyles.text }]}>
                    {ch.title}
                  </Text>
                  {ch.subtitle && (
                    <Text style={styles.wholeChapterSubtitle}>{ch.subtitle}</Text>
                  )}
                </View>

                {/* Chapter Text Body */}
                <View
                  style={[
                    styles.readerTextCard,
                    { backgroundColor: readerStyles.cardBg, borderColor: readerStyles.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.readerParagraph,
                      {
                        fontSize: readerFontSize,
                        lineHeight: readerFontSize * 1.75,
                        color: readerStyles.text,
                      },
                    ]}
                  >
                    {ch.content}
                  </Text>
                </View>

                {/* Chapter Key Takeaway Note */}
                {ch.takeaway && (
                  <View style={styles.takeawayCard}>
                    <View style={styles.takeawayHeader}>
                      <Sparkles size={16} color="#facc15" />
                      <Text style={styles.takeawayHeading}>Key Insight</Text>
                    </View>
                    <Text style={styles.takeawayBody}>"{ch.takeaway}"</Text>
                  </View>
                )}

                {/* Chapter Separator Divider */}
                {idx < (activeReadingBook.chapters.length - 1) && (
                  <View style={[styles.chapterDivider, { borderColor: readerStyles.border }]} />
                )}
              </View>
            ))}

            {/* END OF FULL BOOK CARD */}
            <View style={styles.bookCompletedCard}>
              <Sparkles size={24} color="#facc15" />
              <Text style={styles.bookCompletedTitle}>End of Book</Text>
              <Text style={styles.bookCompletedBody}>
                You have reached the end of the full text for {activeReadingBook?.title}!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeReaderDoneBtn}
              onPress={() => setActiveReadingBook(null)}
            >
              <Text style={styles.closeReaderDoneText}>Finish Reading Session</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme: ThemeColors, isNavy: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 56,
    },
    topHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingVertical: 2,
    },
    headerLeftCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: 10,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitles: {
      flex: 1,
      justifyContent: 'center',
    },
    headerGreeting: {
      color: theme.textSecondary,
      fontSize: 12,
      lineHeight: 16,
    },
    headerName: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      lineHeight: 22,
    },
    headerRightCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    themePillWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      borderWidth: 1,
      padding: 2,
    },
    themeTab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 14,
    },
    themeTabActiveWhite: {
      backgroundColor: '#ffffff',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    themeTabActiveNavy: {
      backgroundColor: '#0a192f',
    },
    themeTabText: {
      fontSize: 11,
      fontWeight: '700',
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.surfaceAlt,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      height: 38,
    },
    streakText: {
      color: theme.textPrimary,
      fontSize: 12,
      fontWeight: '700',
    },
    profileAvatarBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.buttonBg,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    profileAvatarImage: {
      width: 38,
      height: 38,
      borderRadius: 19,
    },
    profileAvatarText: {
      color: theme.buttonText,
      fontSize: 13,
      fontWeight: '800',
    },
    onlineDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#4ade80',
      borderWidth: 2,
      borderColor: theme.bg,
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 20,
      height: 46,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 14,
      paddingVertical: 8,
    },
    clearSearchBtn: {
      padding: 4,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 14,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 19,
      fontWeight: '800',
    },
    sectionSubtitle: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    closeDetailLink: {
      color: theme.blueAccent,
      fontSize: 12,
      fontWeight: '600',
    },
    sectionPill: {
      backgroundColor: theme.surfaceAlt,
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionPillText: {
      color: theme.blueAccent,
      fontSize: 12,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surfaceCard,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'flex-start',
      position: 'relative',
    },
    statCardActive: {
      borderColor: theme.blueAccent,
      backgroundColor: theme.surfaceAlt,
    },
    statIconBadge: {
      width: 28,
      height: 28,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    statNumber: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '800',
    },
    statTitle: {
      color: theme.textSecondary,
      fontSize: 10,
      marginTop: 2,
      fontWeight: '500',
    },
    statExpandIndicator: {
      position: 'absolute',
      top: 8,
      right: 6,
    },
    expandedStatBox: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 22,
    },
    expandedStatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    expandedStatHeading: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    statDetailItem: {
      marginBottom: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    statDetailTime: {
      color: theme.blueAccent,
      fontSize: 12,
      fontWeight: '600',
    },
    statDetailBook: {
      color: theme.textPrimary,
      fontSize: 13,
      marginTop: 2,
    },
    statPaceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    statPaceText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    badgeRowList: {
      gap: 10,
    },
    badgeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceCard,
      padding: 10,
      borderRadius: 10,
      gap: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    badgeIcon: {
      fontSize: 20,
    },
    badgeTextCol: {
      flex: 1,
    },
    badgeName: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    badgeDesc: {
      color: theme.textSecondary,
      fontSize: 11,
    },
    weeklyBarsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 60,
      marginVertical: 12,
      paddingHorizontal: 8,
    },
    dayCol: {
      alignItems: 'center',
      gap: 6,
    },
    dayBar: {
      width: 22,
      backgroundColor: isNavy ? '#334155' : '#e2e8f0',
      borderRadius: 6,
    },
    dayBarDone: {
      backgroundColor: '#4ade80',
    },
    dayLabel: {
      color: theme.textSecondary,
      fontSize: 11,
    },
    currentList: {
      gap: 12,
      marginBottom: 24,
    },
    currentCardWrapper: {
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfaceCard,
    },
    currentCard: {
      flexDirection: 'row',
      padding: 12,
      alignItems: 'center',
    },
    currentCardExpanded: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    bookThumbnail: {
      width: 54,
      height: 78,
      borderRadius: 8,
      backgroundColor: isNavy ? '#334155' : '#e2e8f0',
    },
    currentCardDetails: {
      flex: 1,
      marginLeft: 14,
      marginRight: 8,
    },
    cardHeaderFlex: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bookTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      flex: 1,
    },
    trendingBadge: {
      backgroundColor: isNavy ? '#0284c720' : '#e0f2fe',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isNavy ? '#38bdf830' : '#bae6fd',
    },
    trendingBadgeText: {
      color: theme.blueAccent,
      fontSize: 10,
      fontWeight: '700',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginLeft: 8,
    },
    ratingText: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    bookAuthor: {
      color: theme.textSecondary,
      fontSize: 13,
      marginTop: 2,
    },
    progressSection: {
      marginTop: 10,
    },
    progressBarTrack: {
      height: 6,
      backgroundColor: isNavy ? '#334155' : '#e2e8f0',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.blueAccent,
      borderRadius: 3,
    },
    progressLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    progressPagesText: {
      color: theme.textSecondary,
      fontSize: 11,
    },
    progressPctText: {
      color: theme.blueAccent,
      fontSize: 11,
      fontWeight: '600',
    },
    continueActionIcon: {
      paddingLeft: 4,
    },
    cardAccordionDrawer: {
      padding: 14,
      backgroundColor: theme.surfaceAlt,
    },
    accordionSynopsis: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 10,
    },
    accordionTagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 10,
    },
    miniTag: {
      backgroundColor: theme.surface,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    miniTagText: {
      color: theme.blueAccent,
      fontSize: 11,
      fontWeight: '600',
    },
    chapterCountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
    },
    chapterCountText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    accordionButtonsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    accordionPrimaryBtn: {
      flex: 2,
      flexDirection: 'row',
      backgroundColor: theme.buttonBg,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    accordionPrimaryBtnText: {
      color: theme.buttonText,
      fontSize: 13,
      fontWeight: '700',
    },
    accordionSecondaryBtn: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    accordionSecondaryBtnText: {
      color: theme.blueAccent,
      fontSize: 12,
      fontWeight: '600',
    },
    goalCard: {
      backgroundColor: theme.surfaceCard,
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 24,
    },
    goalCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    goalCardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    goalTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    goalRightCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    goalPill: {
      color: '#16a34a',
      backgroundColor: '#15803d20',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 8,
      fontSize: 11,
      fontWeight: '600',
    },
    goalDescription: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 12,
    },
    goalBold: {
      color: theme.textPrimary,
      fontWeight: '700',
    },
    goalProgressTrack: {
      height: 8,
      backgroundColor: isNavy ? '#334155' : '#e2e8f0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    goalProgressFill: {
      height: '100%',
      backgroundColor: theme.blueAccent,
      borderRadius: 4,
    },
    challengeExpandedBlock: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    challengeExpandedSub: {
      color: theme.textPrimary,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 8,
    },
    milestoneGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    milestonePill: {
      backgroundColor: theme.surfaceAlt,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    milestonePillText: {
      color: theme.blueAccent,
      fontSize: 11,
      fontWeight: '600',
    },
    quoteText: {
      color: theme.textSecondary,
      fontSize: 12,
      fontStyle: 'italic',
      lineHeight: 16,
    },
    categoryChipsScroll: {
      gap: 8,
      paddingBottom: 4,
      marginBottom: 24,
    },
    categoryChip: {
      backgroundColor: theme.chipBg,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryChipActive: {
      backgroundColor: theme.chipActiveBg,
      borderColor: theme.chipActiveBg,
    },
    categoryChipText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    categoryChipTextActive: {
      color: theme.chipActiveText,
    },
    discoverGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'space-between',
    },
    discoverCard: {
      width: '48%',
      backgroundColor: theme.surfaceCard,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 4,
    },
    discoverCardFullWidth: {
      width: '100%',
    },
    coverImageContainer: {
      position: 'relative',
    },
    discoverCover: {
      width: '100%',
      height: 145,
      backgroundColor: isNavy ? '#334155' : '#e2e8f0',
    },
    bookBadgeOverlay: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: isNavy ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    bookBadgeOverlayText: {
      color: theme.blueAccent,
      fontSize: 10,
      fontWeight: '700',
    },
    discoverContent: {
      padding: 12,
    },
    discoverMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    categoryTag: {
      color: theme.blueAccent,
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    pagesTag: {
      color: theme.textSecondary,
      fontSize: 10,
    },
    discoverTitle: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 2,
    },
    discoverAuthor: {
      color: theme.textSecondary,
      fontSize: 12,
      marginBottom: 10,
    },
    discoverFooterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    detailsToggleBtn: {
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    detailsToggleText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },
    readNowBtn: {
      backgroundColor: theme.buttonBg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    readNowBtnText: {
      color: theme.buttonText,
      fontSize: 12,
      fontWeight: '700',
    },
    discoverExpandedBody: {
      backgroundColor: theme.surfaceAlt,
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    expandedSynopsisText: {
      color: theme.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 10,
    },
    expandedDetailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 10,
    },
    detailBadge: {
      color: theme.textSecondary,
      fontSize: 11,
      backgroundColor: theme.surface,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    memberOnlyBadge: {
      color: theme.blueAccent,
      borderColor: theme.border,
      borderWidth: 1,
    },
    expandedTagsGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    expandedStartReadingBtn: {
      flexDirection: 'row',
      backgroundColor: theme.buttonBg,
      paddingVertical: 9,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    expandedStartReadingText: {
      color: theme.buttonText,
      fontSize: 13,
      fontWeight: '700',
    },
    loadMoreBtn: {
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 14,
      marginBottom: 20,
    },
    loadMoreBtnText: {
      color: theme.blueAccent,
      fontSize: 13,
      fontWeight: '700',
    },
    toastContainer: {
      position: 'absolute',
      bottom: 24,
      alignSelf: 'center',
      backgroundColor: theme.surface,
      borderColor: theme.blueAccent,
      borderWidth: 1,
      borderRadius: 24,
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
    toastText: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    readerModalContainer: {
      flex: 1,
    },
    readerTopBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    readerCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },
    readerBookmarkBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },
    readerTitleBlock: {
      flex: 1,
      marginHorizontal: 12,
      alignItems: 'center',
    },
    readerModalTitle: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    readerModalAuthor: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    readerToolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
    },
    fontControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    toolbarLabel: {
      color: theme.textMuted,
      fontSize: 12,
      marginRight: 2,
    },
    fontBtn: {
      backgroundColor: theme.surfaceAlt,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    fontBtnText: {
      color: theme.textPrimary,
      fontSize: 12,
      fontWeight: '700',
    },
    currentFontSizeText: {
      color: theme.blueAccent,
      fontSize: 12,
      fontWeight: '600',
    },
    themeControls: {
      flexDirection: 'row',
      gap: 4,
    },
    themePill: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
      backgroundColor: theme.surfaceAlt,
    },
    themePillActive: {
      backgroundColor: theme.buttonBg,
    },
    themePillText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },
    chapterTabsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    chapterTab: {
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.surfaceCard,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chapterTabActive: {
      backgroundColor: isNavy ? '#0284c720' : '#e0f2fe',
      borderColor: theme.blueAccent,
    },
    chapterTabLocked: {
      borderColor: theme.border,
      backgroundColor: theme.surfaceAlt,
    },
    tabLockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    chapterTabText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    chapterTabTextActive: {
      color: theme.blueAccent,
      fontWeight: '700',
    },
    chapterTabTextLocked: {
      color: theme.textMuted,
      fontSize: 12,
    },
    readerScroll: {
      flex: 1,
    },
    readerScrollContent: {
      paddingHorizontal: 22,
      paddingTop: 20,
      paddingBottom: 40,
      alignItems: 'center',
    },
    readerCoverPreview: {
      alignItems: 'center',
      marginBottom: 20,
    },
    readerCoverImage: {
      width: 90,
      height: 135,
      borderRadius: 8,
      marginBottom: 14,
    },
    readerChapterLabel: {
      color: theme.blueAccent,
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: '700',
      marginBottom: 6,
    },
    readerBookHeading: {
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
    },
    readerBookSubheading: {
      color: theme.textSecondary,
      fontSize: 14,
      fontStyle: 'italic',
      marginTop: 4,
      textAlign: 'center',
    },
    readerTextCard: {
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      width: '100%',
      marginBottom: 20,
    },
    readerParagraph: {
      marginBottom: 18,
      letterSpacing: 0.2,
    },
    takeawayCard: {
      width: '100%',
      backgroundColor: theme.surfaceCard,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: '#ca8a0440',
      marginBottom: 24,
    },
    takeawayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    takeawayHeading: {
      color: '#ca8a04',
      fontSize: 13,
      fontWeight: '700',
    },
    takeawayBody: {
      color: theme.textPrimary,
      fontSize: 14,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    upNextCard: {
      width: '100%',
      backgroundColor: theme.surfaceAlt,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 24,
    },
    upNextBadgeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    upNextBadge: {
      color: theme.blueAccent,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.5,
    },
    upNextNumber: {
      color: theme.textMuted,
      fontSize: 11,
    },
    upNextTitle: {
      color: theme.textPrimary,
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 2,
    },
    upNextSubtitle: {
      color: theme.textSecondary,
      fontSize: 13,
      marginBottom: 14,
    },
    upNextContinueBtn: {
      backgroundColor: theme.buttonBg,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
    },
    upNextContinueBtnText: {
      color: theme.buttonText,
      fontSize: 14,
      fontWeight: '700',
    },
    upNextUnlockBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.blueAccent,
      borderRadius: 10,
      paddingVertical: 12,
    },
    upNextUnlockBtnText: {
      color: theme.blueAccent,
      fontSize: 13,
      fontWeight: '700',
    },
    bookCompletedCard: {
      alignItems: 'center',
      backgroundColor: theme.surfaceCard,
      borderRadius: 14,
      padding: 24,
      width: '100%',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#ca8a0440',
    },
    bookCompletedTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 8,
      marginBottom: 4,
    },
    bookCompletedBody: {
      color: theme.textSecondary,
      fontSize: 13,
      textAlign: 'center',
    },
    lockedChapterCard: {
      alignItems: 'center',
      backgroundColor: theme.surfaceCard,
      borderRadius: 18,
      padding: 24,
      width: '100%',
      marginVertical: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    lockIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: isNavy ? '#0284c720' : '#e0f2fe',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
      borderWidth: 1,
      borderColor: isNavy ? '#38bdf840' : '#bae6fd',
    },
    lockedTitle: {
      color: theme.blueAccent,
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    lockedSubtitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 6,
      textAlign: 'center',
    },
    lockedDescription: {
      color: theme.textSecondary,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'center',
      marginVertical: 16,
    },
    lockedHighlight: {
      color: theme.blueAccent,
      fontWeight: '700',
    },
    unlockSubmitBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.buttonBg,
      borderRadius: 12,
      paddingVertical: 14,
      width: '100%',
    },
    unlockSubmitBtnText: {
      color: theme.buttonText,
      fontSize: 15,
      fontWeight: '700',
    },
    backToPreviewBtn: {
      paddingVertical: 12,
      marginTop: 6,
    },
    backToPreviewBtnText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    closeReaderDoneBtn: {
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
    },
    closeReaderDoneText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    fullTextBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: isNavy ? '#0284c720' : '#e0f2fe',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      marginTop: 8,
    },
    fullTextBadgeText: {
      color: theme.blueAccent,
      fontSize: 12,
      fontWeight: '600',
    },
    wholeChapterBlock: {
      width: '100%',
      marginBottom: 20,
    },
    chapterHeader: {
      alignItems: 'center',
      marginBottom: 14,
    },
    chapterNumberBadge: {
      color: theme.blueAccent,
      fontSize: 11,
      letterSpacing: 2,
      fontWeight: '800',
      marginBottom: 4,
    },
    wholeChapterTitle: {
      fontSize: 19,
      fontWeight: '800',
      textAlign: 'center',
    },
    wholeChapterSubtitle: {
      color: theme.textSecondary,
      fontSize: 13,
      fontStyle: 'italic',
      marginTop: 3,
      textAlign: 'center',
    },
    chapterDivider: {
      borderBottomWidth: 1,
      width: '60%',
      alignSelf: 'center',
      marginVertical: 20,
    },
  });
