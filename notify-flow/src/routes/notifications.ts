import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as notificationService from '../services/notificationService';

const router = Router();

// Send notification
router.post('/send', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = notificationService.sendNotificationSchema.parse(req.body);

    const result = await notificationService.sendNotification(
      authReq.apiKey!.projectId,
      input
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Send batch notifications
router.post('/send/batch', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { notifications } = notificationService.sendBatchSchema.parse(req.body);

    const result = await notificationService.sendBatchNotifications(
      authReq.apiKey!.projectId,
      notifications
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Get notification by ID
router.get('/:id', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const notification = await notificationService.getNotification(
      req.params.id,
      authReq.apiKey!.projectId
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Notification not found' },
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
});

// List notifications
router.get('/', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const query: notificationService.NotificationQuery = {
      projectId: authReq.apiKey!.projectId,
      status: req.query.status as string,
      recipient: req.query.recipient as string,
      recipientType: req.query.recipientType as string,
      tag: req.query.tag as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
    };

    const result = await notificationService.queryNotifications(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Get notification stats
router.get('/stats/overview', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;

    const stats = await notificationService.getNotificationStats(
      authReq.apiKey!.projectId,
      days
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
