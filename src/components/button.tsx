import { useCallback } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/theme-provider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_SCALE = 0.97;
// damping >= 2*sqrt(stiffness*mass) keeps this critically damped (no overshoot) — press
// feedback, not a momentum gesture, per design-system.md §2.
const SPRING_CONFIG = { damping: 40, stiffness: 300, mass: 1 };

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export function Button({ label, variant = 'primary', disabled = false, onPressIn, onPressOut, ...rest }: ButtonProps) {
  const theme = useAppTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: NonNullable<PressableProps['onPressIn']> = useCallback(
    (event) => {
      scale.value = reducedMotion ? PRESS_SCALE : withSpring(PRESS_SCALE, SPRING_CONFIG);
      onPressIn?.(event);
    },
    [onPressIn, reducedMotion, scale],
  );

  const handlePressOut: NonNullable<PressableProps['onPressOut']> = useCallback(
    (event) => {
      scale.value = reducedMotion ? 1 : withSpring(1, SPRING_CONFIG);
      onPressOut?.(event);
    },
    [onPressOut, reducedMotion, scale],
  );

  const isPrimary = variant === 'primary';
  const isDark = theme.mode === 'dark';
  const primaryFill = isDark ? theme.palette.violet[500] : theme.palette.violet[700];
  const secondaryFill = isDark ? theme.palette.violet[800] : theme.palette.violet[100];
  const secondaryText = isDark ? theme.palette.violet[500] : theme.palette.violet[700];

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isPrimary ? primaryFill : secondaryFill,
          paddingVertical: theme.spacing[16],
          paddingHorizontal: theme.spacing[24],
          borderRadius: theme.spacing[12],
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
      {...rest}
    >
      <Text
        style={{
          color: isPrimary ? theme.palette.violet[50] : secondaryText,
          fontSize: theme.typography.body.fontSize,
          lineHeight: theme.typography.body.lineHeight,
          fontWeight: '600',
          letterSpacing: theme.typography.body.letterSpacing,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
