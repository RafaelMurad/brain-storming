import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import {
  getAllAchievements,
  getUserAchievements,
  getUserPoints,
  checkAchievements,
} from '../services/achievement.service';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/v1/achievements - Get all achievements with user's unlock status
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const allAchievements = await getAllAchievements();
    const userAchievements = await getUserAchievements(req.userId!);
    const totalPoints = await getUserPoints(req.userId!);
    
    const unlockedCodes = new Set(userAchievements.map(a => a.achievement.code));
    
    const achievements = allAchievements.map(a => ({
      ...a,
      unlocked: unlockedCodes.has(a.code),
      unlockedAt: userAchievements.find(ua => ua.achievement.code === a.code)?.unlockedAt,
    }));
    
    res.json({
      success: true,
      data: {
        achievements,
        totalPoints,
        unlockedCount: userAchievements.length,
        totalCount: allAchievements.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get achievements' },
    });
  }
});

// GET /api/v1/achievements/unlocked - Get only user's unlocked achievements
router.get('/unlocked', async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await getUserAchievements(req.userId!);
    const totalPoints = await getUserPoints(req.userId!);
    
    res.json({
      success: true,
      data: {
        achievements,
        totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get achievements' },
    });
  }
});

// POST /api/v1/achievements/check - Manually check for achievement triggers
router.post('/check', async (req: AuthRequest, res: Response) => {
  try {
    const { triggerType, triggerValue } = req.body;
    
    if (!triggerType) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'triggerType is required' },
      });
    }
    
    const newAchievements = await checkAchievements(req.userId!, {
      type: triggerType,
      value: triggerValue,
    });
    
    res.json({
      success: true,
      data: {
        newAchievements,
        count: newAchievements.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to check achievements' },
    });
  }
});

export default router;
