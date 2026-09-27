import React, { createContext, useContext, useState } from 'react';

export type ColorMode = 'white' | 'navy';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  surfaceCard: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  navyAccent: string;
  blueAccent: string;
  buttonBg: string;
  buttonText: string;
  tagBg: string;
  tagText: string;
  cardBg: string;
  chipBg: string;
  chipActiveBg: string;
  chipActiveText: string;
  inputBg: string;
  statBadgeBg: string;
}

export const WHITE_THEME: ThemeColors = {
  bg: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  surfaceCard: '#ffffff',
  border: '#e2e8f0',
  borderSubtle: '#edf2f7',
  textPrimary: '#0a192f',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  navyAccent: '#0a192f',
  blueAccent: '#2563eb',
  buttonBg: '#0a192f',
  buttonText: '#ffffff',
  tagBg: '#e0e7ff',
  tagText: '#1e40af',
  cardBg: '#ffffff',
  chipBg: '#e2e8f0',
  chipActiveBg: '#0a192f',
  chipActiveText: '#ffffff',
  inputBg: '#ffffff',
  statBadgeBg: '#f1f5f9',
};

export const NAVY_THEME: ThemeColors = {
  bg: '#0a192f',
  surface: '#112240',
  surfaceAlt: '#172a45',
  surfaceCard: '#112240',
  border: '#233554',
  borderSubtle: '#1e293b',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  navyAccent: '#0a192f',
  blueAccent: '#38bdf8',
  buttonBg: '#ffffff',
  buttonText: '#0a192f',
  tagBg: '#1e3a5f',
  tagText: '#93c5fd',
  cardBg: '#112240',
  chipBg: '#172a45',
  chipActiveBg: '#38bdf8',
  chipActiveText: '#0a192f',
  inputBg: '#112240',
  statBadgeBg: '#172a45',
};

interface ThemeContextType {
  colorMode: ColorMode;
  isNavy: boolean;
  setColorMode: (mode: ColorMode) => void;
  toggleTheme: () => void;
  theme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  // Always default to 'white' mode so it doesn't automatically turn to dark mode
  const [colorMode, setColorMode] = useState<ColorMode>('white');
  const isNavy = colorMode === 'navy';

  const toggleTheme = () => {
    setColorMode((prev) => (prev === 'white' ? 'navy' : 'white'));
  };

  const theme = isNavy ? NAVY_THEME : WHITE_THEME;

  return (
    <ThemeContext.Provider value={{ colorMode, isNavy, setColorMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}
