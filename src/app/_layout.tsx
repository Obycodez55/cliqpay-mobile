import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { OnboardingProvider, useOnboarding } from '@/features/onboarding/onboarding-context';
import { ThemeProvider } from '@/hooks/theme-provider';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { hasOnboarded, isLoading } = useOnboarding();

  // The splash overlay (rendered by the caller, above this) covers the screen while this
  // resolves, so there's nothing to show here until the persisted flag is known.
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={hasOnboarded}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      {/* Always mounted (not gated by hasOnboarded) so "Log in" is reachable from onboarding too. */}
      <Stack.Screen name="login" options={{ headerShown: true, title: 'Log in' }} />
      <Stack.Screen name="register" options={{ headerShown: true, title: 'Create account' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ThemeProvider>
          <OnboardingProvider>
            <AnimatedSplashOverlay />
            <RootNavigator />
          </OnboardingProvider>
        </ThemeProvider>
      </NavigationThemeProvider>
    </GestureHandlerRootView>
  );
}
