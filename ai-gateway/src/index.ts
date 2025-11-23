import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './lib/db';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import completionsRouter from './routes/completions';
import usageRouter from './routes/usage';
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
  res.json({ status: 'ok', service: 'ai-gateway', timestamp: new Date().toISOString() });
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
app.use('/api/v1/completions', completionsRouter);
app.use('/api/v1/usage', usageRouter);
app.use('/api/v1/projects', projectsRouter);

// API documentation endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    service: 'AI Gateway',
    version: '1.0.0',
    description: 'Smart AI Provider Proxy with Caching & Cost Optimization',
    endpoints: {
      completions: {
        'POST /api/v1/completions/chat': 'Chat completion (OpenAI-compatible)',
        'POST /api/v1/completions/embeddings': 'Create embeddings',
        'GET /api/v1/completions/models': 'List available models with pricing',
      },
      usage: {
        'GET /api/v1/usage/stats': 'Get usage statistics',
        'GET /api/v1/usage/costs': 'Get cost breakdown',
        'GET /api/v1/usage/budget': 'Check budget status',
      },
      projects: {
        'POST /api/v1/projects': 'Create a new project',
        'GET /api/v1/projects/current': 'Get current project info',
        'PATCH /api/v1/projects/keys': 'Update provider API keys',
        'POST /api/v1/projects/api-keys': 'Create new API key',
        'GET /api/v1/projects/api-keys': 'List API keys',
        'DELETE /api/v1/projects/api-keys/:keyId': 'Revoke API key',
      },
    },
    features: [
      'Response caching (configurable TTL)',
      'Cost tracking per request',
      'Budget limits (daily/monthly)',
      'Multi-model support',
      'Usage analytics',
    ],
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
    logger.info(`AI Gateway running on port ${config.port}`, {
      environment: config.nodeEnv,
    });
  });
}

main().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});

export default app;
