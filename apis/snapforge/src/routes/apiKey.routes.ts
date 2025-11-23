import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, requirePermission } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createApiKey,
  listApiKeys,
  getApiKeyById,
  updateApiKey,
  revokeApiKey,
  deleteApiKey,
  getUsageStats,
} from '../services/apiKey.service';

const router = Router();

// Validation schemas
const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).optional(),
  rateLimit: z.number().min(1).max(10000).optional(),
  expiresInDays: z.number().min(1).max(365).optional(),
});

const updateApiKeySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  permissions: z.array(z.string()).optional(),
  rateLimit: z.number().min(1).max(10000).optional(),
  isActive: z.boolean().optional(),
});

// POST /api/v1/keys - Create a new API key
router.post(
  '/',
  authenticate,
  requirePermission('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createApiKeySchema.parse(req.body);

    const apiKey = await createApiKey(validated.name, {
      permissions: validated.permissions,
      rateLimit: validated.rateLimit,
      expiresInDays: validated.expiresInDays,
    });

    res.status(201).json({
      success: true,
      data: {
        ...apiKey,
        message: 'Store this API key securely. It will not be shown again.',
      },
    });
  })
);

// GET /api/v1/keys - List all API keys
router.get(
  '/',
  authenticate,
  requirePermission('admin'),
  asyncHandler(async (_req: Request, res: Response) => {
    const apiKeys = await listApiKeys();

    res.json({
      success: true,
      data: { apiKeys },
    });
  })
);

// GET /api/v1/keys/:id - Get API key details
router.get(
  '/:id',
  authenticate,
  requirePermission('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const apiKey = await getApiKeyById(id);

    if (!apiKey) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'API key not found',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: apiKey,
    });
  })
);

// PATCH /api/v1/keys/:id - Update API key
router.patch(
  '/:id',
  authenticate,
  requirePermission('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validated = updateApiKeySchema.parse(req.body);

    const apiKey = await updateApiKey(id, validated);

    res.json({
      success: true,
      data: apiKey,
    });
  })
);

// POST /api/v1/keys/:id/revoke - Revoke API key
router.post(
  '/:id/revoke',
  authenticate,
  requirePermission('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await revokeApiKey(id);

    res.json({
      success: true,
      message: 'API key revoked successfully',
    });
  })
);

// DELETE /api/v1/keys/:id - Delete API key
router.delete(
  '/:id',
  authenticate,
  requirePermission('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteApiKey(id);

    res.json({
      success: true,
      message: 'API key deleted successfully',
    });
  })
);

// GET /api/v1/keys/:id/usage - Get usage stats for API key
router.get(
  '/:id/usage',
  authenticate,
  requirePermission('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const stats = await getUsageStats(id, days);

    res.json({
      success: true,
      data: {
        ...stats,
        period: `${days} days`,
      },
    });
  })
);

// GET /api/v1/keys/me/usage - Get usage stats for current API key
router.get(
  '/me/usage',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;

    const stats = await getUsageStats(req.apiKey!.id, days);

    res.json({
      success: true,
      data: {
        ...stats,
        period: `${days} days`,
      },
    });
  })
);

export default router;
