/**
 * Design Tokens - Typography
 *
 * Consistent typography scales for web and mobile.
 */

// Font families
export const fontFamily = {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
} as const;

// Font sizes (in rem for web, points for mobile)
export const fontSize = {
  xs: { web: '0.75rem', mobile: 12 },
  sm: { web: '0.875rem', mobile: 14 },
  base: { web: '1rem', mobile: 16 },
  lg: { web: '1.125rem', mobile: 18 },
  xl: { web: '1.25rem', mobile: 20 },
  '2xl': { web: '1.5rem', mobile: 24 },
  '3xl': { web: '1.875rem', mobile: 30 },
  '4xl': { web: '2.25rem', mobile: 36 },
  '5xl': { web: '3rem', mobile: 48 },
  '6xl': { web: '3.75rem', mobile: 60 },
} as const;

// Font weights
export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Line heights
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Text styles (compound)
export const textStyles = {
  headingXl: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  headingLg: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  headingMd: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  headingSm: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  bodyLg: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
  },
  bodyMd: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  bodySm: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
} as const;
