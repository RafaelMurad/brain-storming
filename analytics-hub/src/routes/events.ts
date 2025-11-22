import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as eventService from '../services/eventService';

const router = Router();

// Track single event
router.post('/track', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const event = eventService.eventSchema.parse(req.body);

    const result = await eventService.trackEvent(
      authReq.apiKey!.projectId,
      authReq.apiKey!.id,
      event,
      {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.socket.remoteAddress,
      }
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Track batch events
router.post('/track/batch', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { events } = eventService.batchEventSchema.parse(req.body);

    const result = await eventService.trackBatchEvents(
      authReq.apiKey!.projectId,
      authReq.apiKey!.id,
      events,
      {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.socket.remoteAddress,
      }
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Query events
router.get('/', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const query: eventService.EventQuery = {
      projectId: authReq.apiKey!.projectId,
      name: req.query.name as string,
      category: req.query.category as string,
      userId: req.query.userId as string,
      sessionId: req.query.sessionId as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
    };

    const result = await eventService.queryEvents(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
