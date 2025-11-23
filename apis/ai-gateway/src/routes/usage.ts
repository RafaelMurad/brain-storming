import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as usageService from '../services/usageService';

const router = Router();

// Get usage stats
router.get('/stats', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

    const stats = await usageService.getUsageStats(authReq.apiKey!.projectId, days);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// Get cost breakdown
router.get('/costs', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const breakdown = await usageService.getCostBreakdown(
      authReq.apiKey!.projectId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: {
        breakdown,
        total: breakdown.reduce((sum, b) => sum + b.cost, 0),
        period: { start: startDate.toISOString(), end: endDate.toISOString() },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get budget status
router.get('/budget', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const budgetStatus = await usageService.checkBudget(
      authReq.apiKey!.id,
      authReq.apiKey!.dailyBudget,
      authReq.apiKey!.monthlyBudget
    );

    res.json({
      success: true,
      data: {
        allowed: budgetStatus.allowed,
        dailyBudget: authReq.apiKey!.dailyBudget,
        monthlyBudget: authReq.apiKey!.monthlyBudget,
        ...(!budgetStatus.allowed && {
          reason: budgetStatus.reason,
          currentSpend: budgetStatus.currentSpend,
          limit: budgetStatus.limit,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
