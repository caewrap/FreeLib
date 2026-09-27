import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatarUri?: string;
  streak: number;
  booksRead: number;
  badges: number;
  favoriteGenre: string;
  dailyGoalMins: number;
  memberSince: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isProfileModalOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string, goalMins?: number) => void;
  logout: () => void;
  updatePreferences: (favoriteGenre: string, dailyGoalMins: number) => void;
  updateAvatar: (uri: string) => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  name: 'Avid Reader',
  email: 'reader@freelib.org',
  avatarUri: undefined,
  streak: 5,
  booksRead: 12,
  badges: 4,
  favoriteGenre: 'Classics',
  dailyGoalMins: 30,
  memberSince: 'Sep 2026',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_DEMO_USER);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfile = () => setIsProfileModalOpen(true);
  const closeProfile = () => setIsProfileModalOpen(false);

  const login = (email: string, name?: string) => {
    const derivedName = name || (email ? email.split('@')[0] : 'Avid Reader');
    setUser({
      name: derivedName,
      email: email || 'reader@freereader.org',
      streak: 5,
      booksRead: 12,
      badges: 4,
      favoriteGenre: 'Classics',
      dailyGoalMins: 30,
      memberSince: 'Sep 2026',
    });
    setIsProfileModalOpen(false);
  };

  const signup = (name: string, email: string, goalMins = 30) => {
    setUser({
      name: name || 'New Reader',
      email: email || 'newreader@library.org',
      streak: 1,
      booksRead: 0,
      badges: 1,
      favoriteGenre: 'Classics',
      dailyGoalMins: goalMins,
      memberSince: 'Today',
    });
    setIsProfileModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updatePreferences = (favoriteGenre: string, dailyGoalMins: number) => {
    if (user) {
      setUser({ ...user, favoriteGenre, dailyGoalMins });
    }
  };

  const updateAvatar = (uri: string) => {
    if (user) {
      setUser({ ...user, avatarUri: uri });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isProfileModalOpen,
        openProfile,
        closeProfile,
        login,
        signup,
        logout,
        updatePreferences,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
