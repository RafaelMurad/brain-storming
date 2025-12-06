import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import {
  saveSubmission,
  getLessonSubmissions,
  getBestSubmission,
} from '../services/submission.service';
import { updateProgress } from '../services/progress.service';
import { checkAchievements } from '../services/achievement.service';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// Submission schema
const submissionSchema = z.object({
  lessonId: z.string().min(1),
  moduleId: z.string().min(1),
  code: z.string().min(1),
  passed: z.boolean(),
  score: z.number().min(0).max(100),
  feedback: z.string().optional(),
  executionTime: z.number().optional(),
});

// POST /api/v1/exercises/submit - Submit exercise code
router.post('/submit', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = submissionSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message },
      });
    }
    
    const { lessonId, moduleId, code, passed, score, feedback, executionTime } = parsed.data;
    
    // Check if this is first attempt for perfectionist achievement
    const existingSubmissions = await getLessonSubmissions(req.userId!, lessonId);
    const isFirstAttempt = existingSubmissions.length === 0;
    
    // Save submission
    const submission = await saveSubmission(req.userId!, {
      lessonId,
      code,
      passed,
      score,
      feedback,
      executionTime,
    });
    
    // Update progress
    const progressUpdate: any = {
      lessonId,
      moduleId,
      attempts: 1,
      bestScore: score,
    };
    
    if (passed) {
      progressUpdate.status = 'completed';
    } else {
      progressUpdate.status = 'in-progress';
    }
    
    const progress = await updateProgress(req.userId!, progressUpdate);
    
    // Check for achievements
    let newAchievements: any[] = [];
    
    if (passed) {
      // Check lesson completion
      newAchievements = await checkAchievements(req.userId!, {
        type: 'lesson-complete',
        value: lessonId,
      });
      
      // Check for perfectionist (100% on first try)
      if (isFirstAttempt && score === 100) {
        const perfectAchievements = await checkAchievements(req.userId!, {
          type: 'special',
          value: 'perfect-first-try',
        });
        newAchievements.push(...perfectAchievements);
      }
    }
    
    res.json({
      success: true,
      data: {
        submission,
        progress,
        newAchievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to submit exercise' },
    });
  }
});

// GET /api/v1/exercises/:lessonId/submissions - Get submissions for a lesson
router.get('/:lessonId/submissions', async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const submissions = await getLessonSubmissions(req.userId!, lessonId);
    const best = await getBestSubmission(req.userId!, lessonId);
    
    res.json({
      success: true,
      data: {
        submissions,
        best,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get submissions' },
    });
  }
});

export default router;
