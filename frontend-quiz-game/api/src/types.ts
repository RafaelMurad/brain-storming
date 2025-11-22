// Re-export shared types
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
  correctAnswer: number;
  explanation: string;
  source: string;
  points: number;
  timeLimit: number;
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
  oduserId: string;
  username: string;
  avatar: string;
  level: number;
  totalXp: number;
  streak: number;
  accuracy: number;
}

export interface GameSession {
  id: string;
  oduserId: string;
  category: Category | 'mixed';
  difficulty: Difficulty;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  startedAt: string;
  endedAt?: string;
  isComplete: boolean;
}

export interface Answer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
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

export const XP_PER_LEVEL = 1000;
export const STREAK_BONUS_MULTIPLIER = 0.1;
export const MAX_STREAK_BONUS = 2;

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  beginner: 10,
  intermediate: 20,
  advanced: 35,
  expert: 50,
};
