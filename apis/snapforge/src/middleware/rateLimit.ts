import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../config';
import { logger } from '../config/logger';

// Dynamic rate limit based on API key
const getKeyFromRequest = (req: Request): string => {
  // Use API key ID if authenticated, otherwise use IP
  if (req.apiKey) {
    return `apikey:${req.apiKey.id}`;
  }
  return `ip:${req.ip}`;
};

// Get rate limit for request
const getRateLimitForRequest = (req: Request): number => {
  if (req.apiKey) {
    return req.apiKey.rateLimit;
  }
  return config.rateLimitMaxRequests;
};

// Standard rate limiter
export const standardRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  keyGenerator: getKeyFromRequest,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for ${getKeyFromRequest(req)}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
      },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for expensive operations (screenshots)
export const strictRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: (req: Request) => Math.ceil(getRateLimitForRequest(req) / 2), // Half the normal rate
  keyGenerator: getKeyFromRequest,
  handler: (req: Request, res: Response) => {
    logger.warn(`Strict rate limit exceeded for ${getKeyFromRequest(req)}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Screenshot rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
      },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Burst rate limiter for short bursts
export const burstRateLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 10, // 10 requests per second max
  keyGenerator: getKeyFromRequest,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'BURST_LIMIT_EXCEEDED',
        message: 'Too many requests in a short period. Please slow down.',
        retryAfter: 1,
      },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
