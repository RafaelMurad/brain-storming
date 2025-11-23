export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Category =
  | 'react'
  | 'vue'
  | 'typescript'
  | 'javascript'
  | 'css'
  | 'nextjs'
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
  stats: UserStats;
  achievements: Achievement[];
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
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

export interface GameSession {
  id: string;
  questions: Question[];
  currentIndex: number;
  score: number;
  isComplete: boolean;
}

export interface GameResult {
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
