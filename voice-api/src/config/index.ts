import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3008),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  databaseUrl: z.string().default('file:./dev.db'),
  apiKeySalt: z.string().default('voice-api-salt'),

  // Provider Keys
  openaiApiKey: z.string().optional(),
  assemblyaiApiKey: z.string().optional(),
  deepgramApiKey: z.string().optional(),

  // File upload
  maxFileSizeMb: z.coerce.number().default(100),
  uploadDir: z.string().default('./uploads'),
  allowedAudioTypes: z.string().default('audio/mp3,audio/mpeg,audio/wav,audio/webm,audio/ogg,audio/m4a,audio/flac'),

  // Rate limiting
  rateLimitWindowMs: z.coerce.number().default(60000),
  rateLimitMaxRequests: z.coerce.number().default(60),

  // Processing defaults
  defaultLanguage: z.string().default('en'),
  defaultProvider: z.string().default('openai'),
  defaultModel: z.string().default('whisper-1'),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  apiKeySalt: process.env.API_KEY_SALT,
  openaiApiKey: process.env.OPENAI_API_KEY,
  assemblyaiApiKey: process.env.ASSEMBLYAI_API_KEY,
  deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  maxFileSizeMb: process.env.MAX_FILE_SIZE_MB,
  uploadDir: process.env.UPLOAD_DIR,
  allowedAudioTypes: process.env.ALLOWED_AUDIO_TYPES,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
  defaultLanguage: process.env.DEFAULT_LANGUAGE,
  defaultProvider: process.env.DEFAULT_PROVIDER,
  defaultModel: process.env.DEFAULT_MODEL,
});

export type Config = z.infer<typeof configSchema>;

// Supported languages
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  'auto': 'Auto-detect',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'pl': 'Polish',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'id': 'Indonesian',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
};

// Provider pricing (per minute of audio)
export const PROVIDER_PRICING: Record<string, { perMinute: number }> = {
  'openai:whisper-1': { perMinute: 0.006 },
  'assemblyai:default': { perMinute: 0.00025 },
  'deepgram:nova-2': { perMinute: 0.0043 },
};
