/**
 * Design Tokens - Colors
 *
 * These color values can be used across web and mobile projects.
 * Copy the relevant format for your project.
 */

// Primary palette
export const primary = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
} as const;

// Neutral palette
export const neutral = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} as const;

// Semantic colors
export const semantic = {
  success: {
    light: '#4ade80',
    default: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fbbf24',
    default: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#f87171',
    default: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#60a5fa',
    default: '#3b82f6',
    dark: '#2563eb',
  },
} as const;

// Dark theme
export const darkTheme = {
  background: neutral[900],
  card: neutral[800],
  border: neutral[700],
  text: {
    primary: neutral[50],
    secondary: neutral[400],
    muted: neutral[500],
  },
  primary: primary[500],
} as const;

// Light theme
export const lightTheme = {
  background: '#ffffff',
  card: neutral[50],
  border: neutral[200],
  text: {
    primary: neutral[900],
    secondary: neutral[600],
    muted: neutral[500],
  },
  primary: primary[500],
} as const;

// CSS Variables format (for web projects)
export const cssVariables = {
  light: `
    --color-background: 0 0% 100%;
    --color-foreground: 222 47% 11%;
    --color-card: 210 40% 98%;
    --color-border: 220 13% 91%;
    --color-muted: 220 9% 46%;
    --color-primary: 199 89% 48%;
  `,
  dark: `
    --color-background: 222 47% 11%;
    --color-foreground: 210 40% 98%;
    --color-card: 217 33% 17%;
    --color-border: 217 19% 27%;
    --color-muted: 215 16% 57%;
    --color-primary: 199 89% 48%;
  `,
};

// Tailwind config format
export const tailwindColors = {
  primary,
  neutral,
  success: semantic.success.default,
  warning: semantic.warning.default,
  error: semantic.error.default,
  info: semantic.info.default,
};
