import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/theme-provider';

// Placeholder route so onboarding's "Get Started" CTA has somewhere to go — real screen is
// Phase 1 auth work, not this issue.
export default function RegisterScreen() {
  const theme = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[8], padding: theme.spacing[24] }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.heading.fontSize,
            lineHeight: theme.typography.heading.lineHeight,
            fontWeight: theme.typography.heading.fontWeight,
          }}
        >
          Create account
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            textAlign: 'center',
          }}
        >
          Coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
