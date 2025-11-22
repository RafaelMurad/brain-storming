import OpenAI from 'openai';
import { prisma } from '../lib/db';
import { logger } from '../lib/logger';
import { config, PROVIDER_PRICING } from '../config';
import { z } from 'zod';
import fs from 'fs';

export const transcribeOptionsSchema = z.object({
  language: z.string().default('auto'),
  provider: z.enum(['openai', 'assemblyai', 'deepgram']).default('openai'),
  model: z.string().default('whisper-1'),

  // Processing options
  temperature: z.number().min(0).max(1).default(0),
  prompt: z.string().max(1000).optional(), // Context prompt
  timestamps: z.enum(['none', 'segment', 'word']).default('segment'),
  diarization: z.boolean().default(false), // Speaker identification
  punctuation: z.boolean().default(true),
  profanityFilter: z.boolean().default(false),
  responseFormat: z.enum(['json', 'text', 'srt', 'vtt']).default('json'),

  // Vocabulary
  vocabulary: z.array(z.string()).optional(), // Custom words/phrases
  vocabularyBoost: z.number().min(0).max(10).default(1),

  // Callback
  webhookUrl: z.string().url().optional(),

  // Custom metadata
  metadata: z.record(z.any()).default({}),

  // Use config preset
  configName: z.string().optional(),
});

export type TranscribeOptions = z.infer<typeof transcribeOptionsSchema>;

interface TranscriptionResult {
  id: string;
  text: string;
  segments?: {
    start: number;
    end: number;
    text: string;
    confidence?: number;
    speaker?: string;
  }[];
  words?: {
    start: number;
    end: number;
    word: string;
    confidence?: number;
  }[];
  duration: number;
  language: string;
  confidence?: number;
  processingTime: number;
}

function getOpenAIClient(apiKey?: string | null): OpenAI {
  const key = apiKey || config.openaiApiKey;
  if (!key) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey: key });
}

function calculateCost(provider: string, model: string, durationSeconds: number): number {
  const key = `${provider}:${model}`;
  const pricing = PROVIDER_PRICING[key] || PROVIDER_PRICING[`${provider}:default`];
  if (!pricing) return 0;

  const minutes = durationSeconds / 60;
  return Math.round(minutes * pricing.perMinute * 1000000) / 1000000;
}

// OpenAI Whisper transcription
async function transcribeWithOpenAI(
  filePath: string,
  options: TranscribeOptions,
  openaiKey?: string | null
): Promise<TranscriptionResult> {
  const startTime = Date.now();
  const openai = getOpenAIClient(openaiKey);

  const file = fs.createReadStream(filePath);

  const response = await openai.audio.transcriptions.create({
    file,
    model: options.model,
    language: options.language === 'auto' ? undefined : options.language,
    prompt: options.prompt,
    response_format: options.timestamps === 'word' ? 'verbose_json' :
                     options.timestamps === 'segment' ? 'verbose_json' :
                     options.responseFormat === 'srt' ? 'srt' :
                     options.responseFormat === 'vtt' ? 'vtt' : 'json',
    temperature: options.temperature,
  });

  const processingTime = Date.now() - startTime;

  // Handle different response formats
  if (typeof response === 'string') {
    return {
      id: `whisper_${Date.now()}`,
      text: response,
      duration: 0,
      language: options.language,
      processingTime,
    };
  }

  const result: TranscriptionResult = {
    id: `whisper_${Date.now()}`,
    text: response.text,
    duration: response.duration || 0,
    language: response.language || options.language,
    processingTime,
  };

  // Add segments if available
  if ('segments' in response && response.segments) {
    result.segments = response.segments.map((s: any) => ({
      start: s.start,
      end: s.end,
      text: s.text,
      confidence: s.avg_logprob ? Math.exp(s.avg_logprob) : undefined,
    }));
  }

  // Add word-level timestamps if requested
  if (options.timestamps === 'word' && 'words' in response && response.words) {
    result.words = response.words.map((w: any) => ({
      start: w.start,
      end: w.end,
      word: w.word,
    }));
  }

  return result;
}

// Create transcription job
export async function createTranscription(
  projectId: string,
  apiKeyId: string | undefined,
  filePath: string,
  fileName: string,
  fileSize: number,
  mimeType: string,
  options: TranscribeOptions,
  openaiKey?: string | null
): Promise<{ id: string; status: string }> {
  // Load config preset if specified
  let finalOptions = { ...options };
  if (options.configName) {
    const configPreset = await prisma.transcriptionConfig.findUnique({
      where: {
        projectId_name: {
          projectId,
          name: options.configName,
        },
      },
    });

    if (configPreset) {
      const presetOptions = JSON.parse(configPreset.options);
      finalOptions = {
        ...presetOptions,
        ...options,
        provider: options.provider || configPreset.provider,
        model: options.model || configPreset.model,
        language: options.language || configPreset.language,
      };
    }
  }

  // Create transcription record
  const transcription = await prisma.transcription.create({
    data: {
      projectId,
      apiKeyId,
      fileName,
      fileSize,
      mimeType,
      sourceType: 'upload',
      language: finalOptions.language,
      provider: finalOptions.provider,
      model: finalOptions.model,
      options: JSON.stringify(finalOptions),
      webhookUrl: finalOptions.webhookUrl,
      metadata: JSON.stringify(finalOptions.metadata),
      status: 'processing',
    },
  });

  // Process transcription (in production, this would be queued)
  processTranscription(transcription.id, filePath, finalOptions, openaiKey).catch(err => {
    logger.error('Transcription failed', { transcriptionId: transcription.id, error: err.message });
  });

  return { id: transcription.id, status: 'processing' };
}

// Process transcription
async function processTranscription(
  transcriptionId: string,
  filePath: string,
  options: TranscribeOptions,
  openaiKey?: string | null
): Promise<void> {
  try {
    let result: TranscriptionResult;

    switch (options.provider) {
      case 'openai':
        result = await transcribeWithOpenAI(filePath, options, openaiKey);
        break;
      case 'assemblyai':
        // AssemblyAI integration placeholder
        throw new Error('AssemblyAI provider not yet implemented');
      case 'deepgram':
        // Deepgram integration placeholder
        throw new Error('Deepgram provider not yet implemented');
      default:
        throw new Error(`Unknown provider: ${options.provider}`);
    }

    // Update transcription with result
    await prisma.transcription.update({
      where: { id: transcriptionId },
      data: {
        text: result.text,
        segments: result.segments ? JSON.stringify(result.segments) : null,
        words: result.words ? JSON.stringify(result.words) : null,
        duration: result.duration,
        confidence: result.confidence,
        processingTime: result.processingTime,
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Send webhook if configured
    const transcription = await prisma.transcription.findUnique({
      where: { id: transcriptionId },
    });

    if (transcription?.webhookUrl) {
      sendWebhook(transcription.webhookUrl, {
        event: 'transcription.completed',
        transcriptionId,
        text: result.text,
        duration: result.duration,
      }).catch(() => {});
    }

    logger.info('Transcription completed', {
      transcriptionId,
      duration: result.duration,
      processingTime: result.processingTime,
    });

    // Cleanup file
    fs.unlink(filePath, () => {});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await prisma.transcription.update({
      where: { id: transcriptionId },
      data: {
        status: 'failed',
        errorMessage,
      },
    });

    // Cleanup file on error too
    fs.unlink(filePath, () => {});

    throw error;
  }
}

async function sendWebhook(url: string, payload: any): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VoiceAPI/1.0',
      },
      body: JSON.stringify(payload),
    });

    await prisma.transcription.update({
      where: { id: payload.transcriptionId },
      data: { webhookSent: true },
    });
  } catch (error) {
    logger.error('Webhook delivery failed', { url, error });
  }
}

// Get transcription by ID
export async function getTranscription(transcriptionId: string, projectId: string) {
  const transcription = await prisma.transcription.findFirst({
    where: { id: transcriptionId, projectId },
  });

  if (!transcription) return null;

  return {
    id: transcription.id,
    status: transcription.status,
    text: transcription.text,
    segments: transcription.segments ? JSON.parse(transcription.segments) : null,
    words: transcription.words ? JSON.parse(transcription.words) : null,
    duration: transcription.duration,
    language: transcription.language,
    confidence: transcription.confidence,
    provider: transcription.provider,
    model: transcription.model,
    processingTime: transcription.processingTime,
    errorMessage: transcription.errorMessage,
    metadata: JSON.parse(transcription.metadata),
    createdAt: transcription.createdAt,
    completedAt: transcription.completedAt,
  };
}

// List transcriptions
export async function listTranscriptions(
  projectId: string,
  options: {
    status?: string;
    language?: string;
    limit?: number;
    offset?: number;
  }
) {
  const where: any = { projectId };
  if (options.status) where.status = options.status;
  if (options.language) where.language = options.language;

  const [transcriptions, total] = await Promise.all([
    prisma.transcription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0,
      select: {
        id: true,
        fileName: true,
        status: true,
        duration: true,
        language: true,
        provider: true,
        processingTime: true,
        createdAt: true,
        completedAt: true,
      },
    }),
    prisma.transcription.count({ where }),
  ]);

  return { transcriptions, total, limit: options.limit || 50, offset: options.offset || 0 };
}
