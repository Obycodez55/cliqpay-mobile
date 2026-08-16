export const violetColors = {
  50: '#F1EFFB',
  100: '#E7E0F2',
  300: '#C6B3E3',
  500: '#926ECB',
  700: '#3F3061',
  800: '#2A1F34',
  900: '#191128',
} as const;

export const terracotta = {
  base: '#C1552E',
  tint: '#FBEEE8',
} as const;

export type ThemeColors = {
  canvas: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  successTint: string;
  error: string;
  errorTint: string;
  warning: string;
  warningTint: string;
  balancePositive: string;
  balanceNegative: string;
  terracotta: string;
  terracottaTint: string;
};

const lightSuccess = '#1E8A4C';
const lightError = '#D64545';

export const lightColors: ThemeColors = {
  canvas: violetColors[50],
  surface: '#FFFFFF',
  border: '#ECECEC',
  textPrimary: '#161616',
  textSecondary: '#8A8A8E',
  success: lightSuccess,
  successTint: '#EAF7EF',
  error: lightError,
  errorTint: '#FDEBEA',
  warning: '#C88A1D',
  warningTint: '#FDF3E0',
  balancePositive: lightSuccess,
  balanceNegative: lightError,
  terracotta: terracotta.base,
  terracottaTint: terracotta.tint,
};

const darkSuccess = '#5FC98A';
const darkError = '#E8776F';

export const darkColors: ThemeColors = {
  canvas: violetColors[900],
  surface: '#241A33',
  border: '#342750',
  textPrimary: '#F5F3F8',
  textSecondary: '#9C93AC',
  success: darkSuccess,
  successTint: '#1F3A2A',
  error: darkError,
  errorTint: '#3A2422',
  warning: '#E0AC4D',
  warningTint: '#3A2E1A',
  balancePositive: darkSuccess,
  balanceNegative: darkError,
  terracotta: terracotta.base,
  terracottaTint: terracotta.tint,
};
