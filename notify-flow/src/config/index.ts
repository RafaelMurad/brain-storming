import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3006),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySalt: z.string().default('notify-flow-salt'),

  // SMTP
  smtp: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(587),
    secure: z.coerce.boolean().default(false),
    user: z.string().optional(),
    pass: z.string().optional(),
    from: z.string().default('noreply@localhost'),
  }),

  // Rate limiting
  rateLimitWindowMs: z.coerce.number().default(3600000),
  rateLimitMaxRequests: z.coerce.number().default(1000),

  // Worker
  workerConcurrency: z.coerce.number().default(10),
  workerPollIntervalMs: z.coerce.number().default(5000),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySalt: process.env.API_KEY_SALT,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  workerConcurrency: process.env.WORKER_CONCURRENCY,
  workerPollIntervalMs: process.env.WORKER_POLL_INTERVAL_MS,
});

export type Config = z.infer<typeof configSchema>;
