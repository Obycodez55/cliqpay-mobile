import { useOnboarding } from '@/features/onboarding/onboarding-context';
import { OnboardingCarousel } from '@/features/onboarding/onboarding-carousel';

export default function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  return <OnboardingCarousel onComplete={completeOnboarding} />;
}
