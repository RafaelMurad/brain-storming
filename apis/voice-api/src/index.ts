import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './lib/db';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import transcriptionsRouter from './routes/transcriptions';
import configsRouter from './routes/configs';
import vocabulariesRouter from './routes/vocabularies';
import projectsRouter from './routes/projects';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.nodeEnv === 'production' ? false : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Rate limiting
app.use(rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'voice-api', timestamp: new Date().toISOString() });
});

app.get('/health/ready', async (req, res) => {
  try {
    const { prisma } = await import('./lib/db');
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'disconnected' });
  }
});

// API routes
app.use('/api/v1/transcriptions', transcriptionsRouter);
app.use('/api/v1/configs', configsRouter);
app.use('/api/v1/vocabularies', vocabulariesRouter);
app.use('/api/v1/projects', projectsRouter);

// API documentation endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    service: 'Voice API',
    version: '1.0.0',
    description: 'AI-Powered Voice Recognition API with Configurable Options',
    endpoints: {
      transcriptions: {
        'POST /api/v1/transcriptions/transcribe': 'Transcribe audio file (multipart/form-data)',
        'GET /api/v1/transcriptions/:id': 'Get transcription status and result',
        'GET /api/v1/transcriptions': 'List transcriptions',
        'GET /api/v1/transcriptions/meta/languages': 'Get supported languages',
      },
      configs: {
        'POST /api/v1/configs': 'Create config preset',
        'GET /api/v1/configs': 'List config presets',
        'GET /api/v1/configs/:id': 'Get config',
        'PATCH /api/v1/configs/:id': 'Update config',
        'DELETE /api/v1/configs/:id': 'Delete config',
      },
      vocabularies: {
        'POST /api/v1/vocabularies': 'Create custom vocabulary',
        'GET /api/v1/vocabularies': 'List vocabularies',
        'GET /api/v1/vocabularies/:id': 'Get vocabulary',
        'PATCH /api/v1/vocabularies/:id': 'Update vocabulary',
        'DELETE /api/v1/vocabularies/:id': 'Delete vocabulary',
      },
      projects: {
        'POST /api/v1/projects': 'Create a new project',
        'GET /api/v1/projects/current': 'Get current project info',
        'POST /api/v1/projects/api-keys': 'Create new API key',
        'GET /api/v1/projects/api-keys': 'List API keys',
        'DELETE /api/v1/projects/api-keys/:keyId': 'Revoke API key',
      },
    },
    supportedFormats: ['mp3', 'wav', 'webm', 'ogg', 'm4a', 'flac'],
    providers: ['openai (Whisper)', 'assemblyai', 'deepgram'],
    authentication: 'Bearer token or X-API-Key header',
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
async function main() {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`Voice API running on port ${config.port}`, {
      environment: config.nodeEnv,
    });
  });
}

main().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});

export default app;
