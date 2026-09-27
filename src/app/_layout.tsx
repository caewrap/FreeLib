import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import ProfileModal from '@/components/profile-modal';
import { AuthProvider } from '@/context/auth-context';
import { AppThemeProvider } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <AnimatedSplashOverlay />
            <AppTabs />
            <ProfileModal />
          </AuthProvider>
        </ThemeProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
