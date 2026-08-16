import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/theme-provider';

// Critically damped — the toast isn't gesture-driven, so there's no release velocity to carry;
// same rationale as bottom-sheet.tsx's SETTLE_SPRING.
const SETTLE_SPRING = { damping: 30, stiffness: 260, mass: 1 };
const FADE_DURATION = 200;
const ENTER_SCALE_START = 0.95;
const DEFAULT_DURATION = 2800;

export type ToastProps = {
  visible: boolean;
  message: string;
  duration?: number;
  onDismiss?: () => void;
};

export function Toast({ visible, message, duration = DEFAULT_DURATION, onDismiss }: ToastProps) {
  const theme = useAppTheme();
  const reducedMotion = useReducedMotion();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(ENTER_SCALE_START);
  const translateY = useSharedValue<number>(theme.spacing[8]);

  useEffect(() => {
    if (visible) {
      opacity.value = reducedMotion ? withTiming(1, { duration: FADE_DURATION }) : withSpring(1, SETTLE_SPRING);
      scale.value = reducedMotion ? 1 : withSpring(1, SETTLE_SPRING);
      translateY.value = reducedMotion ? 0 : withSpring(0, SETTLE_SPRING);
    } else {
      opacity.value = reducedMotion ? withTiming(0, { duration: FADE_DURATION }) : withSpring(0, SETTLE_SPRING);
      scale.value = reducedMotion ? 1 : withSpring(ENTER_SCALE_START, SETTLE_SPRING);
      translateY.value = reducedMotion ? 0 : withSpring(theme.spacing[8], SETTLE_SPRING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (!visible || !duration) return;
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: theme.spacing[24],
          right: theme.spacing[24],
          bottom: theme.spacing[48],
          alignItems: 'center',
        },
        animatedStyle,
      ]}
    >
      <Animated.View
        style={{
          // violet-800 is the design system's documented dark-theme elevated surface (design-system.md
          // §1); reused unconditionally here so the "dark pill" reads the same in both themes rather
          // than inverting like textPrimary would.
          backgroundColor: theme.palette.violet[800],
          borderRadius: theme.spacing[24],
          paddingVertical: theme.spacing[12],
          paddingHorizontal: theme.spacing[20],
          maxWidth: '100%',
        }}
      >
        <Text
          style={{
            color: theme.palette.violet[50],
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight,
            fontWeight: '600',
            letterSpacing: theme.typography.caption.letterSpacing,
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {message}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
