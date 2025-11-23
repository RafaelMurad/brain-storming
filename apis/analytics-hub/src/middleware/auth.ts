import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/db';
import { logger } from '../lib/logger';

export interface AuthenticatedRequest extends Request {
  apiKey?: {
    id: string;
    key: string;
    projectId: string;
    permissions: string[];
    rateLimit: number;
  };
}

export function authenticate(requiredPermission?: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const apiKeyHeader = req.headers['x-api-key'];

      let keyValue: string | undefined;

      if (authHeader?.startsWith('Bearer ')) {
        keyValue = authHeader.substring(7);
      } else if (typeof apiKeyHeader === 'string') {
        keyValue = apiKeyHeader;
      }

      if (!keyValue) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'API key required. Provide via Authorization header or X-API-Key header.',
          },
        });
      }

      const apiKey = await prisma.apiKey.findUnique({
        where: { key: keyValue },
      });

      if (!apiKey || !apiKey.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_API_KEY',
            message: 'Invalid or inactive API key.',
          },
        });
      }

      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'API_KEY_EXPIRED',
            message: 'API key has expired.',
          },
        });
      }

      const permissions = apiKey.permissions.split(',').map(p => p.trim());

      if (requiredPermission && !permissions.includes(requiredPermission) && !permissions.includes('admin')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Permission '${requiredPermission}' required.`,
          },
        });
      }

      // Update last used timestamp (fire and forget)
      prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      }).catch(() => {});

      req.apiKey = {
        id: apiKey.id,
        key: apiKey.key,
        projectId: apiKey.projectId,
        permissions,
        rateLimit: apiKey.rateLimit,
      };

      next();
    } catch (error) {
      logger.error('Authentication error', { error });
      return res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication failed.',
        },
      });
    }
  };
}

export function optionalAuth() {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'];

    let keyValue: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      keyValue = authHeader.substring(7);
    } else if (typeof apiKeyHeader === 'string') {
      keyValue = apiKeyHeader;
    }

    if (keyValue) {
      const apiKey = await prisma.apiKey.findUnique({
        where: { key: keyValue },
      });

      if (apiKey && apiKey.isActive) {
        req.apiKey = {
          id: apiKey.id,
          key: apiKey.key,
          projectId: apiKey.projectId,
          permissions: apiKey.permissions.split(',').map(p => p.trim()),
          rateLimit: apiKey.rateLimit,
        };
      }
    }

    next();
  };
}
