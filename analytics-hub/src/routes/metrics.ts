import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as metricsService from '../services/metricsService';
import { z } from 'zod';

const router = Router();

const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(['1h', '24h', '7d', '30d', '90d']).optional(),
});

function getDateRange(query: any): { startDate: Date; endDate: Date } {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  if (query.startDate) {
    return { startDate: new Date(query.startDate), endDate };
  }

  // Default periods
  const periods: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };

  const periodMs = periods[query.period || '7d'];
  const startDate = new Date(endDate.getTime() - periodMs);

  return { startDate, endDate };
}

// Dashboard overview
router.get('/dashboard', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { startDate, endDate } = getDateRange(req.query);

    const dashboard = await metricsService.getDashboardMetrics(
      authReq.apiKey!.projectId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
});

// Real-time stats
router.get('/realtime', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const stats = await metricsService.getRealTimeStats(authReq.apiKey!.projectId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// Event count
router.get('/count', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { startDate, endDate } = getDateRange(req.query);
    const eventName = req.query.event as string | undefined;

    const count = await metricsService.getEventCount(
      authReq.apiKey!.projectId,
      startDate,
      endDate,
      eventName
    );

    res.json({
      success: true,
      data: { count, period: { start: startDate, end: endDate } },
    });
  } catch (error) {
    next(error);
  }
});

// Unique users
router.get('/users', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { startDate, endDate } = getDateRange(req.query);

    const count = await metricsService.getUniqueUsers(
      authReq.apiKey!.projectId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: { uniqueUsers: count, period: { start: startDate, end: endDate } },
    });
  } catch (error) {
    next(error);
  }
});

// Top events
router.get('/top-events', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { startDate, endDate } = getDateRange(req.query);
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const events = await metricsService.getTopEvents(
      authReq.apiKey!.projectId,
      startDate,
      endDate,
      limit
    );

    res.json({
      success: true,
      data: { events, period: { start: startDate, end: endDate } },
    });
  } catch (error) {
    next(error);
  }
});

// Breakdown by dimension
router.get('/breakdown/:dimension', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { startDate, endDate } = getDateRange(req.query);
    const dimension = req.params.dimension as 'device' | 'browser' | 'os' | 'country' | 'source' | 'category';

    const validDimensions = ['device', 'browser', 'os', 'country', 'source', 'category'];
    if (!validDimensions.includes(dimension)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DIMENSION',
          message: `Invalid dimension. Valid options: ${validDimensions.join(', ')}`,
        },
      });
    }

    const breakdown = await metricsService.getEventBreakdown(
      authReq.apiKey!.projectId,
      startDate,
      endDate,
      dimension
    );

    res.json({
      success: true,
      data: { breakdown, dimension, period: { start: startDate, end: endDate } },
    });
  } catch (error) {
    next(error);
  }
});

// Timeseries
router.get('/timeseries', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { startDate, endDate } = getDateRange(req.query);
    const interval = (req.query.interval as 'hour' | 'day') || 'day';
    const eventName = req.query.event as string | undefined;

    const timeseries = await metricsService.getTimeseries(
      authReq.apiKey!.projectId,
      startDate,
      endDate,
      interval,
      eventName
    );

    res.json({
      success: true,
      data: { timeseries, interval, period: { start: startDate, end: endDate } },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
