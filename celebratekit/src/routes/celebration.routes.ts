import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { triggerCelebration, getCelebrationStats, getPresets } from '../services/celebration.service';
import { logger } from '../config/logger';

const router = Router();

const triggerSchema = z.object({
  appId: z.string(),
  preset: z.string().optional(),
  userId: z.string().optional(),
  trigger: z.string().optional(),
  config: z.object({
    type: z.enum(['confetti', 'fireworks', 'stars', 'hearts', 'coins', 'custom']).optional(),
    duration: z.number().min(500).max(10000).optional(),
    particleCount: z.number().min(10).max(500).optional(),
    colors: z.array(z.string()).max(10).optional(),
    spread: z.number().min(10).max(360).optional(),
    origin: z.object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    }).optional(),
  }).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// POST /api/v1/celebrate - Trigger a celebration
router.post('/', async (req: Request, res: Response) => {
  try {
    const validated = triggerSchema.parse(req.body);

    const result = await triggerCelebration(validated.appId, {
      preset: validated.preset,
      config: validated.config,
      userId: validated.userId,
      trigger: validated.trigger,
      metadata: validated.metadata,
    });

    res.status(201).json({
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
    logger.error('Trigger celebration error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to trigger celebration' },
    });
  }
});

// GET /api/v1/celebrate/presets - Get available presets
router.get('/presets', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: { presets: getPresets() },
  });
});

// GET /api/v1/celebrate/stats/:appId - Get celebration stats
router.get('/stats/:appId', async (req: Request, res: Response) => {
  try {
    const { appId } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const stats = await getCelebrationStats(appId, days);

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

export default router;
