import { Router, Request, Response } from 'express';
import { getSuggestedActivities, createActivity, getActivities, updateActivityStatus } from '../services/activity.service';
import { getWorkspaceCheckinStats } from '../services/checkin.service';
import { generateInsights } from '../services/sentiment.service';
import { logger } from '../config/logger';

const router = Router();

// GET /api/v1/activities/suggestions/:workspaceId - Get activity suggestions
router.get('/suggestions/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const count = parseInt(req.query.count as string) || 3;

    // Get wellness data to inform suggestions
    const stats = await getWorkspaceCheckinStats(workspaceId, 7);

    const suggestions = await getSuggestedActivities(workspaceId, {
      count,
      wellness: {
        avgMood: stats.averages.mood,
        avgEnergy: stats.averages.energy,
        avgStress: stats.averages.stress,
      },
    });

    res.json({
      success: true,
      data: {
        suggestions,
        basedOn: {
          teamMood: stats.averages.mood,
          teamEnergy: stats.averages.energy,
          teamStress: stats.averages.stress,
        },
      },
    });
  } catch (error) {
    logger.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get suggestions' },
    });
  }
});

// GET /api/v1/activities/insights/:workspaceId - Get team insights
router.get('/insights/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const days = parseInt(req.query.days as string) || 7;

    const stats = await getWorkspaceCheckinStats(workspaceId, days);

    const insights = await generateInsights(
      {
        avgMood: stats.averages.mood,
        avgEnergy: stats.averages.energy,
        avgWorkload: stats.averages.workload,
        avgStress: stats.averages.stress,
        trend: stats.trend,
      },
      stats.totalCheckins
    );

    res.json({
      success: true,
      data: {
        insights,
        stats,
      },
    });
  } catch (error) {
    logger.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get insights' },
    });
  }
});

// POST /api/v1/activities - Create activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const { workspaceId, type, title, description, suggestedDate } = req.body;

    if (!workspaceId || !type || !title || !description) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'Missing required fields' },
      });
      return;
    }

    const activity = await createActivity(workspaceId, {
      type,
      title,
      description,
      suggestedDate: suggestedDate ? new Date(suggestedDate) : undefined,
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    logger.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create activity' },
    });
  }
});

// GET /api/v1/activities/:workspaceId - List activities
router.get('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const status = req.query.status as string | undefined;

    const activities = await getActivities(workspaceId, { status });

    res.json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    logger.error('List activities error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to list activities' },
    });
  }
});

// PATCH /api/v1/activities/:workspaceId/:activityId - Update activity status
router.patch('/:workspaceId/:activityId', async (req: Request, res: Response) => {
  try {
    const { workspaceId, activityId } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Invalid status' },
      });
      return;
    }

    await updateActivityStatus(activityId, workspaceId, status);

    res.json({
      success: true,
      message: 'Activity updated',
    });
  } catch (error) {
    logger.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update activity' },
    });
  }
});

export default router;
