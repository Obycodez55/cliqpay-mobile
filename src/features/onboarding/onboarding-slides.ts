export type OnboardingSlide = {
  key: string;
  headline: string;
  supportingLine: string;
  /** Only slide 1 gets the image placeholder; slides 2-3 stay typography-led per design-system.md §1. */
  showImagePlaceholder?: boolean;
};

// Headlines are exact copy from the issue spec. Supporting lines are a first pass, not yet
// reviewed against docs/design-system.md §4 (copy voice is still a placeholder there).
export const onboardingSlides: OnboardingSlide[] = [
  {
    key: 'send',
    headline: 'Send money in seconds',
    supportingLine: 'Transfer to friends and family instantly — no bank details needed.',
    showImagePlaceholder: true,
  },
  {
    key: 'secured',
    headline: 'Your wallet, secured',
    supportingLine: 'Your money and your data stay protected, every step of the way.',
  },
  {
    key: 'no-fees',
    headline: 'No fees between friends',
    supportingLine: 'Send and receive from people you know, free of charge.',
  },
];
