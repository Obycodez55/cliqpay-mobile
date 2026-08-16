import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Dimensions, Modal, Pressable, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/theme-provider';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const RUBBER_BAND_COEFFICIENT = 0.55;
const DISMISS_VELOCITY_THRESHOLD = 1000;
const DISMISS_DISTANCE_RATIO = 0.3;

// Critically damped (damping >= 2*sqrt(stiffness*mass)) — used whenever the sheet moves without
// a gesture behind it (open, backdrop tap, programmatic close), so there's no velocity to carry.
const SETTLE_SPRING = { damping: 38, stiffness: 280, mass: 1 };
// Underdamped on purpose — only used to finish a motion the user's own drag already put in motion.
const RELEASE_SPRING = { damping: 24, stiffness: 280, mass: 1 };
const FADE_DURATION = 220;
// No scrim token exists in the theme (design-system.md §1 has no dedicated overlay color) — a
// fixed black scrim is standard across both themes, unlike surface/text colors which invert.
const SCRIM_COLOR = '#000000';
const SCRIM_MAX_OPACITY = 0.5;

// iOS's rubber-band curve: resistance grows with overshoot instead of hard-stopping at the boundary.
function rubberBandClamp(overshoot: number, dimension: number) {
  return (overshoot * dimension * RUBBER_BAND_COEFFICIENT) / (dimension + RUBBER_BAND_COEFFICIENT * overshoot);
}

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const theme = useAppTheme();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(visible);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const startY = useSharedValue(SCREEN_HEIGHT);
  const sheetHeight = useSharedValue(SCREEN_HEIGHT);
  const progress = useSharedValue(0);

  // Set right before a gesture-driven close starts its own velocity-aware spring, so the
  // `visible`-prop effect below (which fires a moment later once the parent re-renders) doesn't
  // clobber it with a plain no-velocity settle — that would flatten the momentum mid-flight.
  const gestureClosing = useRef(false);

  const handleClosed = useCallback(() => {
    setMounted(false);
  }, []);

  useEffect(() => {
    if (visible) {
      gestureClosing.current = false;
      setMounted(true);
      if (reducedMotion) {
        translateY.value = 0;
        progress.value = withTiming(1, { duration: FADE_DURATION });
      } else {
        translateY.value = withSpring(0, SETTLE_SPRING);
        progress.value = withTiming(1, { duration: FADE_DURATION });
      }
      return;
    }

    if (!mounted) return;
    if (gestureClosing.current) {
      gestureClosing.current = false;
      return;
    }

    if (reducedMotion) {
      translateY.value = 0;
      progress.value = withTiming(0, { duration: FADE_DURATION }, (finished) => {
        if (finished) runOnJS(handleClosed)();
      });
    } else {
      translateY.value = withSpring(sheetHeight.value, SETTLE_SPRING, (finished) => {
        if (finished) runOnJS(handleClosed)();
      });
      progress.value = withTiming(0, { duration: FADE_DURATION });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      sheetHeight.value = event.nativeEvent.layout.height;
    },
    [sheetHeight],
  );

  const beginGestureDismiss = useCallback(() => {
    gestureClosing.current = true;
    onClose();
  }, [onClose]);

  const pan = Gesture.Pan()
    .enabled(!reducedMotion)
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const next = startY.value + event.translationY;
      if (next < 0) {
        translateY.value = -rubberBandClamp(-next, sheetHeight.value);
      } else {
        translateY.value = next;
      }
      progress.value = clamp(1 - translateY.value / sheetHeight.value, 0, 1);
    })
    .onEnd((event) => {
      const draggedRatio = translateY.value / sheetHeight.value;
      const shouldDismiss = draggedRatio > DISMISS_DISTANCE_RATIO || event.velocityY > DISMISS_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        translateY.value = withSpring(sheetHeight.value, { ...RELEASE_SPRING, velocity: event.velocityY }, (finished) => {
          if (finished) runOnJS(handleClosed)();
        });
        progress.value = withTiming(0, { duration: FADE_DURATION });
        runOnJS(beginGestureDismiss)();
      } else {
        translateY.value = withSpring(0, { ...RELEASE_SPRING, velocity: event.velocityY });
        progress.value = withTiming(1, { duration: FADE_DURATION });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * SCRIM_MAX_OPACITY,
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1 }}>
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: SCRIM_COLOR }, backdropStyle]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityRole="button" accessibilityLabel="Dismiss" />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            onLayout={handleLayout}
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: theme.spacing[24],
                borderTopRightRadius: theme.spacing[24],
                paddingTop: theme.spacing[12],
                paddingHorizontal: theme.spacing[20],
                paddingBottom: theme.spacing[32],
              },
              sheetStyle,
            ]}
          >
            <View
              style={{
                alignSelf: 'center',
                width: theme.spacing[32],
                height: theme.spacing[4],
                borderRadius: theme.spacing[4],
                backgroundColor: theme.colors.border,
                marginBottom: theme.spacing[12],
              }}
            />
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
