import { Request, Response, NextFunction } from 'express';
import { validateSession } from '../services/auth.service';

export interface AuthRequest extends Request {
  userId?: string;
  isAnonymous?: boolean;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' },
    });
    return;
  }
  
  const token = authHeader.substring(7);
  const payload = await validateSession(token);
  
  if (!payload) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
    return;
  }
  
  req.userId = payload.userId;
  req.isAnonymous = payload.isAnonymous;
  
  next();
};

// Optional auth - doesn't fail if no token, but attaches user if present
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await validateSession(token);
    
    if (payload) {
      req.userId = payload.userId;
      req.isAnonymous = payload.isAnonymous;
    }
  }
  
  next();
};
