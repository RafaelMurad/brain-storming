import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  createAchievement,
  getAchievements,
  unlockAchievement,
  getUserAchievements,
  achievementIcons,
} from '../services/achievement.service';
import { logger } from '../config/logger';

const router = Router();

const createSchema = z.object({
  appId: z.string(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon: z.enum(achievementIcons as [string, ...string[]]).optional(),
  points: z.number().min(1).max(1000).optional(),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).optional(),
});

const unlockSchema = z.object({
  appId: z.string(),
  achievementCode: z.string(),
  userId: z.string(),
});

// POST /api/v1/achievements - Create achievement
router.post('/', async (req: Request, res: Response) => {
  try {
    const validated = createSchema.parse(req.body);
    const achievement = await createAchievement(validated.appId, validated);

    res.status(201).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    logger.error('Create achievement error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create achievement' },
    });
  }
});

// GET /api/v1/achievements/:appId - Get all achievements
router.get('/:appId', async (req: Request, res: Response) => {
  try {
    const { appId } = req.params;
    const achievements = await getAchievements(appId);

    res.json({
      success: true,
      data: { achievements },
    });
  } catch (error) {
    logger.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get achievements' },
    });
  }
});

// POST /api/v1/achievements/unlock - Unlock achievement for user
router.post('/unlock', async (req: Request, res: Response) => {
  try {
    const validated = unlockSchema.parse(req.body);
    const result = await unlockAchievement(
      validated.appId,
      validated.achievementCode,
      validated.userId
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: error.message },
      });
      return;
    }
    logger.error('Unlock achievement error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to unlock achievement' },
    });
  }
});

// GET /api/v1/achievements/:appId/user/:userId - Get user's achievements
router.get('/:appId/user/:userId', async (req: Request, res: Response) => {
  try {
    const { appId, userId } = req.params;
    const data = await getUserAchievements(appId, userId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user achievements' },
    });
  }
});

// GET /api/v1/achievements/icons - Get available icons
router.get('/meta/icons', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: { icons: achievementIcons },
  });
});

export default router;
