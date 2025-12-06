import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import {
  getUserProgress,
  getLessonProgress,
  updateProgress,
  getModuleStats,
  getOverallStats,
} from '../services/progress.service';
import { checkAchievements } from '../services/achievement.service';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Progress update schema
const progressUpdateSchema = z.object({
  lessonId: z.string().min(1),
  moduleId: z.string().min(1),
  status: z.enum(['not-started', 'in-progress', 'completed']).optional(),
  timeSpentSecs: z.number().min(0).optional(),
  attempts: z.number().min(0).optional(),
  bestScore: z.number().min(0).max(100).optional(),
});

// GET /api/v1/progress - Get all progress
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const progress = await getUserProgress(req.userId!);
    const moduleStats = await getModuleStats(req.userId!);
    const overallStats = await getOverallStats(req.userId!);
    
    res.json({
      success: true,
      data: {
        lessons: progress,
        modules: moduleStats,
        overall: overallStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get progress' },
    });
  }
});

// GET /api/v1/progress/:lessonId - Get progress for a specific lesson
router.get('/:lessonId', async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const progress = await getLessonProgress(req.userId!, lessonId);
    
    res.json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get lesson progress' },
    });
  }
});

// PUT /api/v1/progress - Update progress
router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = progressUpdateSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message },
      });
    }
    
    const progress = await updateProgress(req.userId!, parsed.data);
    
    // Check for achievements if lesson completed
    let newAchievements: any[] = [];
    if (parsed.data.status === 'completed') {
      // Check lesson completion achievement
      newAchievements = await checkAchievements(req.userId!, {
        type: 'lesson-complete',
        value: parsed.data.lessonId,
      });
      
      // Check for speed runner (if completed in under 5 minutes)
      if (progress.timeSpentSecs < 300) {
        const speedAchievements = await checkAchievements(req.userId!, {
          type: 'special',
          value: 'fast-completion',
        });
        newAchievements.push(...speedAchievements);
      }
      
      // Check for module completion
      const moduleStats = await getModuleStats(req.userId!);
      const moduleProgress = moduleStats[parsed.data.moduleId];
      if (moduleProgress && moduleProgress.percentage === 100) {
        const moduleAchievements = await checkAchievements(req.userId!, {
          type: 'module-complete',
          value: parsed.data.moduleId,
        });
        newAchievements.push(...moduleAchievements);
      }
    }
    
    res.json({
      success: true,
      data: {
        progress,
        newAchievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update progress' },
    });
  }
});

// POST /api/v1/progress/sync - Batch sync progress (for offline mode)
router.post('/sync', async (req: AuthRequest, res: Response) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Updates must be an array' },
      });
    }
    
    const results = [];
    const allNewAchievements: any[] = [];
    
    for (const update of updates) {
      const parsed = progressUpdateSchema.safeParse(update);
      if (parsed.success) {
        const progress = await updateProgress(req.userId!, parsed.data);
        results.push(progress);
        
        if (parsed.data.status === 'completed') {
          const achievements = await checkAchievements(req.userId!, {
            type: 'lesson-complete',
            value: parsed.data.lessonId,
          });
          allNewAchievements.push(...achievements);
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        synced: results.length,
        progress: results,
        newAchievements: allNewAchievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to sync progress' },
    });
  }
});

export default router;
