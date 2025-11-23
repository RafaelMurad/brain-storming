import { prisma } from '../lib/database';
import { logger } from '../config/logger';
import { config } from '../config';

// Celebration types
export type CelebrationType = 'confetti' | 'fireworks' | 'stars' | 'hearts' | 'coins' | 'custom';

// Celebration configuration
export interface CelebrationConfig {
  type: CelebrationType;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  spread?: number;
  origin?: { x: number; y: number };
  sound?: boolean;
}

// Default celebration presets
export const celebrationPresets: Record<string, CelebrationConfig> = {
  default: {
    type: 'confetti',
    duration: config.defaultConfettiDuration,
    particleCount: config.defaultConfettiParticles,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
  },
  success: {
    type: 'confetti',
    duration: 2500,
    particleCount: 100,
    colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
    spread: 60,
    origin: { x: 0.5, y: 0.6 },
  },
  achievement: {
    type: 'stars',
    duration: 3000,
    particleCount: 50,
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFEE58'],
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
  },
  love: {
    type: 'hearts',
    duration: 3000,
    particleCount: 30,
    colors: ['#FF6B6B', '#FF8E8E', '#FFB4B4', '#E91E63'],
    spread: 80,
    origin: { x: 0.5, y: 0.7 },
  },
  fireworks: {
    type: 'fireworks',
    duration: 4000,
    particleCount: 200,
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    spread: 360,
    origin: { x: 0.5, y: 0.9 },
  },
  coins: {
    type: 'coins',
    duration: 2500,
    particleCount: 50,
    colors: ['#FFD700', '#FFC107', '#FF9800'],
    spread: 45,
    origin: { x: 0.5, y: 0.3 },
  },
  epic: {
    type: 'confetti',
    duration: 5000,
    particleCount: 300,
    colors: ['#9B59B6', '#8E44AD', '#6C3483', '#5B2C6F', '#FFD700', '#FF6B6B'],
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
  },
};

// Trigger a celebration
export const triggerCelebration = async (
  appId: string,
  options: {
    preset?: string;
    config?: Partial<CelebrationConfig>;
    userId?: string;
    trigger?: string;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<{ id: string; config: CelebrationConfig }> => {
  // Get base config from preset or default
  const baseConfig = options.preset
    ? celebrationPresets[options.preset] || celebrationPresets.default
    : celebrationPresets.default;

  // Merge with custom config
  const finalConfig: CelebrationConfig = {
    ...baseConfig,
    ...options.config,
  };

  // Log celebration
  const celebration = await prisma.celebration.create({
    data: {
      appId,
      userId: options.userId,
      type: finalConfig.type,
      trigger: options.trigger,
      metadata: options.metadata ? JSON.stringify(options.metadata) : null,
    },
  });

  logger.debug(`Celebration triggered: ${celebration.id}, type: ${finalConfig.type}`);

  return {
    id: celebration.id,
    config: finalConfig,
  };
};

// Get celebration stats for an app
export const getCelebrationStats = async (appId: string, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [total, byType, byDay] = await Promise.all([
    prisma.celebration.count({
      where: { appId, createdAt: { gte: since } },
    }),
    prisma.celebration.groupBy({
      by: ['type'],
      where: { appId, createdAt: { gte: since } },
      _count: true,
    }),
    prisma.$queryRaw`
      SELECT date(createdAt) as date, count(*) as count
      FROM Celebration
      WHERE appId = ${appId} AND createdAt >= ${since.toISOString()}
      GROUP BY date(createdAt)
      ORDER BY date DESC
      LIMIT 30
    ` as Promise<Array<{ date: string; count: number }>>,
  ]);

  return {
    total,
    byType: byType.reduce(
      (acc, item) => {
        acc[item.type] = item._count;
        return acc;
      },
      {} as Record<string, number>
    ),
    byDay,
    period: `${days} days`,
  };
};

// Get available presets
export const getPresets = (): Record<string, CelebrationConfig> => {
  return celebrationPresets;
};
