import { Router, Request, Response } from 'express';
import { checkDatabaseHealth } from '../lib/database';
import { getAllFeatureFlags } from '../lib/featureFlags';
import { config } from '../config';

const router = Router();

// GET /health - Basic health check
router.get('/', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();

  const status = dbHealthy ? 'healthy' : 'degraded';
  const statusCode = dbHealthy ? 200 : 503;

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: dbHealthy ? 'up' : 'down',
    },
  });
});

// GET /health/detailed - Detailed health check
router.get('/detailed', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  const featureFlags = await getAllFeatureFlags();

  res.json({
    status: dbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
    services: {
      database: {
        status: dbHealthy ? 'up' : 'down',
      },
      screenshot: {
        status: 'up',
        maxWidth: config.maxScreenshotWidth,
        maxHeight: config.maxScreenshotHeight,
        timeout: config.screenshotTimeout,
      },
    },
    featureFlags,
    rateLimit: {
      windowMs: config.rateLimitWindowMs,
      maxRequests: config.rateLimitMaxRequests,
    },
  });
});

// GET /health/ready - Readiness probe
router.get('/ready', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();

  if (dbHealthy) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false, reason: 'Database not available' });
  }
});

// GET /health/live - Liveness probe
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ alive: true });
});

export default router;
