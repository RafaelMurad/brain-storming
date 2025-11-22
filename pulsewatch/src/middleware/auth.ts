import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/database';
import { logger } from '../config/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string | null;
        plan: string;
      };
    }
  }
}

// Extract API key from request
const extractApiKey = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const apiKeyHeader = req.headers['x-api-key'];
  if (typeof apiKeyHeader === 'string') {
    return apiKeyHeader;
  }

  const queryKey = req.query.api_key;
  if (typeof queryKey === 'string') {
    return queryKey;
  }

  return null;
};

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = extractApiKey(req);

  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key is required',
      },
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { apiKey },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      isActive: true,
    },
  });

  if (!user) {
    logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 10)}...`);
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key',
      },
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      success: false,
      error: {
        code: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive',
      },
    });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
  };

  next();
};

// Plan-based access control
export const requirePlan = (...plans: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!plans.includes(req.user.plan)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'UPGRADE_REQUIRED',
          message: `This feature requires one of these plans: ${plans.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
};
