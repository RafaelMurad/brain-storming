import { Request, Response, NextFunction } from 'express';
import { validateApiKey, ApiKeyData } from '../services/apiKey.service';
import { logger } from '../config/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKeyData;
    }
  }
}

// Extract API key from request
const extractApiKey = (req: Request): string | null => {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check X-API-Key header
  const apiKeyHeader = req.headers['x-api-key'];
  if (typeof apiKeyHeader === 'string') {
    return apiKeyHeader;
  }

  // Check query parameter
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
  const rawKey = extractApiKey(req);

  if (!rawKey) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key is required. Provide via Authorization header, X-API-Key header, or api_key query parameter.',
      },
    });
    return;
  }

  const validation = await validateApiKey(rawKey);

  if (!validation.valid || !validation.apiKey) {
    logger.warn(`Invalid API key attempt: ${rawKey.substring(0, 10)}...`);
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: validation.error || 'Invalid API key',
      },
    });
    return;
  }

  req.apiKey = validation.apiKey;
  next();
};

// Permission check middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.apiKey) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!req.apiKey.permissions.includes(permission)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Permission '${permission}' is required for this operation`,
        },
      });
      return;
    }

    next();
  };
};

// Optional authentication (doesn't fail if no key provided)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const rawKey = extractApiKey(req);

  if (rawKey) {
    const validation = await validateApiKey(rawKey);
    if (validation.valid && validation.apiKey) {
      req.apiKey = validation.apiKey;
    }
  }

  next();
};
