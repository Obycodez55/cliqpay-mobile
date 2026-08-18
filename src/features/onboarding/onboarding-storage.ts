import AsyncStorage from '@react-native-async-storage/async-storage';

// Non-sensitive UI-state flag only ("has the user seen the carousel"), never auth/session data —
// AsyncStorage is fine here; expo-secure-store stays reserved for tokens per docs/conventions.md.
const HAS_ONBOARDED_KEY = 'cliqpay.hasOnboarded';

export async function getHasOnboarded(): Promise<boolean> {
  const value = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
  return value === 'true';
}

export async function setHasOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(HAS_ONBOARDED_KEY, String(value));
}
