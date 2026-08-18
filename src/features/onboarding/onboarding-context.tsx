import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { getHasOnboarded, setHasOnboarded } from '@/features/onboarding/onboarding-storage';

type OnboardingState = {
  /** True once onboarding has ever been completed. Stays true forever, including after logout. */
  hasOnboarded: boolean;
  /** True while the persisted flag is still being read on launch. */
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [hasOnboarded, setHasOnboardedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHasOnboarded()
      .then(setHasOnboardedState)
      .finally(() => setIsLoading(false));
  }, []);

  const completeOnboarding = useCallback(async () => {
    await setHasOnboarded(true);
    setHasOnboardedState(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ hasOnboarded, isLoading, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingState {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
