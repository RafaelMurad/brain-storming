import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { prisma } from '../lib/database';
import { config } from '../config';
import { logger } from '../config/logger';

export interface TokenPayload {
  userId: string;
  isAnonymous: boolean;
}

export interface AuthResult {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    isAnonymous: boolean;
  };
  token: string;
  isNewUser: boolean;
}

// Hash fingerprint for privacy
const hashFingerprint = (fingerprint: string): string => {
  return crypto.createHash('sha256').update(fingerprint).digest('hex');
};

// Generate JWT token
const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch {
    return null;
  }
};

// Anonymous authentication with device fingerprint
export const authenticateAnonymous = async (fingerprint: string): Promise<AuthResult> => {
  const hashedFingerprint = hashFingerprint(fingerprint);
  
  // Check for existing user
  let user = await prisma.user.findUnique({
    where: { fingerprint: hashedFingerprint },
  });
  
  const isNewUser = !user;
  
  if (!user) {
    // Create new anonymous user
    user = await prisma.user.create({
      data: {
        id: uuidv4(),
        fingerprint: hashedFingerprint,
        isAnonymous: true,
        name: `Learner_${Math.random().toString(36).substring(2, 8)}`,
      },
    });
    logger.info('Created new anonymous user', { userId: user.id });
  }
  
  const token = generateToken({
    userId: user.id,
    isAnonymous: user.isAnonymous,
  });
  
  // Store session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAnonymous: user.isAnonymous,
    },
    token,
    isNewUser,
  };
};

// GitHub OAuth authentication
export const authenticateGitHub = async (
  githubId: string,
  email: string | null,
  name: string | null,
  avatar: string | null,
  existingUserId?: string
): Promise<AuthResult> => {
  let user = await prisma.user.findUnique({
    where: { githubId },
  });
  
  const isNewUser = !user;
  
  if (!user && existingUserId) {
    // Upgrade anonymous user to GitHub user
    user = await prisma.user.update({
      where: { id: existingUserId },
      data: {
        githubId,
        email,
        name,
        avatar,
        isAnonymous: false,
      },
    });
    logger.info('Upgraded anonymous user to GitHub', { userId: user.id });
  } else if (!user) {
    // Create new GitHub user
    user = await prisma.user.create({
      data: {
        id: uuidv4(),
        githubId,
        email,
        name,
        avatar,
        isAnonymous: false,
      },
    });
    logger.info('Created new GitHub user', { userId: user.id });
  }
  
  const token = generateToken({
    userId: user.id,
    isAnonymous: false,
  });
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAnonymous: user.isAnonymous,
    },
    token,
    isNewUser,
  };
};

// Validate session
export const validateSession = async (token: string): Promise<TokenPayload | null> => {
  const payload = verifyToken(token);
  if (!payload) return null;
  
  const session = await prisma.session.findUnique({
    where: { token },
  });
  
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  
  return payload;
};

// Logout - invalidate session
export const logout = async (token: string): Promise<void> => {
  await prisma.session.deleteMany({
    where: { token },
  });
};
