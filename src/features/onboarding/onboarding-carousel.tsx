import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { ImagePlaceholder } from '@/features/onboarding/image-placeholder';
import { onboardingSlides } from '@/features/onboarding/onboarding-slides';
import { PaginationDots } from '@/features/onboarding/pagination-dots';
import { useAppTheme } from '@/hooks/theme-provider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_COUNT = onboardingSlides.length;

const RUBBER_BAND_COEFFICIENT = 0.55;
const SWIPE_DISTANCE_RATIO = 0.25;
const SWIPE_VELOCITY_THRESHOLD = 600;
const FADE_DURATION = 220;

// Critically damped — a page snap is a state transition, not a momentum gesture that should
// overshoot, per design-system.md §2. Release still carries the gesture's own velocity through.
const RELEASE_SPRING = { damping: 26, stiffness: 260, mass: 1 };

function rubberBandClamp(overshoot: number, dimension: number) {
  'worklet';
  return (overshoot * dimension * RUBBER_BAND_COEFFICIENT) / (dimension + RUBBER_BAND_COEFFICIENT * overshoot);
}

function clampIndex(index: number) {
  return Math.min(Math.max(index, 0), SLIDE_COUNT - 1);
}

export type OnboardingCarouselProps = {
  /** Called once, when the user reaches the end and taps "Get Started". */
  onComplete: () => void;
};

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const fade = useSharedValue(1);

  const goToIndex = useCallback(
    (next: number, velocity = 0) => {
      const clamped = clampIndex(next);
      setIndex(clamped);
      if (reducedMotion) {
        fade.value = 0;
        translateX.value = -clamped * SCREEN_WIDTH;
        fade.value = withTiming(1, { duration: FADE_DURATION });
      } else {
        translateX.value = withSpring(-clamped * SCREEN_WIDTH, { ...RELEASE_SPRING, velocity });
      }
    },
    [fade, reducedMotion, translateX],
  );

  const handleSkip = useCallback(() => goToIndex(SLIDE_COUNT - 1), [goToIndex]);
  const handleLogin = useCallback(() => router.push('/login'), [router]);
  const handleGetStarted = useCallback(() => {
    onComplete();
    router.push('/register');
  }, [onComplete, router]);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      if (reducedMotion) return;
      const next = startX.value + event.translationX;
      const min = -(SLIDE_COUNT - 1) * SCREEN_WIDTH;
      if (next > 0) {
        translateX.value = rubberBandClamp(next, SCREEN_WIDTH);
      } else if (next < min) {
        translateX.value = min - rubberBandClamp(min - next, SCREEN_WIDTH);
      } else {
        translateX.value = next;
      }
    })
    .onEnd((event) => {
      const ratio = event.translationX / SCREEN_WIDTH;
      const strongSwipe = Math.abs(ratio) > SWIPE_DISTANCE_RATIO || Math.abs(event.velocityX) > SWIPE_VELOCITY_THRESHOLD;
      const delta = strongSwipe ? (ratio < 0 ? 1 : -1) : 0;
      runOnJS(goToIndex)(index + delta, event.velocityX);
    });

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: reducedMotion ? fade.value : 1,
  }));

  const isLastSlide = index === SLIDE_COUNT - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.canvas }} edges={['top', 'bottom']}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[24], paddingTop: theme.spacing[8] }]}>
        <Pressable onPress={handleSkip} disabled={isLastSlide} hitSlop={8} accessibilityRole="button">
          <Text style={[styles.headerLink, { color: theme.colors.textSecondary, opacity: isLastSlide ? 0 : 1 }]}>Skip</Text>
        </Pressable>
        <Pressable onPress={handleLogin} hitSlop={8} accessibilityRole="button">
          <Text style={[styles.headerLink, { color: theme.colors.textPrimary }]}>Log in</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <View style={styles.trackClip}>
          <Animated.View style={[styles.track, trackStyle]}>
            {onboardingSlides.map((slide) => (
              <View key={slide.key} style={[styles.slide, { width: SCREEN_WIDTH, paddingHorizontal: theme.spacing[32], gap: theme.spacing[16] }]}>
                {slide.showImagePlaceholder ? (
                  <View style={{ width: '100%', alignItems: 'center', marginBottom: theme.spacing[16] }}>
                    <ImagePlaceholder />
                  </View>
                ) : null}
                <Text
                  style={[
                    styles.headline,
                    {
                      color: theme.colors.textPrimary,
                      fontSize: theme.typography.title.fontSize,
                      lineHeight: theme.typography.title.lineHeight,
                      fontWeight: theme.typography.title.fontWeight,
                      letterSpacing: theme.typography.title.letterSpacing,
                    },
                  ]}
                >
                  {slide.headline}
                </Text>
                <Text
                  style={[
                    styles.supporting,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.body.fontSize,
                      lineHeight: theme.typography.body.lineHeight,
                    },
                  ]}
                >
                  {slide.supportingLine}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={[styles.footer, { paddingHorizontal: theme.spacing[24], paddingBottom: theme.spacing[8] }]}>
        <PaginationDots count={SLIDE_COUNT} activeIndex={index} />
        {isLastSlide ? (
          <View style={{ width: '100%', marginTop: theme.spacing[24] }}>
            <Button label="Get Started" variant="primary" onPress={handleGetStarted} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  trackClip: {
    flex: 1,
    overflow: 'hidden',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontWeight: '700',
    textAlign: 'center',
  },
  supporting: {
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
});
