import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { config } from '../config';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
}

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error caught by handler:', err);

  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };

  let statusCode = 500;

  // Handle known error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.error.code = err.code;
    response.error.message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    response.error.code = 'VALIDATION_ERROR';
    response.error.message = 'Invalid request data';
    response.error.details = err.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  } else if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    response.error.code = 'DATABASE_ERROR';
    response.error.message = 'Database operation failed';
  } else if (err.message.includes('not found')) {
    statusCode = 404;
    response.error.code = 'NOT_FOUND';
    response.error.message = err.message;
  }

  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};

// Async handler wrapper
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
