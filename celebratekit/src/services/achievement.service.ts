import { prisma } from '../lib/database';
import { logger } from '../config/logger';
import { triggerCelebration } from './celebration.service';

// Achievement icons
export const achievementIcons = ['trophy', 'star', 'medal', 'badge', 'crown', 'gem', 'rocket', 'fire'];

// Rarity levels and their celebration configs
export const rarityConfig = {
  common: { points: 10, preset: 'success' },
  rare: { points: 25, preset: 'achievement' },
  epic: { points: 50, preset: 'epic' },
  legendary: { points: 100, preset: 'fireworks' },
};

// Create an achievement definition
export const createAchievement = async (
  appId: string,
  data: {
    code: string;
    name: string;
    description: string;
    icon?: string;
    points?: number;
    rarity?: keyof typeof rarityConfig;
  }
) => {
  const rarity = data.rarity || 'common';
  const points = data.points || rarityConfig[rarity].points;

  const achievement = await prisma.achievement.create({
    data: {
      appId,
      code: data.code,
      name: data.name,
      description: data.description,
      icon: data.icon || 'trophy',
      points,
      rarity,
    },
  });

  logger.info(`Achievement created: ${achievement.code}`);
  return achievement;
};

// Get all achievements for an app
export const getAchievements = async (appId: string) => {
  return prisma.achievement.findMany({
    where: { appId, isActive: true },
    orderBy: { points: 'desc' },
  });
};

// Unlock an achievement for a user
export const unlockAchievement = async (
  appId: string,
  achievementCode: string,
  userId: string
): Promise<{
  success: boolean;
  achievement?: any;
  alreadyUnlocked?: boolean;
  celebration?: any;
  pointsAwarded?: number;
}> => {
  // Find the achievement
  const achievement = await prisma.achievement.findUnique({
    where: {
      appId_code: { appId, code: achievementCode },
    },
  });

  if (!achievement) {
    throw new Error(`Achievement not found: ${achievementCode}`);
  }

  // Check if already unlocked
  const existing = await prisma.achievementUnlock.findUnique({
    where: {
      achievementId_userId: {
        achievementId: achievement.id,
        userId,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      achievement,
      alreadyUnlocked: true,
    };
  }

  // Unlock the achievement
  await prisma.achievementUnlock.create({
    data: {
      achievementId: achievement.id,
      userId,
    },
  });

  // Update user points
  await prisma.userProgress.upsert({
    where: {
      appId_userId: { appId, userId },
    },
    update: {
      points: { increment: achievement.points },
      lastActiveAt: new Date(),
    },
    create: {
      appId,
      userId,
      points: achievement.points,
    },
  });

  // Trigger celebration based on rarity
  const rarity = achievement.rarity as keyof typeof rarityConfig;
  const celebration = await triggerCelebration(appId, {
    preset: rarityConfig[rarity]?.preset || 'achievement',
    userId,
    trigger: `achievement:${achievementCode}`,
    metadata: {
      achievementName: achievement.name,
      achievementRarity: achievement.rarity,
      pointsAwarded: achievement.points,
    },
  });

  logger.info(`Achievement unlocked: ${achievementCode} for user ${userId}`);

  return {
    success: true,
    achievement,
    celebration,
    pointsAwarded: achievement.points,
  };
};

// Get user's unlocked achievements
export const getUserAchievements = async (appId: string, userId: string) => {
  const unlocks = await prisma.achievementUnlock.findMany({
    where: {
      userId,
      achievement: { appId },
    },
    include: {
      achievement: true,
    },
    orderBy: { unlockedAt: 'desc' },
  });

  const allAchievements = await prisma.achievement.findMany({
    where: { appId, isActive: true },
  });

  const unlockedIds = new Set(unlocks.map(u => u.achievementId));

  return {
    unlocked: unlocks.map(u => ({
      ...u.achievement,
      unlockedAt: u.unlockedAt,
    })),
    locked: allAchievements.filter(a => !unlockedIds.has(a.id)),
    progress: {
      total: allAchievements.length,
      unlocked: unlocks.length,
      percentage: allAchievements.length > 0
        ? Math.round((unlocks.length / allAchievements.length) * 100)
        : 0,
    },
  };
};

// Check achievement progress (for conditional unlocking)
export const checkAchievementProgress = async (
  appId: string,
  userId: string,
  conditions: Record<string, number>
): Promise<string[]> => {
  // This would check conditions and return codes of achievements to unlock
  // For now, returns empty - implement based on your specific conditions
  return [];
};
