import { v4 as uuidv4 } from 'uuid';
import {
  User,
  GameSession,
  Answer,
  GameResult,
  Achievement,
  Category,
  Difficulty,
  XP_PER_LEVEL,
  STREAK_BONUS_MULTIPLIER,
  MAX_STREAK_BONUS,
} from '../types';
import { getRandomQuestions, questions } from '../data/questions';

// In-memory storage (use a database in production)
const users: Map<string, User> = new Map();
const sessions: Map<string, GameSession> = new Map();

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-quiz', name: 'First Steps', description: 'Complete your first quiz', icon: '🎯', rarity: 'common', unlockedAt: '' },
  { id: 'streak-3', name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', rarity: 'common', unlockedAt: '' },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚔️', rarity: 'rare', unlockedAt: '' },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', rarity: 'epic', unlockedAt: '' },
  { id: 'perfect-quiz', name: 'Perfectionist', description: 'Get 100% on a quiz', icon: '💯', rarity: 'rare', unlockedAt: '' },
  { id: 'level-5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', rarity: 'common', unlockedAt: '' },
  { id: 'level-10', name: 'Expert', description: 'Reach level 10', icon: '🏆', rarity: 'rare', unlockedAt: '' },
  { id: 'level-25', name: 'Legend', description: 'Reach level 25', icon: '🌟', rarity: 'epic', unlockedAt: '' },
  { id: 'level-50', name: 'Mythical', description: 'Reach level 50', icon: '💎', rarity: 'legendary', unlockedAt: '' },
  { id: 'questions-100', name: 'Century', description: 'Answer 100 questions', icon: '📚', rarity: 'rare', unlockedAt: '' },
  { id: 'questions-500', name: 'Scholar', description: 'Answer 500 questions', icon: '🎓', rarity: 'epic', unlockedAt: '' },
  { id: 'accuracy-90', name: 'Sharp Mind', description: 'Maintain 90% accuracy over 50+ questions', icon: '🧠', rarity: 'epic', unlockedAt: '' },
  { id: 'react-master', name: 'React Master', description: 'Answer 50 React questions correctly', icon: '⚛️', rarity: 'rare', unlockedAt: '' },
  { id: 'ts-master', name: 'TypeScript Guru', description: 'Answer 50 TypeScript questions correctly', icon: '🔷', rarity: 'rare', unlockedAt: '' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Answer 10 questions correctly under 10 seconds each', icon: '⚡', rarity: 'epic', unlockedAt: '' },
];

function createDefaultUser(username: string, email: string): User {
  const categories: Category[] = ['react', 'vue', 'angular', 'typescript', 'javascript', 'css', 'html', 'nextjs', 'svelte', 'testing', 'performance', 'accessibility'];
  const categoryStats: Record<Category, { total: number; correct: number; accuracy: number }> = {} as any;

  categories.forEach(cat => {
    categoryStats[cat] = { total: 0, correct: 0, accuracy: 0 };
  });

  return {
    id: uuidv4(),
    username,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    lastPlayedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    stats: {
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      totalTime: 0,
      averageTime: 0,
      categoryStats,
    },
    achievements: [],
    rank: 0,
  };
}

export function getOrCreateUser(username: string, email: string): User {
  // Find existing user by email
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }

  // Create new user
  const newUser = createDefaultUser(username, email);
  users.set(newUser.id, newUser);
  return newUser;
}

export function getUserById(userId: string): User | undefined {
  return users.get(userId);
}

export function startGameSession(
  userId: string,
  category: Category | 'mixed',
  difficulty: Difficulty,
  questionCount: number = 10
): GameSession {
  const categoryFilter = category === 'mixed' ? undefined : category;
  const sessionQuestions = getRandomQuestions(questionCount, categoryFilter, difficulty);

  const session: GameSession = {
    id: uuidv4(),
    oduserId: userId,
    category,
    difficulty,
    questions: sessionQuestions,
    currentIndex: 0,
    answers: [],
    score: 0,
    startedAt: new Date().toISOString(),
    isComplete: false,
  };

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string): GameSession | undefined {
  return sessions.get(sessionId);
}

export function submitAnswer(
  sessionId: string,
  questionId: string,
  selectedAnswer: number,
  timeSpent: number
): { answer: Answer; session: GameSession } | null {
  const session = sessions.get(sessionId);
  if (!session || session.isComplete) return null;

  const question = session.questions.find(q => q.id === questionId);
  if (!question) return null;

  const isCorrect = selectedAnswer === question.correctAnswer;

  // Calculate points with time bonus
  let pointsEarned = 0;
  if (isCorrect) {
    const timeBonus = Math.max(0, 1 - (timeSpent / question.timeLimit));
    pointsEarned = Math.round(question.points * (1 + timeBonus * 0.5));
  }

  const answer: Answer = {
    questionId,
    selectedAnswer,
    isCorrect,
    timeSpent,
    pointsEarned,
  };

  session.answers.push(answer);
  session.score += pointsEarned;
  session.currentIndex++;

  if (session.currentIndex >= session.questions.length) {
    session.isComplete = true;
    session.endedAt = new Date().toISOString();
  }

  sessions.set(sessionId, session);
  return { answer, session };
}

export function completeGame(sessionId: string, userId: string): GameResult | null {
  const session = sessions.get(sessionId);
  const user = users.get(userId);

  if (!session || !user) return null;

  const correctAnswers = session.answers.filter(a => a.isCorrect).length;
  const accuracy = (correctAnswers / session.questions.length) * 100;
  const totalTime = session.answers.reduce((sum, a) => sum + a.timeSpent, 0);

  // Calculate streak
  const now = new Date();
  const lastPlayed = new Date(user.lastPlayedAt);
  const daysSinceLastPlay = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = user.streak;
  if (daysSinceLastPlay === 0) {
    // Same day, keep streak
  } else if (daysSinceLastPlay === 1) {
    // Next day, increment streak
    newStreak++;
  } else {
    // Streak broken
    newStreak = 1;
  }

  // Calculate XP with streak bonus
  const streakMultiplier = Math.min(1 + (newStreak * STREAK_BONUS_MULTIPLIER), MAX_STREAK_BONUS);
  const baseXp = session.score;
  const xpEarned = Math.round(baseXp * streakMultiplier);
  const streakBonus = xpEarned - baseXp;

  // Update user stats
  user.totalXp += xpEarned;
  user.xp = user.totalXp % XP_PER_LEVEL;
  const newLevel = Math.floor(user.totalXp / XP_PER_LEVEL) + 1;
  const levelUp = newLevel > user.level;
  user.level = newLevel;
  user.streak = newStreak;
  user.longestStreak = Math.max(user.longestStreak, newStreak);
  user.lastPlayedAt = now.toISOString();

  // Update stats
  user.stats.totalQuestions += session.questions.length;
  user.stats.correctAnswers += correctAnswers;
  user.stats.accuracy = (user.stats.correctAnswers / user.stats.totalQuestions) * 100;
  user.stats.totalTime += totalTime;
  user.stats.averageTime = user.stats.totalTime / user.stats.totalQuestions;

  // Update category stats
  session.questions.forEach((q, i) => {
    const cat = user.stats.categoryStats[q.category];
    cat.total++;
    if (session.answers[i]?.isCorrect) {
      cat.correct++;
    }
    cat.accuracy = (cat.correct / cat.total) * 100;
  });

  // Check for new achievements
  const newAchievements = checkAchievements(user, session);
  user.achievements.push(...newAchievements);

  users.set(userId, user);

  return {
    sessionId,
    totalQuestions: session.questions.length,
    correctAnswers,
    accuracy,
    totalScore: session.score,
    xpEarned,
    streakBonus,
    newStreak,
    levelUp,
    newLevel: levelUp ? newLevel : undefined,
    newAchievements,
    timeSpent: totalTime,
  };
}

function checkAchievements(user: User, session: GameSession): Achievement[] {
  const newAchievements: Achievement[] = [];
  const now = new Date().toISOString();
  const hasAchievement = (id: string) => user.achievements.some(a => a.id === id);
  const correctInSession = session.answers.filter(a => a.isCorrect).length;

  // First quiz
  if (user.stats.totalQuestions === session.questions.length && !hasAchievement('first-quiz')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'first-quiz')!, unlockedAt: now });
  }

  // Streak achievements
  if (user.streak >= 3 && !hasAchievement('streak-3')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'streak-3')!, unlockedAt: now });
  }
  if (user.streak >= 7 && !hasAchievement('streak-7')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'streak-7')!, unlockedAt: now });
  }
  if (user.streak >= 30 && !hasAchievement('streak-30')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'streak-30')!, unlockedAt: now });
  }

  // Perfect quiz
  if (correctInSession === session.questions.length && !hasAchievement('perfect-quiz')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'perfect-quiz')!, unlockedAt: now });
  }

  // Level achievements
  if (user.level >= 5 && !hasAchievement('level-5')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'level-5')!, unlockedAt: now });
  }
  if (user.level >= 10 && !hasAchievement('level-10')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'level-10')!, unlockedAt: now });
  }
  if (user.level >= 25 && !hasAchievement('level-25')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'level-25')!, unlockedAt: now });
  }
  if (user.level >= 50 && !hasAchievement('level-50')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'level-50')!, unlockedAt: now });
  }

  // Question count achievements
  if (user.stats.totalQuestions >= 100 && !hasAchievement('questions-100')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'questions-100')!, unlockedAt: now });
  }
  if (user.stats.totalQuestions >= 500 && !hasAchievement('questions-500')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'questions-500')!, unlockedAt: now });
  }

  // Accuracy achievement
  if (user.stats.totalQuestions >= 50 && user.stats.accuracy >= 90 && !hasAchievement('accuracy-90')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'accuracy-90')!, unlockedAt: now });
  }

  // Category mastery
  if (user.stats.categoryStats.react?.correct >= 50 && !hasAchievement('react-master')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'react-master')!, unlockedAt: now });
  }
  if (user.stats.categoryStats.typescript?.correct >= 50 && !hasAchievement('ts-master')) {
    newAchievements.push({ ...ACHIEVEMENTS.find(a => a.id === 'ts-master')!, unlockedAt: now });
  }

  return newAchievements;
}

export function getLeaderboard(limit: number = 10) {
  const allUsers = Array.from(users.values());

  return allUsers
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      totalXp: user.totalXp,
      streak: user.streak,
      accuracy: user.stats.accuracy,
    }));
}

export function getCategories() {
  const categories: Category[] = ['react', 'vue', 'angular', 'typescript', 'javascript', 'css', 'html', 'nextjs', 'svelte', 'testing', 'performance', 'accessibility'];

  return categories.map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    questionCount: questions.filter(q => q.category === cat).length,
  }));
}

// Initialize some demo users for leaderboard
function initializeDemoData() {
  const demoUsers = [
    { username: 'ReactNinja', email: 'ninja@demo.com' },
    { username: 'TypeScriptPro', email: 'tspro@demo.com' },
    { username: 'CSSWizard', email: 'csswiz@demo.com' },
    { username: 'VueEnthusiast', email: 'vue@demo.com' },
    { username: 'FullStackDev', email: 'fullstack@demo.com' },
  ];

  demoUsers.forEach((demo, i) => {
    const user = createDefaultUser(demo.username, demo.email);
    user.totalXp = Math.floor(Math.random() * 5000) + 1000;
    user.level = Math.floor(user.totalXp / XP_PER_LEVEL) + 1;
    user.xp = user.totalXp % XP_PER_LEVEL;
    user.streak = Math.floor(Math.random() * 14) + 1;
    user.stats.totalQuestions = Math.floor(Math.random() * 200) + 50;
    user.stats.correctAnswers = Math.floor(user.stats.totalQuestions * (0.6 + Math.random() * 0.35));
    user.stats.accuracy = (user.stats.correctAnswers / user.stats.totalQuestions) * 100;
    users.set(user.id, user);
  });
}

initializeDemoData();
