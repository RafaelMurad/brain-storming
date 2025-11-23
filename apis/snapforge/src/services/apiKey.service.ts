import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { prisma } from '../lib/database';
import { config } from '../config';
import { logger } from '../config/logger';

// API Key interface
export interface ApiKeyData {
  id: string;
  key: string;
  name: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}

// Generate a secure API key
const generateApiKey = (): string => {
  const prefix = 'sf'; // SnapForge prefix
  const randomPart = crypto.randomBytes(24).toString('base64url');
  return `${prefix}_${randomPart}`;
};

// Hash API key for storage comparison
export const hashApiKey = (key: string): string => {
  return crypto.createHmac('sha256', config.apiKeySecret).update(key).digest('hex');
};

// Create a new API key
export const createApiKey = async (
  name: string,
  options?: {
    permissions?: string[];
    rateLimit?: number;
    expiresInDays?: number;
    userId?: string;
  }
): Promise<ApiKeyData> => {
  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  const expiresAt = options?.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const apiKey = await prisma.apiKey.create({
    data: {
      key: hashedKey,
      name,
      userId: options?.userId,
      permissions: (options?.permissions || ['read', 'write']).join(','),
      rateLimit: options?.rateLimit || 100,
      expiresAt,
    },
  });

  logger.info(`API key created: ${apiKey.id}`);

  // Return with the raw key (only time it's available)
  return {
    id: apiKey.id,
    key: rawKey, // Return raw key only on creation
    name: apiKey.name,
    permissions: apiKey.permissions.split(','),
    rateLimit: apiKey.rateLimit,
    isActive: apiKey.isActive,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt,
  };
};

// Validate API key
export const validateApiKey = async (
  rawKey: string
): Promise<{
  valid: boolean;
  apiKey?: ApiKeyData;
  error?: string;
}> => {
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
  });

  if (!apiKey) {
    return { valid: false, error: 'Invalid API key' };
  }

  if (!apiKey.isActive) {
    return { valid: false, error: 'API key is inactive' };
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return { valid: false, error: 'API key has expired' };
  }

  return {
    valid: true,
    apiKey: {
      id: apiKey.id,
      key: '***hidden***',
      name: apiKey.name,
      permissions: apiKey.permissions.split(','),
      rateLimit: apiKey.rateLimit,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      expiresAt: apiKey.expiresAt,
    },
  };
};

// Get API key by ID (without the actual key)
export const getApiKeyById = async (id: string): Promise<ApiKeyData | null> => {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id },
  });

  if (!apiKey) {
    return null;
  }

  return {
    id: apiKey.id,
    key: '***hidden***',
    name: apiKey.name,
    permissions: apiKey.permissions.split(','),
    rateLimit: apiKey.rateLimit,
    isActive: apiKey.isActive,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt,
  };
};

// List API keys for a user
export const listApiKeys = async (userId?: string): Promise<ApiKeyData[]> => {
  const apiKeys = await prisma.apiKey.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return apiKeys.map(apiKey => ({
    id: apiKey.id,
    key: '***hidden***',
    name: apiKey.name,
    permissions: apiKey.permissions.split(','),
    rateLimit: apiKey.rateLimit,
    isActive: apiKey.isActive,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt,
  }));
};

// Revoke API key
export const revokeApiKey = async (id: string): Promise<void> => {
  await prisma.apiKey.update({
    where: { id },
    data: { isActive: false },
  });

  logger.info(`API key revoked: ${id}`);
};

// Delete API key
export const deleteApiKey = async (id: string): Promise<void> => {
  await prisma.apiKey.delete({
    where: { id },
  });

  logger.info(`API key deleted: ${id}`);
};

// Update API key
export const updateApiKey = async (
  id: string,
  updates: {
    name?: string;
    permissions?: string[];
    rateLimit?: number;
    isActive?: boolean;
  }
): Promise<ApiKeyData> => {
  const updateData: {
    name?: string;
    permissions?: string;
    rateLimit?: number;
    isActive?: boolean;
  } = {};

  if (updates.name) updateData.name = updates.name;
  if (updates.permissions) updateData.permissions = updates.permissions.join(',');
  if (updates.rateLimit) updateData.rateLimit = updates.rateLimit;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

  const apiKey = await prisma.apiKey.update({
    where: { id },
    data: updateData,
  });

  return {
    id: apiKey.id,
    key: '***hidden***',
    name: apiKey.name,
    permissions: apiKey.permissions.split(','),
    rateLimit: apiKey.rateLimit,
    isActive: apiKey.isActive,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt,
  };
};

// Log API usage
export const logApiUsage = async (
  apiKeyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseMs: number,
  requestSize?: number
): Promise<void> => {
  await prisma.usageLog.create({
    data: {
      apiKeyId,
      endpoint,
      method,
      statusCode,
      responseMs,
      requestSize,
    },
  });
};

// Get usage stats for an API key
export const getUsageStats = async (
  apiKeyId: string,
  days = 30
): Promise<{
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseMs: number;
}> => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const logs = await prisma.usageLog.findMany({
    where: {
      apiKeyId,
      createdAt: { gte: since },
    },
  });

  const totalRequests = logs.length;
  const successfulRequests = logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
  const failedRequests = logs.filter(l => l.statusCode >= 400).length;
  const averageResponseMs =
    totalRequests > 0 ? logs.reduce((sum, l) => sum + l.responseMs, 0) / totalRequests : 0;

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageResponseMs: Math.round(averageResponseMs),
  };
};
