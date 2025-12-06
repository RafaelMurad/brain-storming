import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth } from './lib/database';
import { seedAchievements } from './services/achievement.service';

// Import routes
import authRoutes from './routes/auth.routes';
import progressRoutes from './routes/progress.routes';
import achievementRoutes from './routes/achievement.routes';
import exerciseRoutes from './routes/exercise.routes';
import notesRoutes from './routes/notes.routes';

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiting
app.use(rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  },
}));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.debug(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/notes', notesRoutes);

// Simple ping endpoint (no async operations)
app.get('/ping', (_req, res) => {
  res.json({ pong: true, timestamp: Date.now() });
});

// Health check
app.get('/health', async (_req, res) => {
  try {
    const dbHealthy = await checkDatabaseHealth();
    res.status(dbHealthy ? 200 : 503).json({
      success: dbHealthy,
      data: {
        status: dbHealthy ? 'healthy' : 'unhealthy',
        database: dbHealthy ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      data: { status: 'error', database: 'error', timestamp: new Date().toISOString() },
    });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Internal server error' },
  });
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down...');
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Check if a port is available
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

// Find an available port starting from the preferred port
const findAvailablePort = async (startPort: number, maxAttempts: number = 10): Promise<number> => {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    logger.warn(`Port ${port} is in use, trying ${port + 1}...`);
  }
  throw new Error(`Could not find available port after ${maxAttempts} attempts starting from ${startPort}`);
};

// Start server
const start = async () => {
  try {
    await connectDatabase();
    await seedAchievements();
    
    // Find an available port
    const port = await findAvailablePort(config.port);
    
    if (port !== config.port) {
      logger.warn(`Default port ${config.port} was unavailable, using port ${port}`);
    }
    
    app.listen(port, () => {
      logger.info(`🚀 Three.js Academy API running on port ${port}`);
      logger.info(`   Environment: ${config.nodeEnv}`);
      logger.info(`   Frontend URL: ${config.frontendUrl}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
