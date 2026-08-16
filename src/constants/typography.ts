import type { TextStyle } from 'react-native';

export type TypographyStyle = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing: number;
};

// RN's letterSpacing is in points, not em — convert against each style's own fontSize.
const emToPoints = (em: number, fontSize: number) => Math.round(em * fontSize * 100) / 100;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: emToPoints(-0.02, 34) },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: emToPoints(-0.01, 24) },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: emToPoints(0, 18) },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400', letterSpacing: emToPoints(0, 16) },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500', letterSpacing: emToPoints(0.01, 13) },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '600', letterSpacing: emToPoints(0.02, 11) },
} satisfies Record<string, TypographyStyle>;

export type TypographyScale = typeof typography;
