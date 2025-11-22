import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3003),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  apiBaseUrl: z.string().default('http://localhost:3003'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySecret: z.string().default('dev-secret'),

  // Slack
  slackBotToken: z.string().optional(),
  slackSigningSecret: z.string().optional(),
  slackAppToken: z.string().optional(),

  // OpenAI
  openaiApiKey: z.string().optional(),

  // Rate limiting
  rateLimitWindowMs: z.coerce.number().default(60000),
  rateLimitMaxRequests: z.coerce.number().default(100),

  // Check-ins
  checkinEnabled: z.coerce.boolean().default(true),
  checkinTime: z.string().default('09:00'),
  checkinTimezone: z.string().default('America/New_York'),
  checkinDays: z.string().default('1,2,3,4,5'),

  // Burnout thresholds
  burnoutWarningThreshold: z.coerce.number().default(40),
  burnoutCriticalThreshold: z.coerce.number().default(25),

  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const featureFlagsSchema = z.object({
  dailyCheckins: z.coerce.boolean().default(true),
  sentimentAnalysis: z.coerce.boolean().default(true),
  burnoutPrediction: z.coerce.boolean().default(true),
  teamActivities: z.coerce.boolean().default(true),
  anonymousFeedback: z.coerce.boolean().default(true),
  managerAlerts: z.coerce.boolean().default(false),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  apiBaseUrl: process.env.API_BASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySecret: process.env.API_KEY_SECRET,
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET,
  slackAppToken: process.env.SLACK_APP_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  checkinEnabled: process.env.CHECKIN_ENABLED,
  checkinTime: process.env.CHECKIN_TIME,
  checkinTimezone: process.env.CHECKIN_TIMEZONE,
  checkinDays: process.env.CHECKIN_DAYS,
  burnoutWarningThreshold: process.env.BURNOUT_WARNING_THRESHOLD,
  burnoutCriticalThreshold: process.env.BURNOUT_CRITICAL_THRESHOLD,
  logLevel: process.env.LOG_LEVEL,
});

export const featureFlags = featureFlagsSchema.parse({
  dailyCheckins: process.env.FEATURE_DAILY_CHECKINS,
  sentimentAnalysis: process.env.FEATURE_SENTIMENT_ANALYSIS,
  burnoutPrediction: process.env.FEATURE_BURNOUT_PREDICTION,
  teamActivities: process.env.FEATURE_TEAM_ACTIVITIES,
  anonymousFeedback: process.env.FEATURE_ANONYMOUS_FEEDBACK,
  managerAlerts: process.env.FEATURE_MANAGER_ALERTS,
});
