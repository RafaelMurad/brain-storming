import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createCheckin, getMemberCheckins, getWorkspaceCheckinStats, getMissingCheckins } from '../services/checkin.service';
import { logger } from '../config/logger';

const router = Router();

const checkinSchema = z.object({
  mood: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  workload: z.number().min(1).max(5),
  stress: z.number().min(1).max(5),
  note: z.string().max(500).optional(),
  isAnonymous: z.boolean().optional(),
});

// POST /api/v1/checkins - Submit a check-in
router.post('/', async (req: Request, res: Response) => {
  try {
    const { workspaceId, memberId } = req.body;

    if (!workspaceId || !memberId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'workspaceId and memberId required' },
      });
      return;
    }

    const validated = checkinSchema.parse(req.body);
    const result = await createCheckin(workspaceId, memberId, validated);

    res.status(201).json({
      success: true,
      data: {
        checkin: result.checkin,
        wellnessScore: result.wellnessScore,
        alert: result.alert,
        message: getWellnessMessage(result.wellnessScore),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    logger.error('Create checkin error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create check-in' },
    });
  }
});

// GET /api/v1/checkins/member/:memberId - Get member's check-in history
router.get('/member/:memberId', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const limit = parseInt(req.query.limit as string) || 30;
    const days = req.query.days ? parseInt(req.query.days as string) : undefined;

    const checkins = await getMemberCheckins(memberId, { limit, days });

    res.json({
      success: true,
      data: { checkins },
    });
  } catch (error) {
    logger.error('Get checkins error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get check-ins' },
    });
  }
});

// GET /api/v1/checkins/stats/:workspaceId - Get workspace stats
router.get('/stats/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const stats = await getWorkspaceCheckinStats(workspaceId, days);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get stats' },
    });
  }
});

// GET /api/v1/checkins/missing/:workspaceId - Get members who haven't checked in
router.get('/missing/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const hours = parseInt(req.query.hours as string) || 24;

    const members = await getMissingCheckins(workspaceId, hours);

    res.json({
      success: true,
      data: { members, period: `${hours} hours` },
    });
  } catch (error) {
    logger.error('Get missing checkins error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get missing check-ins' },
    });
  }
});

// Helper for wellness messages
const getWellnessMessage = (score: number): string => {
  if (score >= 80) return "You're doing great! Keep up the positive momentum.";
  if (score >= 60) return "You're on track. Remember to take breaks when needed.";
  if (score >= 40) return 'Consider taking some time for self-care today.';
  if (score >= 25) return "It looks like you might be struggling. Don't hesitate to reach out for support.";
  return 'Your wellbeing needs attention. Please consider talking to someone about how you are feeling.';
};

export default router;
