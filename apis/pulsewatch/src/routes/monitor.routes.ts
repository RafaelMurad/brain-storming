import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import {
  createMonitor,
  getMonitors,
  getMonitor,
  updateMonitor,
  deleteMonitor,
  runMonitorScan,
} from '../services/monitor.service';
import { logger } from '../config/logger';

const router = Router();

// Validation schemas
const createMonitorSchema = z.object({
  name: z.string().min(1).max(100),
  keywords: z.array(z.string()).min(1).max(20),
  subreddits: z.array(z.string()).max(10).optional(),
  platforms: z.array(z.enum(['reddit', 'twitter', 'hackernews'])).optional(),
  minScore: z.number().min(0).max(100).optional(),
});

const updateMonitorSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  keywords: z.array(z.string()).min(1).max(20).optional(),
  subreddits: z.array(z.string()).max(10).optional(),
  platforms: z.array(z.enum(['reddit', 'twitter', 'hackernews'])).optional(),
  minScore: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

// POST /api/v1/monitors - Create a new monitor
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const validated = createMonitorSchema.parse(req.body);
    const monitor = await createMonitor(req.user!.id, validated);

    res.status(201).json({
      success: true,
      data: monitor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    logger.error('Create monitor error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create monitor' },
    });
  }
});

// GET /api/v1/monitors - List monitors
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const monitors = await getMonitors(req.user!.id);

    res.json({
      success: true,
      data: { monitors },
    });
  } catch (error) {
    logger.error('List monitors error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to list monitors' },
    });
  }
});

// GET /api/v1/monitors/:id - Get a monitor
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const monitor = await getMonitor(req.params.id, req.user!.id);

    res.json({
      success: true,
      data: monitor,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Monitor not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Monitor not found' },
      });
      return;
    }
    logger.error('Get monitor error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get monitor' },
    });
  }
});

// PATCH /api/v1/monitors/:id - Update a monitor
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const validated = updateMonitorSchema.parse(req.body);
    const monitor = await updateMonitor(req.params.id, req.user!.id, validated);

    res.json({
      success: true,
      data: monitor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    if (error instanceof Error && error.message === 'Monitor not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Monitor not found' },
      });
      return;
    }
    logger.error('Update monitor error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update monitor' },
    });
  }
});

// DELETE /api/v1/monitors/:id - Delete a monitor
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    await deleteMonitor(req.params.id, req.user!.id);

    res.json({
      success: true,
      message: 'Monitor deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Monitor not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Monitor not found' },
      });
      return;
    }
    logger.error('Delete monitor error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete monitor' },
    });
  }
});

// POST /api/v1/monitors/:id/scan - Manually trigger a scan
router.post('/:id/scan', authenticate, async (req: Request, res: Response) => {
  try {
    // Verify ownership first
    await getMonitor(req.params.id, req.user!.id);

    const result = await runMonitorScan(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Monitor not found' },
      });
      return;
    }
    logger.error('Manual scan error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SCAN_FAILED', message: 'Scan failed' },
    });
  }
});

export default router;
