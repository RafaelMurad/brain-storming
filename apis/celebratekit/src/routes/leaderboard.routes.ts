import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  getLeaderboard,
  getUserRank,
  updateUserProgress,
  getUserStats,
} from '../services/leaderboard.service';
import { logger } from '../config/logger';

const router = Router();

// GET /api/v1/leaderboard/:appId - Get leaderboard
router.get('/:appId', async (req: Request, res: Response) => {
  try {
    const { appId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const data = await getLeaderboard(appId, { limit, offset });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get leaderboard' },
    });
  }
});

// GET /api/v1/leaderboard/:appId/user/:userId - Get user rank
router.get('/:appId/user/:userId', async (req: Request, res: Response) => {
  try {
    const { appId, userId } = req.params;
    const data = await getUserRank(appId, userId);

    if (!data) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
      return;
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user rank' },
    });
  }
});

// GET /api/v1/leaderboard/:appId/user/:userId/stats - Get user stats
router.get('/:appId/user/:userId/stats', async (req: Request, res: Response) => {
  try {
    const { appId, userId } = req.params;
    const stats = await getUserStats(appId, userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user stats' },
    });
  }
});

// POST /api/v1/leaderboard/progress - Update user progress
router.post('/progress', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      appId: z.string(),
      userId: z.string(),
      addPoints: z.number().min(0).max(10000).optional(),
      setLevel: z.number().min(1).max(100).optional(),
      incrementStreak: z.boolean().optional(),
      resetStreak: z.boolean().optional(),
      metadata: z.record(z.unknown()).optional(),
    });

    const validated = schema.parse(req.body);
    const progress = await updateUserProgress(validated.appId, validated.userId, validated);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    logger.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update progress' },
    });
  }
});

export default router;
