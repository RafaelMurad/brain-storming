import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, requirePermission } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimit';
import { asyncHandler } from '../middleware/errorHandler';
import {
  takeScreenshot,
  getScreenshot,
  getScreenshotsByApiKey,
  deleteScreenshot,
} from '../services/screenshot.service';
import { logApiUsage } from '../services/apiKey.service';
import { config } from '../config';
import { logger } from '../config/logger';

const router = Router();

// Request validation schemas
const screenshotRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  format: z.enum(['png', 'jpeg', 'pdf']).optional().default('png'),
  width: z.coerce
    .number()
    .min(100)
    .max(config.maxScreenshotWidth)
    .optional()
    .default(1280),
  height: z.coerce
    .number()
    .min(100)
    .max(config.maxScreenshotHeight)
    .optional()
    .default(720),
  fullPage: z.coerce.boolean().optional().default(false),
  delay: z.coerce.number().min(0).max(10000).optional().default(0),
  selector: z.string().optional(),
  quality: z.coerce.number().min(1).max(100).optional(),
});

// POST /api/v1/screenshot - Take a new screenshot
router.post(
  '/',
  authenticate,
  requirePermission('write'),
  strictRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();

    // Validate request body
    const validated = screenshotRequestSchema.parse(req.body);

    logger.info(`Screenshot request for: ${validated.url}`);

    // Take screenshot
    const result = await takeScreenshot(req.apiKey!.id, validated);

    // Log usage
    await logApiUsage(
      req.apiKey!.id,
      '/api/v1/screenshot',
      'POST',
      200,
      Date.now() - startTime
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.id,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        fileSize: result.fileSize,
        processingMs: result.processingMs,
        downloadUrl: `${config.apiBaseUrl}/api/v1/screenshot/${result.id}/download`,
      },
    });
  })
);

// GET /api/v1/screenshot/:id - Get screenshot metadata
router.get(
  '/:id',
  authenticate,
  requirePermission('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { screenshot } = await getScreenshot(id);

    res.json({
      success: true,
      data: {
        id: screenshot!.id,
        url: screenshot!.url,
        status: screenshot!.status,
        format: screenshot!.format,
        width: screenshot!.width,
        height: screenshot!.height,
        fullPage: screenshot!.fullPage,
        fileSize: screenshot!.fileSize,
        processingMs: screenshot!.processingMs,
        errorMessage: screenshot!.errorMessage,
        createdAt: screenshot!.createdAt,
        completedAt: screenshot!.completedAt,
        downloadUrl:
          screenshot!.status === 'completed'
            ? `${config.apiBaseUrl}/api/v1/screenshot/${id}/download`
            : null,
      },
    });
  })
);

// GET /api/v1/screenshot/:id/download - Download screenshot file
router.get(
  '/:id/download',
  authenticate,
  requirePermission('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { screenshot, buffer } = await getScreenshot(id);

    if (!buffer) {
      res.status(404).json({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: 'Screenshot file not available',
        },
      });
      return;
    }

    // Set appropriate content type
    const contentTypes: Record<string, string> = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      pdf: 'application/pdf',
    };

    res.setHeader('Content-Type', contentTypes[screenshot!.format] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${id}.${screenshot!.format}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  })
);

// GET /api/v1/screenshots - List screenshots for authenticated user
router.get(
  's',
  authenticate,
  requirePermission('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const screenshots = await getScreenshotsByApiKey(req.apiKey!.id, limit, offset);

    res.json({
      success: true,
      data: {
        screenshots: screenshots.map(s => ({
          id: s.id,
          url: s.url,
          status: s.status,
          format: s.format,
          width: s.width,
          height: s.height,
          fileSize: s.fileSize,
          processingMs: s.processingMs,
          createdAt: s.createdAt,
          completedAt: s.completedAt,
        })),
        pagination: {
          limit,
          offset,
          hasMore: screenshots.length === limit,
        },
      },
    });
  })
);

// DELETE /api/v1/screenshot/:id - Delete a screenshot
router.delete(
  '/:id',
  authenticate,
  requirePermission('write'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteScreenshot(id);

    res.json({
      success: true,
      message: 'Screenshot deleted successfully',
    });
  })
);

export default router;
