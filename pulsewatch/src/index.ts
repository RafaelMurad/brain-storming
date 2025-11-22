import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './config/logger';
import { disconnectDatabase, checkDatabaseHealth } from './lib/database';

// Import routes
import monitorRoutes from './routes/monitor.routes';
import mentionRoutes from './routes/mention.routes';

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
app.use('/api/v1/monitors', monitorRoutes);
app.use('/api/v1/mentions', mentionRoutes);

// Health check
app.get('/health', async (_req, res) => {
  const dbHealthy = await checkDatabaseHealth();
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: dbHealthy ? 'up' : 'down',
    },
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'PulseWatch',
    version: '1.0.0',
    description: 'AI-Powered Social Listening & Lead Generation Platform',
    documentation: `${config.apiBaseUrl}/docs`,
    endpoints: {
      monitors: {
        create: 'POST /api/v1/monitors',
        list: 'GET /api/v1/monitors',
        get: 'GET /api/v1/monitors/:id',
        update: 'PATCH /api/v1/monitors/:id',
        delete: 'DELETE /api/v1/monitors/:id',
        scan: 'POST /api/v1/monitors/:id/scan',
      },
      mentions: {
        list: 'GET /api/v1/mentions',
        get: 'GET /api/v1/mentions/:id',
        stats: 'GET /api/v1/mentions/stats',
        leads: 'GET /api/v1/mentions/leads',
        markRead: 'POST /api/v1/mentions/:id/read',
        flag: 'POST /api/v1/mentions/:id/flag',
        archive: 'DELETE /api/v1/mentions/:id',
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
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, shutting down...`);
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    logger.info(`🔍 PulseWatch API running on http://localhost:${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });
}

export { app };
