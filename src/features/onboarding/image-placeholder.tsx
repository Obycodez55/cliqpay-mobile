import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '@/hooks/theme-provider';

// Stand-in for slide 1's real illustration (sourced separately, per the issue spec). Uses the
// design system's one sanctioned gradient pair (design-system.md §1) since this is a genuine
// hero element — not decorative reuse of the gradient elsewhere.
export function ImagePlaceholder() {
  const theme = useAppTheme();
  const colors: [string, string] =
    theme.mode === 'dark' ? [theme.palette.violet[500], theme.palette.violet[700]] : [theme.palette.violet[700], theme.palette.violet[800]];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: '100%',
        aspectRatio: 1,
        borderRadius: theme.spacing[24],
        maxWidth: 280,
      }}
    />
  );
}
