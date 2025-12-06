import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticateAnonymous, authenticateGitHub, logout } from '../services/auth.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/database';
import { config } from '../config';

const router = Router();

// Anonymous auth schema
const anonymousAuthSchema = z.object({
  fingerprint: z.string().min(10).max(256),
});

// POST /api/v1/auth/anonymous - Anonymous login with device fingerprint
router.post('/anonymous', async (req, res: Response) => {
  try {
    const parsed = anonymousAuthSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message },
      });
    }
    
    const result = await authenticateAnonymous(parsed.data.fingerprint);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
});

// GET /api/v1/auth/github - Redirect to GitHub OAuth
router.get('/github', (req, res: Response) => {
  if (!config.github.clientId) {
    return res.status(501).json({
      success: false,
      error: { code: 'NOT_CONFIGURED', message: 'GitHub OAuth not configured' },
    });
  }
  
  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: config.github.callbackUrl,
    scope: 'read:user user:email',
  });
  
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// GET /api/v1/auth/github/callback - GitHub OAuth callback
router.get('/github/callback', async (req, res: Response) => {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.redirect(`${config.frontendUrl}?error=no_code`);
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json() as any;
    
    if (tokenData.error) {
      return res.redirect(`${config.frontendUrl}?error=token_error`);
    }
    
    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    const userData = await userResponse.json() as any;
    
    // Get user email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    const emails = await emailResponse.json() as any[];
    const primaryEmail = emails.find((e: any) => e.primary)?.email || null;
    
    const result = await authenticateGitHub(
      String(userData.id),
      primaryEmail,
      userData.name || userData.login,
      userData.avatar_url
    );
    
    // Redirect to frontend with token
    res.redirect(`${config.frontendUrl}?token=${result.token}`);
  } catch (error) {
    res.redirect(`${config.frontendUrl}?error=auth_failed`);
  }
});

// GET /api/v1/auth/me - Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isAnonymous: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get user' },
    });
  }
});

// POST /api/v1/auth/logout - Logout
router.post('/logout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.substring(7);
    if (token) {
      await logout(token);
    }
    
    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Logout failed' },
    });
  }
});

export default router;
