import OpenAI from 'openai';
import { prisma } from '../lib/db';
import { logger } from '../lib/logger';
import { config, MODEL_PRICING } from '../config';
import { z } from 'zod';
import crypto from 'crypto';

export const chatCompletionSchema = z.object({
  model: z.string().default('gpt-4o-mini'),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })).min(1),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(1).max(128000).optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  stop: z.array(z.string()).optional(),
  stream: z.boolean().default(false),

  // AI Gateway specific options
  cache: z.boolean().default(true),
  cacheTtl: z.number().int().min(60).max(86400).optional(),
  fallbackModel: z.string().optional(),
  metadata: z.record(z.any()).default({}),
});

export const embeddingSchema = z.object({
  model: z.string().default('text-embedding-3-small'),
  input: z.union([z.string(), z.array(z.string())]),
  dimensions: z.number().int().optional(),

  cache: z.boolean().default(true),
  metadata: z.record(z.any()).default({}),
});

export type ChatCompletionInput = z.infer<typeof chatCompletionSchema>;
export type EmbeddingInput = z.infer<typeof embeddingSchema>;

function hashInput(input: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
}

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return 0;

  const inputCost = (promptTokens / 1000) * pricing.input;
  const outputCost = (completionTokens / 1000) * pricing.output;
  return Math.round((inputCost + outputCost) * 1000000) / 1000000; // 6 decimal places
}

function getOpenAIClient(apiKey?: string | null): OpenAI {
  const key = apiKey || config.openaiApiKey;
  if (!key) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey: key });
}

// Check cache
async function checkCache(projectId: string, cacheKey: string) {
  const entry = await prisma.cacheEntry.findUnique({
    where: { cacheKey },
  });

  if (!entry) return null;

  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    await prisma.cacheEntry.delete({ where: { id: entry.id } });
    return null;
  }

  // Update hit count
  await prisma.cacheEntry.update({
    where: { id: entry.id },
    data: {
      hitCount: { increment: 1 },
      lastHitAt: new Date(),
    },
  });

  return JSON.parse(entry.response);
}

// Save to cache
async function saveToCache(
  projectId: string,
  cacheKey: string,
  provider: string,
  model: string,
  inputHash: string,
  response: any,
  promptTokens: number,
  completionTokens: number,
  ttlSeconds?: number
) {
  const expiresAt = new Date(Date.now() + (ttlSeconds || config.cacheTtlSeconds) * 1000);

  await prisma.cacheEntry.upsert({
    where: { cacheKey },
    create: {
      projectId,
      cacheKey,
      provider,
      model,
      inputHash,
      response: JSON.stringify(response),
      promptTokens,
      completionTokens,
      expiresAt,
    },
    update: {
      response: JSON.stringify(response),
      promptTokens,
      completionTokens,
      expiresAt,
      updatedAt: new Date(),
    },
  });
}

// Log request
async function logRequest(
  projectId: string,
  apiKeyId: string | undefined,
  provider: string,
  model: string,
  inputHash: string,
  promptTokens: number,
  completionTokens: number,
  cost: number,
  latencyMs: number,
  cacheHit: boolean,
  status: string,
  errorMessage?: string
) {
  await prisma.request.create({
    data: {
      projectId,
      apiKeyId,
      provider,
      model,
      endpoint: 'chat',
      inputHash,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      cost,
      latencyMs,
      cacheHit,
      status,
      errorMessage,
    },
  });
}

export interface ChatCompletionResult {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finishReason: string;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  cached: boolean;
  latencyMs: number;
}

export async function chatCompletion(
  projectId: string,
  apiKeyId: string | undefined,
  openaiKey: string | null | undefined,
  input: ChatCompletionInput
): Promise<ChatCompletionResult> {
  const startTime = Date.now();
  const provider = 'openai';

  // Create cache key
  const cacheInput = {
    model: input.model,
    messages: input.messages,
    temperature: input.temperature,
    maxTokens: input.maxTokens,
  };
  const inputHash = hashInput(cacheInput);
  const cacheKey = `${projectId}:${provider}:${input.model}:${inputHash}`;

  // Check cache if enabled
  if (input.cache) {
    const cached = await checkCache(projectId, cacheKey);
    if (cached) {
      const latencyMs = Date.now() - startTime;
      await logRequest(
        projectId, apiKeyId, provider, input.model, inputHash,
        cached.usage.promptTokens, cached.usage.completionTokens, 0,
        latencyMs, true, 'success'
      );

      return {
        ...cached,
        cached: true,
        latencyMs,
        cost: 0, // No cost for cached responses
      };
    }
  }

  try {
    const openai = getOpenAIClient(openaiKey);

    const response = await openai.chat.completions.create({
      model: input.model,
      messages: input.messages,
      temperature: input.temperature,
      max_tokens: input.maxTokens,
      top_p: input.topP,
      frequency_penalty: input.frequencyPenalty,
      presence_penalty: input.presencePenalty,
      stop: input.stop,
    });

    const latencyMs = Date.now() - startTime;
    const promptTokens = response.usage?.prompt_tokens || 0;
    const completionTokens = response.usage?.completion_tokens || 0;
    const cost = calculateCost(input.model, promptTokens, completionTokens);

    const result: ChatCompletionResult = {
      id: response.id,
      model: response.model,
      choices: response.choices.map((c, i) => ({
        index: i,
        message: {
          role: c.message.role,
          content: c.message.content || '',
        },
        finishReason: c.finish_reason || 'stop',
      })),
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      cost,
      cached: false,
      latencyMs,
    };

    // Save to cache if enabled
    if (input.cache) {
      await saveToCache(
        projectId, cacheKey, provider, input.model, inputHash,
        { ...result, cached: true, latencyMs: 0 },
        promptTokens, completionTokens, input.cacheTtl
      );
    }

    // Log request
    await logRequest(
      projectId, apiKeyId, provider, input.model, inputHash,
      promptTokens, completionTokens, cost, latencyMs, false, 'success'
    );

    logger.info('Chat completion successful', {
      model: input.model,
      promptTokens,
      completionTokens,
      cost,
      latencyMs,
    });

    return result;
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await logRequest(
      projectId, apiKeyId, provider, input.model, inputHash,
      0, 0, 0, latencyMs, false, 'error', errorMessage
    );

    logger.error('Chat completion failed', { error: errorMessage, model: input.model });
    throw error;
  }
}

export interface EmbeddingResult {
  model: string;
  embeddings: number[][];
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
  cost: number;
  cached: boolean;
}

export async function createEmbedding(
  projectId: string,
  apiKeyId: string | undefined,
  openaiKey: string | null | undefined,
  input: EmbeddingInput
): Promise<EmbeddingResult> {
  const provider = 'openai';
  const inputs = Array.isArray(input.input) ? input.input : [input.input];

  const inputHash = hashInput({ model: input.model, input: inputs });
  const cacheKey = `${projectId}:${provider}:${input.model}:embedding:${inputHash}`;

  // Check cache
  if (input.cache) {
    const cached = await checkCache(projectId, cacheKey);
    if (cached) {
      return { ...cached, cached: true, cost: 0 };
    }
  }

  try {
    const openai = getOpenAIClient(openaiKey);

    const response = await openai.embeddings.create({
      model: input.model,
      input: inputs,
      dimensions: input.dimensions,
    });

    const promptTokens = response.usage?.prompt_tokens || 0;
    const cost = (promptTokens / 1000) * 0.00002; // Embedding pricing

    const result: EmbeddingResult = {
      model: response.model,
      embeddings: response.data.map(d => d.embedding),
      usage: {
        promptTokens,
        totalTokens: promptTokens,
      },
      cost,
      cached: false,
    };

    // Save to cache
    if (input.cache) {
      await saveToCache(
        projectId, cacheKey, provider, input.model, inputHash,
        { ...result, cached: true },
        promptTokens, 0
      );
    }

    return result;
  } catch (error) {
    logger.error('Embedding creation failed', { error });
    throw error;
  }
}
