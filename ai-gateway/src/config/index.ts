import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3007),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySalt: z.string().default('ai-gateway-salt'),

  // AI Provider Keys
  openaiApiKey: z.string().optional(),
  anthropicApiKey: z.string().optional(),

  // Cache
  cacheTtlSeconds: z.coerce.number().default(3600),
  cacheMaxSizeMb: z.coerce.number().default(100),

  // Rate limiting
  rateLimitWindowMs: z.coerce.number().default(60000),
  rateLimitMaxRequests: z.coerce.number().default(100),

  // Budget defaults
  defaultDailyBudget: z.coerce.number().default(10),
  defaultMonthlyBudget: z.coerce.number().default(100),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySalt: process.env.API_KEY_SALT,
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  cacheTtlSeconds: process.env.CACHE_TTL_SECONDS,
  cacheMaxSizeMb: process.env.CACHE_MAX_SIZE_MB,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  defaultDailyBudget: process.env.DEFAULT_DAILY_BUDGET,
  defaultMonthlyBudget: process.env.DEFAULT_MONTHLY_BUDGET,
});

export type Config = z.infer<typeof configSchema>;

// Model pricing (USD per 1K tokens)
export const MODEL_PRICING: Record<string, { input: number; output: number; contextWindow: number }> = {
  // OpenAI
  'gpt-4-turbo': { input: 0.01, output: 0.03, contextWindow: 128000 },
  'gpt-4': { input: 0.03, output: 0.06, contextWindow: 8192 },
  'gpt-4o': { input: 0.005, output: 0.015, contextWindow: 128000 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006, contextWindow: 128000 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015, contextWindow: 16385 },

  // Anthropic
  'claude-3-opus': { input: 0.015, output: 0.075, contextWindow: 200000 },
  'claude-3-sonnet': { input: 0.003, output: 0.015, contextWindow: 200000 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125, contextWindow: 200000 },
  'claude-3.5-sonnet': { input: 0.003, output: 0.015, contextWindow: 200000 },
};
