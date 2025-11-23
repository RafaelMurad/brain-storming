import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3005),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySalt: z.string().default('analytics-hub-salt'),
  rateLimitWindowMs: z.coerce.number().default(3600000),
  rateLimitMaxRequests: z.coerce.number().default(1000),
  batchSize: z.coerce.number().default(1000),
  aggregationIntervalMs: z.coerce.number().default(60000),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySalt: process.env.API_KEY_SALT,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  batchSize: process.env.BATCH_SIZE,
  aggregationIntervalMs: process.env.AGGREGATION_INTERVAL_MS,
});

export type Config = z.infer<typeof configSchema>;
