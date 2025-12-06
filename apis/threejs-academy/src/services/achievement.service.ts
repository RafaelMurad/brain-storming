import { prisma } from '../lib/database';
import { logger } from '../config/logger';

export interface AchievementDef {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: string;
}

export interface UserAchievementData {
  achievement: AchievementDef;
  unlockedAt: Date;
}

// Get all achievements
export const getAllAchievements = async (): Promise<AchievementDef[]> => {
  const achievements = await prisma.achievement.findMany({
    where: { isActive: true },
    orderBy: { points: 'asc' },
  });
  
  return achievements.map(a => ({
    id: a.id,
    code: a.code,
    name: a.name,
    description: a.description,
    icon: a.icon,
    points: a.points,
    rarity: a.rarity,
  }));
};

// Get user's unlocked achievements
export const getUserAchievements = async (userId: string): Promise<UserAchievementData[]> => {
  const unlocks = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: 'desc' },
  });
  
  return unlocks.map(u => ({
    achievement: {
      id: u.achievement.id,
      code: u.achievement.code,
      name: u.achievement.name,
      description: u.achievement.description,
      icon: u.achievement.icon,
      points: u.achievement.points,
      rarity: u.achievement.rarity,
    },
    unlockedAt: u.unlockedAt,
  }));
};

// Check if user has achievement
export const hasAchievement = async (userId: string, achievementCode: string): Promise<boolean> => {
  const achievement = await prisma.achievement.findUnique({
    where: { code: achievementCode },
  });
  
  if (!achievement) return false;
  
  const unlock = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
  });
  
  return !!unlock;
};

// Unlock achievement
export const unlockAchievement = async (userId: string, achievementCode: string): Promise<UserAchievementData | null> => {
  const achievement = await prisma.achievement.findUnique({
    where: { code: achievementCode },
  });
  
  if (!achievement) {
    logger.warn('Achievement not found', { code: achievementCode });
    return null;
  }
  
  // Check if already unlocked
  const existing = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
  });
  
  if (existing) {
    return null; // Already unlocked
  }
  
  const unlock = await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  });
  
  logger.info('Achievement unlocked', { userId, achievement: achievementCode });
  
  return {
    achievement: {
      id: achievement.id,
      code: achievement.code,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.points,
      rarity: achievement.rarity,
    },
    unlockedAt: unlock.unlockedAt,
  };
};

// Check and unlock achievements based on triggers
export const checkAchievements = async (
  userId: string,
  trigger: { type: string; value?: string }
): Promise<UserAchievementData[]> => {
  const unlockedAchievements: UserAchievementData[] = [];
  
  // Get all achievements matching trigger type
  const achievements = await prisma.achievement.findMany({
    where: { triggerType: trigger.type, isActive: true },
  });
  
  for (const achievement of achievements) {
    // Check if already unlocked
    const hasIt = await hasAchievement(userId, achievement.code);
    if (hasIt) continue;
    
    // Parse trigger value conditions
    let shouldUnlock = false;
    
    if (trigger.type === 'lesson-complete') {
      // triggerValue is the lessonId or "any"
      if (achievement.triggerValue === 'any' || achievement.triggerValue === trigger.value) {
        shouldUnlock = true;
      }
    } else if (trigger.type === 'module-complete') {
      // triggerValue is the moduleId
      if (achievement.triggerValue === trigger.value) {
        shouldUnlock = true;
      }
    } else if (trigger.type === 'special') {
      // Special achievements with specific codes
      if (achievement.triggerValue === trigger.value) {
        shouldUnlock = true;
      }
    }
    
    if (shouldUnlock) {
      const unlocked = await unlockAchievement(userId, achievement.code);
      if (unlocked) {
        unlockedAchievements.push(unlocked);
      }
    }
  }
  
  return unlockedAchievements;
};

// Get user's total points
export const getUserPoints = async (userId: string): Promise<number> => {
  const unlocks = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
  
  return unlocks.reduce((sum, u) => sum + u.achievement.points, 0);
};

// Seed default achievements
export const seedAchievements = async (): Promise<void> => {
  const achievements = [
    {
      code: 'hello-threejs',
      name: 'Hello Three.js',
      description: 'Complete your first lesson',
      icon: 'cube',
      points: 10,
      rarity: 'common',
      triggerType: 'lesson-complete',
      triggerValue: 'any',
    },
    {
      code: 'fundamentals-master',
      name: 'Fundamentals Master',
      description: 'Complete the Fundamentals module',
      icon: 'star',
      points: 50,
      rarity: 'rare',
      triggerType: 'module-complete',
      triggerValue: '01-fundamentals',
    },
    {
      code: 'geometry-wizard',
      name: 'Geometry Wizard',
      description: 'Complete the Geometries & Materials module',
      icon: 'shapes',
      points: 50,
      rarity: 'rare',
      triggerType: 'module-complete',
      triggerValue: '02-geometries-materials',
    },
    {
      code: 'light-bringer',
      name: 'Light Bringer',
      description: 'Complete the Textures & Lighting module',
      icon: 'light',
      points: 50,
      rarity: 'rare',
      triggerType: 'module-complete',
      triggerValue: '03-textures-lighting',
    },
    {
      code: 'camera-operator',
      name: 'Camera Operator',
      description: 'Complete the Cameras & Controls module',
      icon: 'camera',
      points: 50,
      rarity: 'rare',
      triggerType: 'module-complete',
      triggerValue: '04-cameras-controls',
    },
    {
      code: 'animator',
      name: 'Animator',
      description: 'Complete the Animation & Physics module',
      icon: 'motion',
      points: 75,
      rarity: 'epic',
      triggerType: 'module-complete',
      triggerValue: '05-animation-physics',
    },
    {
      code: 'shader-sorcerer',
      name: 'Shader Sorcerer',
      description: 'Complete the Shaders & Post-Processing module',
      icon: 'shader',
      points: 100,
      rarity: 'legendary',
      triggerType: 'module-complete',
      triggerValue: '06-shaders-postprocessing',
    },
    {
      code: 'speed-runner',
      name: 'Speed Runner',
      description: 'Complete a lesson in under 5 minutes',
      icon: 'rocket',
      points: 25,
      rarity: 'rare',
      triggerType: 'special',
      triggerValue: 'fast-completion',
    },
    {
      code: 'perfectionist',
      name: 'Perfectionist',
      description: 'Get 100% on an exercise on your first try',
      icon: 'trophy',
      points: 30,
      rarity: 'epic',
      triggerType: 'special',
      triggerValue: 'perfect-first-try',
    },
    {
      code: 'three-master',
      name: 'Three.js Master',
      description: 'Complete all modules',
      icon: 'crown',
      points: 200,
      rarity: 'legendary',
      triggerType: 'special',
      triggerValue: 'all-complete',
    },
  ];
  
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      create: achievement,
      update: achievement,
    });
  }
  
  logger.info('Seeded achievements', { count: achievements.length });
};
