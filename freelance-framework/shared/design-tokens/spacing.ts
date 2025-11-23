/**
 * Design Tokens - Spacing
 *
 * Consistent spacing scale for web and mobile.
 */

// Base spacing unit (4px)
const BASE = 4;

// Spacing scale
export const spacing = {
  0: 0,
  0.5: BASE * 0.5,  // 2px
  1: BASE,          // 4px
  1.5: BASE * 1.5,  // 6px
  2: BASE * 2,      // 8px
  2.5: BASE * 2.5,  // 10px
  3: BASE * 3,      // 12px
  3.5: BASE * 3.5,  // 14px
  4: BASE * 4,      // 16px
  5: BASE * 5,      // 20px
  6: BASE * 6,      // 24px
  7: BASE * 7,      // 28px
  8: BASE * 8,      // 32px
  9: BASE * 9,      // 36px
  10: BASE * 10,    // 40px
  11: BASE * 11,    // 44px
  12: BASE * 12,    // 48px
  14: BASE * 14,    // 56px
  16: BASE * 16,    // 64px
  20: BASE * 20,    // 80px
  24: BASE * 24,    // 96px
  28: BASE * 28,    // 112px
  32: BASE * 32,    // 128px
  36: BASE * 36,    // 144px
  40: BASE * 40,    // 160px
  44: BASE * 44,    // 176px
  48: BASE * 48,    // 192px
  52: BASE * 52,    // 208px
  56: BASE * 56,    // 224px
  60: BASE * 60,    // 240px
  64: BASE * 64,    // 256px
} as const;

// Container widths
export const containerWidth = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 2,
  default: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

// Common layout spacing
export const layout = {
  // Page padding
  pagePaddingX: {
    mobile: spacing[4],  // 16px
    tablet: spacing[6],  // 24px
    desktop: spacing[8], // 32px
  },
  pagePaddingY: {
    mobile: spacing[6],  // 24px
    desktop: spacing[8], // 32px
  },
  // Section spacing
  sectionGap: {
    mobile: spacing[12], // 48px
    desktop: spacing[24], // 96px
  },
  // Card padding
  cardPadding: {
    sm: spacing[4],  // 16px
    md: spacing[6],  // 24px
    lg: spacing[8],  // 32px
  },
  // Component gaps
  componentGap: {
    xs: spacing[1],  // 4px
    sm: spacing[2],  // 8px
    md: spacing[4],  // 16px
    lg: spacing[6],  // 24px
    xl: spacing[8],  // 32px
  },
} as const;
