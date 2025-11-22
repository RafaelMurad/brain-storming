import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3004),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  apiBaseUrl: z.string().default('http://localhost:3004'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySecret: z.string().default('dev-secret'),
  rateLimitWindowMs: z.coerce.number().default(60000),
  rateLimitMaxRequests: z.coerce.number().default(200),
  defaultConfettiDuration: z.coerce.number().default(3000),
  defaultConfettiParticles: z.coerce.number().default(150),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const featureFlagsSchema = z.object({
  confetti: z.coerce.boolean().default(true),
  achievements: z.coerce.boolean().default(true),
  leaderboard: z.coerce.boolean().default(true),
  soundEffects: z.coerce.boolean().default(true),
  customThemes: z.coerce.boolean().default(true),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  apiBaseUrl: process.env.API_BASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySecret: process.env.API_KEY_SECRET,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  defaultConfettiDuration: process.env.DEFAULT_CONFETTI_DURATION,
  defaultConfettiParticles: process.env.DEFAULT_CONFETTI_PARTICLES,
  logLevel: process.env.LOG_LEVEL,
});

export const featureFlags = featureFlagsSchema.parse({
  confetti: process.env.FEATURE_CONFETTI,
  achievements: process.env.FEATURE_ACHIEVEMENTS,
  leaderboard: process.env.FEATURE_LEADERBOARD,
  soundEffects: process.env.FEATURE_SOUND_EFFECTS,
  customThemes: process.env.FEATURE_CUSTOM_THEMES,
});
