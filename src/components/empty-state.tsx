import { useEffect, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/theme-provider';

const FADE_DURATION = 240;

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const theme = useAppTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (!reducedMotion) {
      opacity.value = withTiming(1, { duration: FADE_DURATION });
    }
  }, [reducedMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: theme.colors.border,
          borderRadius: theme.spacing[16],
          paddingVertical: theme.spacing[40],
          paddingHorizontal: theme.spacing[24],
        },
        animatedStyle,
      ]}
    >
      {icon ? <View style={{ marginBottom: theme.spacing[16] }}>{icon}</View> : null}
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.heading.fontSize,
          lineHeight: theme.typography.heading.lineHeight,
          fontWeight: theme.typography.heading.fontWeight,
          letterSpacing: theme.typography.heading.letterSpacing,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            fontWeight: theme.typography.body.fontWeight,
            letterSpacing: theme.typography.body.letterSpacing,
            textAlign: 'center',
            marginTop: theme.spacing[8],
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );
}
