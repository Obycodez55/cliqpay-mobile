import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { darkTheme, lightTheme, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const scheme = useColorScheme();
  const theme = useMemo(() => (scheme === 'dark' ? darkTheme : lightTheme), [scheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return theme;
}
