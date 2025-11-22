import { prisma } from '../lib/database';
import { logger } from '../config/logger';

// Get leaderboard for an app
export const getLeaderboard = async (
  appId: string,
  options: {
    limit?: number;
    offset?: number;
    period?: 'all' | 'month' | 'week' | 'day';
  } = {}
) => {
  const { limit = 10, offset = 0 } = options;

  const users = await prisma.userProgress.findMany({
    where: { appId },
    orderBy: { points: 'desc' },
    take: limit,
    skip: offset,
    select: {
      userId: true,
      points: true,
      level: true,
      streak: true,
      lastActiveAt: true,
    },
  });

  // Add rank
  const leaderboard = users.map((user, index) => ({
    rank: offset + index + 1,
    ...user,
  }));

  const totalUsers = await prisma.userProgress.count({ where: { appId } });

  return {
    leaderboard,
    pagination: {
      total: totalUsers,
      limit,
      offset,
      hasMore: offset + users.length < totalUsers,
    },
  };
};

// Get user's rank and surrounding players
export const getUserRank = async (appId: string, userId: string) => {
  const user = await prisma.userProgress.findUnique({
    where: { appId_userId: { appId, userId } },
  });

  if (!user) {
    return null;
  }

  // Count users with more points
  const higherRanked = await prisma.userProgress.count({
    where: {
      appId,
      points: { gt: user.points },
    },
  });

  const rank = higherRanked + 1;

  // Get surrounding players
  const [above, below] = await Promise.all([
    prisma.userProgress.findMany({
      where: { appId, points: { gt: user.points } },
      orderBy: { points: 'asc' },
      take: 2,
      select: { userId: true, points: true, level: true },
    }),
    prisma.userProgress.findMany({
      where: { appId, points: { lt: user.points } },
      orderBy: { points: 'desc' },
      take: 2,
      select: { userId: true, points: true, level: true },
    }),
  ]);

  return {
    rank,
    user: {
      userId: user.userId,
      points: user.points,
      level: user.level,
      streak: user.streak,
    },
    surrounding: {
      above: above.reverse(),
      below,
    },
  };
};

// Update user progress
export const updateUserProgress = async (
  appId: string,
  userId: string,
  data: {
    addPoints?: number;
    setLevel?: number;
    incrementStreak?: boolean;
    resetStreak?: boolean;
    metadata?: Record<string, unknown>;
  }
) => {
  const update: any = {
    lastActiveAt: new Date(),
  };

  if (data.addPoints) {
    update.points = { increment: data.addPoints };
  }

  if (data.setLevel !== undefined) {
    update.level = data.setLevel;
  }

  if (data.incrementStreak) {
    update.streak = { increment: 1 };
  }

  if (data.resetStreak) {
    update.streak = 0;
  }

  if (data.metadata) {
    update.metadata = JSON.stringify(data.metadata);
  }

  const progress = await prisma.userProgress.upsert({
    where: { appId_userId: { appId, userId } },
    update,
    create: {
      appId,
      userId,
      points: data.addPoints || 0,
      level: data.setLevel || 1,
      streak: data.incrementStreak ? 1 : 0,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });

  logger.debug(`User progress updated: ${userId}`);

  return progress;
};

// Calculate level from points
export const calculateLevel = (points: number): number => {
  // Simple level calculation: each level requires more points
  // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 450, etc.
  let level = 1;
  let threshold = 0;
  const increment = 100;

  while (points >= threshold) {
    level++;
    threshold += increment * level;
  }

  return level - 1;
};

// Get user stats
export const getUserStats = async (appId: string, userId: string) => {
  const [progress, achievements, celebrations] = await Promise.all([
    prisma.userProgress.findUnique({
      where: { appId_userId: { appId, userId } },
    }),
    prisma.achievementUnlock.count({
      where: { userId, achievement: { appId } },
    }),
    prisma.celebration.count({
      where: { appId, userId },
    }),
  ]);

  if (!progress) {
    return {
      points: 0,
      level: 1,
      streak: 0,
      achievements: 0,
      celebrations: 0,
    };
  }

  return {
    points: progress.points,
    level: progress.level,
    streak: progress.streak,
    achievements,
    celebrations,
    lastActiveAt: progress.lastActiveAt,
  };
};
