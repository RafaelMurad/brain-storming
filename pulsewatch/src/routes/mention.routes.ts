import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import {
  getMentions,
  getMention,
  markAsRead,
  markMultipleAsRead,
  toggleFlag,
  archiveMention,
  getMentionStats,
  getTopLeads,
} from '../services/mention.service';
import { logger } from '../config/logger';

const router = Router();

// GET /api/v1/mentions - List mentions
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const options = {
      monitorId: req.query.monitorId as string | undefined,
      platform: req.query.platform as string | undefined,
      minScore: req.query.minScore ? parseInt(req.query.minScore as string) : undefined,
      isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined,
      isFlagged:
        req.query.isFlagged === 'true'
          ? true
          : req.query.isFlagged === 'false'
            ? false
            : undefined,
      limit: Math.min(parseInt(req.query.limit as string) || 50, 100),
      offset: parseInt(req.query.offset as string) || 0,
      sortBy: (req.query.sortBy as 'leadScore' | 'createdAt' | 'postedAt') || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await getMentions(req.user!.id, options);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('List mentions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to list mentions' },
    });
  }
});

// GET /api/v1/mentions/stats - Get mention statistics
router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const monitorId = req.query.monitorId as string | undefined;

    const stats = await getMentionStats(req.user!.id, { days, monitorId });

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

// GET /api/v1/mentions/leads - Get top leads
router.get('/leads', authenticate, async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const leads = await getTopLeads(req.user!.id, limit);

    res.json({
      success: true,
      data: { leads },
    });
  } catch (error) {
    logger.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get leads' },
    });
  }
});

// GET /api/v1/mentions/:id - Get a single mention
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const mention = await getMention(req.params.id, req.user!.id);

    res.json({
      success: true,
      data: mention,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Mention not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Mention not found' },
      });
      return;
    }
    logger.error('Get mention error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get mention' },
    });
  }
});

// POST /api/v1/mentions/:id/read - Mark as read
router.post('/:id/read', authenticate, async (req: Request, res: Response) => {
  try {
    const mention = await markAsRead(req.params.id, req.user!.id);

    res.json({
      success: true,
      data: mention,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Mention not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Mention not found' },
      });
      return;
    }
    logger.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to mark as read' },
    });
  }
});

// POST /api/v1/mentions/read - Mark multiple as read
router.post('/read', authenticate, async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      ids: z.array(z.string()).min(1).max(100),
    });

    const { ids } = schema.parse(req.body);
    const result = await markMultipleAsRead(ids, req.user!.id);

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
    logger.error('Mark multiple as read error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to mark as read' },
    });
  }
});

// POST /api/v1/mentions/:id/flag - Toggle flag
router.post('/:id/flag', authenticate, async (req: Request, res: Response) => {
  try {
    const flagged = req.body.flagged !== false;
    const mention = await toggleFlag(req.params.id, req.user!.id, flagged);

    res.json({
      success: true,
      data: mention,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Mention not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Mention not found' },
      });
      return;
    }
    logger.error('Toggle flag error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to toggle flag' },
    });
  }
});

// DELETE /api/v1/mentions/:id - Archive mention
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    await archiveMention(req.params.id, req.user!.id);

    res.json({
      success: true,
      message: 'Mention archived successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Mention not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Mention not found' },
      });
      return;
    }
    logger.error('Archive mention error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to archive mention' },
    });
  }
});

export default router;
