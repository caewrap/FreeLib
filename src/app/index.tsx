import { useRouter } from 'expo-router';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Moon,
  Sparkles,
  Sun,
  User,
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { useAppTheme } from '@/context/theme-context';
import { ALL_BOOKS, BookItem } from '@/data/books';

export default function HomeScreen({ navigation }: any) {
  const router = useRouter();
  const { user, isLoggedIn, openProfile } = useAuth();
  const { colorMode, isNavy, setColorMode, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0);

  // Active spotlight book
  const spotlightBook = ALL_BOOKS[0]; // The Subtle Art

  // Recommended curated list
  const curatedBooks = ALL_BOOKS.slice(0, 4);

  const handleOpenBook = (bookId: string) => {
    if (navigation?.navigate) {
      try {
        navigation.navigate('dashboard', { bookId });
        return;
      } catch {}
    }
    router.push({ pathname: '/dashboard', params: { bookId } });
  };

  const handleNavigateDashboard = () => {
    if (navigation?.navigate) {
      try {
        navigation.navigate('dashboard');
        return;
      } catch {}
    }
    router.push('/dashboard');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: topPadding }]}>
      <StatusBar
        barStyle={isNavy ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR: BRANDING, THEME TOGGLE, PROFILE */}
        <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
          <View style={styles.brandCluster}>
            <View style={[styles.logoIconBox, { backgroundColor: isNavy ? '#172a45' : '#0a192f' }]}>
              <BookOpen size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>FreeLib</Text>
              <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
                Digital Library
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
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
                <Moon size={12} color={isNavy ? '#ffffff' : '#64748b'} />
                <Text style={[styles.themeTabText, { color: isNavy ? '#ffffff' : '#64748b' }]}>
                  Navy
                </Text>
              </TouchableOpacity>
            </View>

            {/* Profile Button */}
            <TouchableOpacity
              style={[
                styles.profileBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={openProfile}
              activeOpacity={0.8}
            >
              {user?.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.avatarImg} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: isNavy ? '#233554' : '#e2e8f0' }]}>
                  <User size={13} color={isNavy ? '#ffffff' : '#0a192f'} />
                </View>
              )}
              <Text style={[styles.profileBtnText, { color: theme.textPrimary }]}>
                {isLoggedIn ? (user?.name?.split(' ')[0] ?? 'Account') : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SPOTLIGHT / CONTINUE READING HERO */}
        <View style={styles.sectionMargin}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            Continue Reading
          </Text>
          <Text style={[styles.sectionSubheading, { color: theme.textSecondary }]}>
            Pick up where you left off with full text access
          </Text>

          <TouchableOpacity
            style={[
              styles.spotlightCard,
              {
                backgroundColor: isNavy ? '#112240' : '#0a192f',
                borderColor: isNavy ? '#233554' : '#0a192f',
              },
            ]}
            onPress={() => handleOpenBook(spotlightBook.id)}
            activeOpacity={0.9}
          >
            <View style={styles.spotlightRow}>
              <Image
                source={{ uri: spotlightBook.cover }}
                style={styles.spotlightCover}
              />

              <View style={styles.spotlightContent}>
                <View style={styles.spotlightTagRow}>
                  <View style={styles.spotlightBadge}>
                    <Sparkles size={11} color="#38bdf8" />
                    <Text style={styles.spotlightBadgeText}>CURRENT BOOK</Text>
                  </View>
                  <Text style={styles.spotlightCategoryText}>{spotlightBook.category}</Text>
                </View>

                <Text style={styles.spotlightTitle} numberOfLines={2}>
                  {spotlightBook.title}
                </Text>
                <Text style={styles.spotlightAuthor}>by {spotlightBook.author}</Text>

                {/* Progress bar */}
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: '25%' }]} />
                  </View>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressInfoText}>Page 45 of {spotlightBook.totalPages}</Text>
                    <Text style={styles.progressPercentText}>20%</Text>
                  </View>
                </View>

                {/* Read Button */}
                <View style={styles.spotlightActionRow}>
                  <View style={[styles.readNowBtn, { backgroundColor: '#ffffff' }]}>
                    <Text style={[styles.readNowBtnText, { color: '#0a192f' }]}>
                      Resume Reading
                    </Text>
                    <ArrowRight size={14} color="#0a192f" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* CURATED BOOKS SECTION */}
        <View style={styles.sectionMargin}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                Curated Books
              </Text>
              <Text style={[styles.sectionSubheading, { color: theme.textSecondary }]}>
                Essential reads available in full
              </Text>
            </View>

            <TouchableOpacity onPress={handleNavigateDashboard} activeOpacity={0.7}>
              <Text style={[styles.seeAllText, { color: theme.blueAccent }]}>
                Browse All ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Book Cards Grid */}
          <View style={styles.booksGrid}>
            {curatedBooks.map((book: BookItem) => (
              <TouchableOpacity
                key={book.id}
                style={[
                  styles.bookCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => handleOpenBook(book.id)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: book.cover }} style={styles.bookCoverImg} />
                <View style={styles.bookCardBody}>
                  <Text
                    style={[styles.bookCardTitle, { color: theme.textPrimary }]}
                    numberOfLines={2}
                  >
                    {book.title}
                  </Text>
                  <Text
                    style={[styles.bookCardAuthor, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {book.author}
                  </Text>

                  <View style={styles.bookCardFooter}>
                    <Text style={[styles.bookRatingText, { color: theme.textSecondary }]}>
                      ★ {book.rating}
                    </Text>
                    <Text style={[styles.bookReadBtnText, { color: theme.blueAccent }]}>
                      Read Full ›
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CLEAN ACTION: EXPLORE DASHBOARD */}
        <TouchableOpacity
          style={[
            styles.exploreCatalogCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
          onPress={handleNavigateDashboard}
          activeOpacity={0.8}
        >
          <View style={[styles.exploreIconCircle, { backgroundColor: isNavy ? '#172a45' : '#0a192f' }]}>
            <Compass size={18} color="#ffffff" />
          </View>
          <View style={styles.exploreTextCluster}>
            <Text style={[styles.exploreTitle, { color: theme.textPrimary }]}>
              Explore Complete Library
            </Text>
            <Text style={[styles.exploreSubtitle, { color: theme.textSecondary }]}>
              Search philosophy, productivity, classics and manage your reading
            </Text>
          </View>
          <ArrowRight size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* NEAT FOOTER NOTE */}
        <View style={styles.footerNote}>
          <Text style={[styles.footerNoteText, { color: theme.textSecondary }]}>
            FreeLib • Open Digital Library • Ad-Free Reading
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  brandCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  headerActions: {
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
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  avatarImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  avatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionMargin: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubheading: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  spotlightCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  spotlightRow: {
    flexDirection: 'row',
    gap: 14,
  },
  spotlightCover: {
    width: 85,
    height: 125,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  spotlightContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  spotlightTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#38bdf820',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  spotlightBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
  },
  spotlightCategoryText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  spotlightTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 4,
  },
  spotlightAuthor: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
  progressBarWrapper: {
    marginTop: 8,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38bdf8',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  progressInfoText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
  },
  progressPercentText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
  },
  spotlightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  readNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  readNowBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bookCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bookCoverImg: {
    width: '100%',
    height: 130,
    backgroundColor: '#e2e8f0',
  },
  bookCardBody: {
    padding: 10,
  },
  bookCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    minHeight: 34,
  },
  bookCardAuthor: {
    fontSize: 11,
    marginTop: 2,
  },
  bookCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f080',
  },
  bookRatingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bookReadBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  exploreCatalogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 20,
  },
  exploreIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreTextCluster: {
    flex: 1,
  },
  exploreTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  exploreSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: '500',
  },
});