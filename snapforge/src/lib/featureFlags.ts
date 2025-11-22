import { featureFlags as envFeatureFlags, FeatureFlags } from '../config';
import { prisma } from './database';
import { logger } from '../config/logger';

// In-memory cache for feature flags
let flagsCache: Map<string, boolean> = new Map();
let lastCacheUpdate: Date | null = null;
const CACHE_TTL_MS = 60000; // 1 minute

// Feature flag names enum
export enum Feature {
  PDF_EXPORT = 'pdfExport',
  FULL_PAGE_CAPTURE = 'fullPageCapture',
  CUSTOM_VIEWPORT = 'customViewport',
  DELAY_CAPTURE = 'delayCapture',
  ELEMENT_SELECTOR = 'elementSelector',
  WEBHOOK_CALLBACK = 'webhookCallback',
}

// Initialize feature flags from environment
const initializeFlags = (): void => {
  Object.entries(envFeatureFlags).forEach(([key, value]) => {
    flagsCache.set(key, value);
  });
  lastCacheUpdate = new Date();
};

// Initialize on module load
initializeFlags();

// Refresh cache from database
const refreshCache = async (): Promise<void> => {
  try {
    const dbFlags = await prisma.featureFlag.findMany();

    dbFlags.forEach(flag => {
      flagsCache.set(flag.name, flag.enabled);
    });

    lastCacheUpdate = new Date();
    logger.debug('Feature flags cache refreshed');
  } catch (error) {
    logger.warn('Failed to refresh feature flags from database, using cached values');
  }
};

// Check if cache needs refresh
const shouldRefreshCache = (): boolean => {
  if (!lastCacheUpdate) return true;
  return Date.now() - lastCacheUpdate.getTime() > CACHE_TTL_MS;
};

// Check if a feature is enabled
export const isFeatureEnabled = async (feature: Feature | string): Promise<boolean> => {
  if (shouldRefreshCache()) {
    await refreshCache();
  }

  const value = flagsCache.get(feature);
  return value ?? false;
};

// Synchronous check (uses cached value, may be stale)
export const isFeatureEnabledSync = (feature: Feature | string): boolean => {
  return flagsCache.get(feature) ?? false;
};

// Get all feature flags
export const getAllFeatureFlags = async (): Promise<Record<string, boolean>> => {
  if (shouldRefreshCache()) {
    await refreshCache();
  }

  const flags: Record<string, boolean> = {};
  flagsCache.forEach((value, key) => {
    flags[key] = value;
  });

  return flags;
};

// Set a feature flag (persists to database)
export const setFeatureFlag = async (name: string, enabled: boolean): Promise<void> => {
  await prisma.featureFlag.upsert({
    where: { name },
    update: { enabled },
    create: { name, enabled },
  });

  flagsCache.set(name, enabled);
  logger.info(`Feature flag ${name} set to ${enabled}`);
};

// Export types
export type { FeatureFlags };
