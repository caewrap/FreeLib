import {
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Lock,
  LogOut,
  Mail,
  Sparkles,
  User,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomButton from '@/components/ui-custom/CustomButton';
import InfoRow from '@/components/ui-custom/InfoRow';
import PhotoPreview from '@/components/ui-custom/PhotoPreview';
import ProfileCard from '@/components/ui-custom/ProfileCard';
import { useAuth } from '@/context/auth-context';

const GENRES = ['Classics', 'Self-Growth', 'Philosophy', 'Psychology', 'History', 'Sci-Fi'];
const DAILY_GOALS = [15, 30, 45, 60];

export default function ProfileModal() {
  const {
    user,
    isLoggedIn,
    isProfileModalOpen,
    closeProfile,
    login,
    signup,
    logout,
    updatePreferences,
    updateAvatar,
  } = useAuth();

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(30);
  const [prefGenre, setPrefGenre] = useState(user?.favoriteGenre || 'Classics');
  const [prefGoal, setPrefGoal] = useState(user?.dailyGoalMins || 30);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Local snapshot media for book note / library card using expo-image-picker
  const [snapshotUri, setSnapshotUri] = useState<string | null>(null);

  const handleLoginSubmit = () => {
    if (!emailInput.trim()) {
      setFeedbackMsg('Please enter an email address.');
      return;
    }
    login(emailInput.trim());
    setEmailInput('');
    setPasswordInput('');
    setFeedbackMsg(null);
  };

  const handleSignupSubmit = () => {
    if (!nameInput.trim()) {
      setFeedbackMsg('Please enter your name.');
      return;
    }
    if (!emailInput.trim()) {
      setFeedbackMsg('Please enter an email address.');
      return;
    }
    signup(nameInput.trim(), emailInput.trim(), selectedGoal);
    setNameInput('');
    setEmailInput('');
    setPasswordInput('');
    setFeedbackMsg(null);
  };

  const handleDemoLogin = () => {
    login('reader@freelib.org', 'Avid Reader');
    setFeedbackMsg(null);
  };

  const handleSavePreferences = () => {
    updatePreferences(prefGenre, prefGoal);
    setFeedbackMsg('Preferences saved successfully!');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  return (
    <Modal
      visible={isProfileModalOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={closeProfile}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* MODAL HEADER */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <User size={20} color="#38bdf8" />
              <Text style={styles.modalTitle}>
                {isLoggedIn ? 'FreeLib Profile' : authMode === 'login' ? 'Welcome to FreeLib' : 'Join FreeLib'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeProfile}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {feedbackMsg && (
              <View style={styles.feedbackBanner}>
                <Text style={styles.feedbackText}>{feedbackMsg}</Text>
              </View>
            )}

            {/* IF NOT LOGGED IN: SHOW AUTH TABS (LOGIN / SIGNUP) */}
            {!isLoggedIn ? (
              <View style={styles.authContainer}>
                {/* MODE SWITCHER PILLS */}
                <View style={styles.modeTabs}>
                  <TouchableOpacity
                    style={[styles.modeTab, authMode === 'login' && styles.modeTabActive]}
                    onPress={() => {
                      setAuthMode('login');
                      setFeedbackMsg(null);
                    }}
                  >
                    <Text style={[styles.modeTabText, authMode === 'login' && styles.modeTabTextActive]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modeTab, authMode === 'signup' && styles.modeTabActive]}
                    onPress={() => {
                      setAuthMode('signup');
                      setFeedbackMsg(null);
                    }}
                  >
                    <Text style={[styles.modeTabText, authMode === 'signup' && styles.modeTabTextActive]}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* SIGN UP NAME */}
                {authMode === 'signup' && (
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                      <User size={16} color="#64748b" style={styles.inputIcon} />
                      <TextInput
                        placeholder="e.g. Alex Morgan"
                        placeholderTextColor="#64748b"
                        style={styles.textInput}
                        value={nameInput}
                        onChangeText={setNameInput}
                      />
                    </View>
                  </View>
                )}

                {/* EMAIL */}
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={16} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      placeholder="reader@example.com"
                      placeholderTextColor="#64748b"
                      style={styles.textInput}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={emailInput}
                      onChangeText={setEmailInput}
                    />
                  </View>
                </View>

                {/* PASSWORD */}
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={16} color="#64748b" style={styles.inputIcon} />
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#64748b"
                      secureTextEntry
                      style={styles.textInput}
                      value={passwordInput}
                      onChangeText={setPasswordInput}
                    />
                  </View>
                </View>

                {/* READING GOAL ON SIGN UP */}
                {authMode === 'signup' && (
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Daily Reading Target</Text>
                    <View style={styles.goalPillsRow}>
                      {DAILY_GOALS.map((mins) => (
                        <TouchableOpacity
                          key={mins}
                          style={[styles.goalPill, selectedGoal === mins && styles.goalPillActive]}
                          onPress={() => setSelectedGoal(mins)}
                        >
                          <Text
                            style={[
                              styles.goalPillText,
                              selectedGoal === mins && styles.goalPillTextActive,
                            ]}
                          >
                            {mins} mins
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* REUSABLE CUSTOM BUTTON */}
                <CustomButton
                  title={authMode === 'login' ? 'Sign In to FreeLib' : 'Create Free Account'}
                  variant="primary"
                  size="md"
                  fullWidth
                  onPress={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit}
                />

                {/* QUICK DEMO LOGIN BUTTON */}
                <CustomButton
                  title="Quick 1-Click Demo Login"
                  variant="secondary"
                  size="md"
                  fullWidth
                  onPress={handleDemoLogin}
                  icon={<Sparkles size={16} color="#38bdf8" />}
                />

                <Text style={styles.authTermsText}>
                  100% Free Public Library. No payment methods or subscriptions required.
                </Text>
              </View>
            ) : (
              /* LOGGED IN USER PROFILE VIEW */
              <View style={styles.profileContainer}>
                {/* REUSABLE CUSTOM COMPONENT: ProfileCard (with camera/image-picker) */}
                <ProfileCard
                  name={user?.name ?? 'Avid Reader'}
                  email={user?.email ?? 'reader@freelib.org'}
                  avatarUri={user?.avatarUri}
                  badgeText="FreeLib Patron • Public Domain"
                  onAvatarChanged={(newUri) => {
                    updateAvatar(newUri);
                    setFeedbackMsg('Profile photo updated successfully!');
                    setTimeout(() => setFeedbackMsg(null), 2500);
                  }}
                />

                {/* REUSABLE CUSTOM COMPONENTS: InfoRow for reading statistics */}
                <Text style={styles.sectionHeading}>Your Reading Record</Text>

                <InfoRow
                  icon={<BookOpen size={18} color="#38bdf8" />}
                  label="Books Completed"
                  sublabel="Classics read in FreeLib"
                  value={`${user?.booksRead ?? 12} books`}
                  accentColor="#38bdf8"
                />

                <InfoRow
                  icon={<Flame size={18} color="#f97316" />}
                  label="Reading Streak"
                  sublabel="Consecutive daily sessions"
                  value={`${user?.streak ?? 5} Days`}
                  accentColor="#f97316"
                />

                <InfoRow
                  icon={<Award size={18} color="#facc15" />}
                  label="Achievements Unlocked"
                  sublabel="Night Owl, Speed Demon & more"
                  value={`${user?.badges ?? 4} Badges`}
                  accentColor="#facc15"
                />

                {/* REUSABLE CUSTOM COMPONENT: PhotoPreview (Camera / Media Picker) */}
                <Text style={styles.sectionHeading}>Camera & Snapshot Media</Text>
                <PhotoPreview
                  imageUri={snapshotUri}
                  onImageSelected={(uri) => {
                    setSnapshotUri(uri);
                    setFeedbackMsg('Snapshot saved to local media cache!');
                    setTimeout(() => setFeedbackMsg(null), 2500);
                  }}
                  onClear={() => setSnapshotUri(null)}
                  title="Capture Library Card or Book Note"
                  subtitle="Use device camera or photo gallery via expo-image-picker"
                />

                {/* READING PREFERENCES */}
                <View style={styles.preferencesSection}>
                  <Text style={styles.prefSectionHeading}>Reading Preferences</Text>

                  {/* FAVORITE GENRE */}
                  <Text style={styles.prefSubLabel}>Preferred Genre</Text>
                  <View style={styles.genreTagsWrap}>
                    {GENRES.map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genreTag, prefGenre === g && styles.genreTagActive]}
                        onPress={() => setPrefGenre(g)}
                      >
                        <Text style={[styles.genreTagText, prefGenre === g && styles.genreTagTextActive]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* DAILY TARGET */}
                  <Text style={[styles.prefSubLabel, { marginTop: 14 }]}>Daily Target</Text>
                  <View style={styles.goalPillsRow}>
                    {DAILY_GOALS.map((mins) => (
                      <TouchableOpacity
                        key={mins}
                        style={[styles.goalPill, prefGoal === mins && styles.goalPillActive]}
                        onPress={() => setPrefGoal(mins)}
                      >
                        <Text
                          style={[
                            styles.goalPillText,
                            prefGoal === mins && styles.goalPillTextActive,
                          ]}
                        >
                          {mins} mins
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <CustomButton
                    title="Save Preferences"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onPress={handleSavePreferences}
                    icon={<CheckCircle2 size={16} color="#38bdf8" />}
                    style={{ marginTop: 14 }}
                  />
                </View>

                {/* LOG OUT BUTTON */}
                <CustomButton
                  title="Sign Out of FreeLib"
                  variant="secondary"
                  size="md"
                  fullWidth
                  onPress={logout}
                  icon={<LogOut size={16} color="#ef4444" />}
                  textStyle={{ color: '#ef4444' }}
                />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flexGrow: 0,
  },
  modalBodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  feedbackBanner: {
    backgroundColor: '#0284c720',
    borderColor: '#38bdf8',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  feedbackText: {
    color: '#38bdf8',
    fontSize: 13,
    textAlign: 'center',
  },
  authContainer: {
    gap: 14,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 4,
    marginBottom: 6,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#2563eb',
  },
  modeTabText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
  },
  goalPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalPillActive: {
    backgroundColor: '#0284c720',
    borderColor: '#38bdf8',
  },
  goalPillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  goalPillTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  authTermsText: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  profileContainer: {
    gap: 14,
  },
  sectionHeading: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
  preferencesSection: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 6,
  },
  prefSectionHeading: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  prefSubLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  genreTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#0f172a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  genreTagActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  genreTagText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  genreTagTextActive: {
    color: '#ffffff',
  },
});
