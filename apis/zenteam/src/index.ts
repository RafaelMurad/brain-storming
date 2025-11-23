import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './config/logger';
import { disconnectDatabase, checkDatabaseHealth } from './lib/database';

// Import routes
import checkinRoutes from './routes/checkin.routes';
import memberRoutes from './routes/member.routes';
import activityRoutes from './routes/activity.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: {
      success: false,
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
    },
  })
);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.debug(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// API Routes
app.use('/api/v1/checkins', checkinRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/activities', activityRoutes);

// Health check
app.get('/health', async (_req, res) => {
  const dbHealthy = await checkDatabaseHealth();
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'ZenTeam',
    version: '1.0.0',
    description: 'AI-Powered Team Culture & Burnout Prevention Platform',
    endpoints: {
      checkins: {
        create: 'POST /api/v1/checkins',
        history: 'GET /api/v1/checkins/member/:memberId',
        stats: 'GET /api/v1/checkins/stats/:workspaceId',
        missing: 'GET /api/v1/checkins/missing/:workspaceId',
      },
      members: {
        create: 'POST /api/v1/members',
        list: 'GET /api/v1/members/:workspaceId',
        atRisk: 'GET /api/v1/members/:workspaceId/at-risk',
        wellness: 'GET /api/v1/members/:workspaceId/wellness',
      },
      activities: {
        suggestions: 'GET /api/v1/activities/suggestions/:workspaceId',
        insights: 'GET /api/v1/activities/insights/:workspaceId',
        create: 'POST /api/v1/activities',
        list: 'GET /api/v1/activities/:workspaceId',
      },
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  await disconnectDatabase();
  process.exit(0);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    logger.info(`🧘 ZenTeam API running on http://localhost:${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });
}

export { app };
