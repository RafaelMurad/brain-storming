import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Configuration schema with validation
const configSchema = z.object({
  // Server
  port: z.coerce.number().default(3001),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  apiBaseUrl: z.string().default('http://localhost:3001'),

  // Database
  databaseUrl: z.string().default('file:./dev.db'),

  // API Security
  apiKeySecret: z.string().default('dev-secret-change-in-production'),

  // Rate Limiting
  rateLimitWindowMs: z.coerce.number().default(60000),
  rateLimitMaxRequests: z.coerce.number().default(100),

  // Screenshot Settings
  screenshotTimeout: z.coerce.number().default(30000),
  maxScreenshotWidth: z.coerce.number().default(1920),
  maxScreenshotHeight: z.coerce.number().default(1080),

  // Storage
  storageType: z.enum(['local', 's3']).default('local'),
  storagePath: z.string().default('./screenshots'),

  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Feature flags schema
const featureFlagsSchema = z.object({
  pdfExport: z.coerce.boolean().default(true),
  fullPageCapture: z.coerce.boolean().default(true),
  customViewport: z.coerce.boolean().default(true),
  delayCapture: z.coerce.boolean().default(true),
  elementSelector: z.coerce.boolean().default(true),
  webhookCallback: z.coerce.boolean().default(false),
});

// Parse and validate configuration
const rawConfig = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  apiBaseUrl: process.env.API_BASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySecret: process.env.API_KEY_SECRET,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  screenshotTimeout: process.env.SCREENSHOT_TIMEOUT,
  maxScreenshotWidth: process.env.MAX_SCREENSHOT_WIDTH,
  maxScreenshotHeight: process.env.MAX_SCREENSHOT_HEIGHT,
  storageType: process.env.STORAGE_TYPE,
  storagePath: process.env.STORAGE_PATH,
  logLevel: process.env.LOG_LEVEL,
};

const rawFeatureFlags = {
  pdfExport: process.env.FEATURE_PDF_EXPORT,
  fullPageCapture: process.env.FEATURE_FULL_PAGE_CAPTURE,
  customViewport: process.env.FEATURE_CUSTOM_VIEWPORT,
  delayCapture: process.env.FEATURE_DELAY_CAPTURE,
  elementSelector: process.env.FEATURE_ELEMENT_SELECTOR,
  webhookCallback: process.env.FEATURE_WEBHOOK_CALLBACK,
};

export const config = configSchema.parse(rawConfig);
export const featureFlags = featureFlagsSchema.parse(rawFeatureFlags);

// Type exports
export type Config = z.infer<typeof configSchema>;
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
