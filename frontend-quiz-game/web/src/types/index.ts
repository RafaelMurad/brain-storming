export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Category =
  | 'react'
  | 'vue'
  | 'angular'
  | 'typescript'
  | 'javascript'
  | 'css'
  | 'html'
  | 'nextjs'
  | 'svelte'
  | 'testing'
  | 'performance'
  | 'accessibility';

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  code?: string;
  options: string[];
  points: number;
  timeLimit: number;
}

export interface QuestionWithAnswer extends Question {
  correctAnswer: number;
  explanation: string;
  source: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastPlayedAt: string;
  createdAt: string;
  stats: UserStats;
  achievements: Achievement[];
  rank: number;
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
  categoryStats: Record<Category, CategoryStats>;
}

export interface CategoryStats {
  total: number;
  correct: number;
  accuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  totalXp: number;
  streak: number;
  accuracy: number;
}

export interface GameSession {
  id: string;
  userId: string;
  category: Category | 'mixed';
  difficulty: Difficulty;
  questions: Question[];
  currentIndex: number;
  answers: AnswerResult[];
  score: number;
  startedAt: string;
  isComplete: boolean;
}

export interface AnswerResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string;
  source: string;
  timeSpent: number;
  pointsEarned: number;
}

export interface GameResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalScore: number;
  xpEarned: number;
  streakBonus: number;
  newStreak: number;
  levelUp: boolean;
  newLevel?: number;
  newAchievements: Achievement[];
  timeSpent: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  questionCount: number;
  icon: string;
}

export const CATEGORY_ICONS: Record<Category, string> = {
  react: '⚛️',
  vue: '💚',
  angular: '🅰️',
  typescript: '🔷',
  javascript: '🟨',
  css: '🎨',
  html: '📄',
  nextjs: '▲',
  svelte: '🔶',
  testing: '🧪',
  performance: '⚡',
  accessibility: '♿',
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'text-quiz-success',
  intermediate: 'text-quiz-accent',
  advanced: 'text-orange-500',
  expert: 'text-quiz-error',
};

export const XP_PER_LEVEL = 1000;
