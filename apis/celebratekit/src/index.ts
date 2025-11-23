import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import { logger } from './config/logger';
import { disconnectDatabase, checkDatabaseHealth } from './lib/database';

// Import routes
import celebrationRoutes from './routes/celebration.routes';
import achievementRoutes from './routes/achievement.routes';
import leaderboardRoutes from './routes/leaderboard.routes';

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for widget embedding
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS - allow all origins for widget
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Rate limiting
app.use(rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  },
}));

// Serve static files (widget)
app.use('/widget', express.static(path.join(__dirname, '../public')));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.debug(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// API Routes
app.use('/api/v1/celebrate', celebrationRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

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
    name: 'CelebrateKit',
    version: '1.0.0',
    description: 'Embeddable Celebration & Gamification API',
    widget: `${config.apiBaseUrl}/widget/celebratekit.js`,
    endpoints: {
      celebrations: {
        trigger: 'POST /api/v1/celebrate',
        presets: 'GET /api/v1/celebrate/presets',
        stats: 'GET /api/v1/celebrate/stats/:appId',
      },
      achievements: {
        create: 'POST /api/v1/achievements',
        list: 'GET /api/v1/achievements/:appId',
        unlock: 'POST /api/v1/achievements/unlock',
        userAchievements: 'GET /api/v1/achievements/:appId/user/:userId',
      },
      leaderboard: {
        get: 'GET /api/v1/leaderboard/:appId',
        userRank: 'GET /api/v1/leaderboard/:appId/user/:userId',
        userStats: 'GET /api/v1/leaderboard/:appId/user/:userId/stats',
        updateProgress: 'POST /api/v1/leaderboard/progress',
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
    logger.info(`🎉 CelebrateKit API running on http://localhost:${config.port}`);
    logger.info(`Widget: http://localhost:${config.port}/widget/celebratekit.js`);
  });
}

export { app };
