import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3002),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  apiBaseUrl: z.string().default('http://localhost:3002'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySecret: z.string().default('dev-secret'),

  // Reddit API
  redditClientId: z.string().optional(),
  redditClientSecret: z.string().optional(),
  redditUsername: z.string().optional(),
  redditPassword: z.string().optional(),
  redditUserAgent: z.string().default('PulseWatch/1.0.0'),

  // OpenAI
  openaiApiKey: z.string().optional(),

  // Rate limiting
  rateLimitWindowMs: z.coerce.number().default(60000),
  rateLimitMaxRequests: z.coerce.number().default(100),

  // Monitoring
  scanIntervalMinutes: z.coerce.number().default(15),
  maxPostsPerScan: z.coerce.number().default(100),
  sentimentBatchSize: z.coerce.number().default(10),

  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const featureFlagsSchema = z.object({
  redditMonitoring: z.coerce.boolean().default(true),
  twitterMonitoring: z.coerce.boolean().default(false),
  aiScoring: z.coerce.boolean().default(true),
  emailAlerts: z.coerce.boolean().default(false),
  webhookAlerts: z.coerce.boolean().default(true),
  slackIntegration: z.coerce.boolean().default(false),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  apiBaseUrl: process.env.API_BASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySecret: process.env.API_KEY_SECRET,
  redditClientId: process.env.REDDIT_CLIENT_ID,
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET,
  redditUsername: process.env.REDDIT_USERNAME,
  redditPassword: process.env.REDDIT_PASSWORD,
  redditUserAgent: process.env.REDDIT_USER_AGENT,
  openaiApiKey: process.env.OPENAI_API_KEY,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  scanIntervalMinutes: process.env.SCAN_INTERVAL_MINUTES,
  maxPostsPerScan: process.env.MAX_POSTS_PER_SCAN,
  sentimentBatchSize: process.env.SENTIMENT_BATCH_SIZE,
  logLevel: process.env.LOG_LEVEL,
});

export const featureFlags = featureFlagsSchema.parse({
  redditMonitoring: process.env.FEATURE_REDDIT_MONITORING,
  twitterMonitoring: process.env.FEATURE_TWITTER_MONITORING,
  aiScoring: process.env.FEATURE_AI_SCORING,
  emailAlerts: process.env.FEATURE_EMAIL_ALERTS,
  webhookAlerts: process.env.FEATURE_WEBHOOK_ALERTS,
  slackIntegration: process.env.FEATURE_SLACK_INTEGRATION,
});

export type Config = z.infer<typeof configSchema>;
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
