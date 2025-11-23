import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './config/logger';
import { disconnectDatabase } from './lib/database';
import { closeBrowser } from './services/screenshot.service';
import { standardRateLimiter, burstRateLimiter } from './middleware/rateLimit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import healthRoutes from './routes/health.routes';
import screenshotRoutes from './routes/screenshot.routes';
import apiKeyRoutes from './routes/apiKey.routes';

// Create Express application
const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.nodeEnv === 'production' ? false : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
app.use(burstRateLimiter);
app.use(standardRateLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/health', healthRoutes);
app.use('/api/v1/screenshot', screenshotRoutes);
app.use('/api/v1/keys', apiKeyRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'SnapForge',
    version: '1.0.0',
    description: 'Professional Screenshot & PDF API Service',
    documentation: `${config.apiBaseUrl}/docs`,
    health: `${config.apiBaseUrl}/health`,
    endpoints: {
      screenshot: {
        create: 'POST /api/v1/screenshot',
        get: 'GET /api/v1/screenshot/:id',
        download: 'GET /api/v1/screenshot/:id/download',
        list: 'GET /api/v1/screenshots',
        delete: 'DELETE /api/v1/screenshot/:id',
      },
      apiKeys: {
        create: 'POST /api/v1/keys',
        list: 'GET /api/v1/keys',
        get: 'GET /api/v1/keys/:id',
        update: 'PATCH /api/v1/keys/:id',
        revoke: 'POST /api/v1/keys/:id/revoke',
        delete: 'DELETE /api/v1/keys/:id',
        usage: 'GET /api/v1/keys/:id/usage',
      },
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, shutting down gracefully...`);

  try {
    await closeBrowser();
    await disconnectDatabase();
    logger.info('Cleanup completed, exiting');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = (): void => {
  app.listen(config.port, () => {
    logger.info(`🚀 SnapForge API running on http://localhost:${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://localhost:${config.port}/health`);
  });
};

// Only start if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app };
