export const colors = {
  quiz: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    success: '#22c55e',
    error: '#ef4444',
    dark: '#0f172a',
    darker: '#020617',
    card: '#1e293b',
    border: '#334155',
  },
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
};

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Category = 'react' | 'vue' | 'typescript' | 'javascript' | 'css' | 'nextjs' | 'testing' | 'performance' | 'accessibility';

export const CATEGORY_ICONS: Record<Category | 'mixed', string> = {
  mixed: '🎲',
  react: '⚛️',
  vue: '💚',
  typescript: '🔷',
  javascript: '🟨',
  css: '🎨',
  nextjs: '▲',
  testing: '🧪',
  performance: '⚡',
  accessibility: '♿',
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: colors.quiz.success,
  intermediate: colors.quiz.accent,
  advanced: '#f97316',
  expert: colors.quiz.error,
};

export const XP_PER_LEVEL = 1000;
