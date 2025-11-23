import { prisma } from '../lib/db';
import { z } from 'zod';

export const createConfigSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/i),
  description: z.string().max(500).optional(),
  provider: z.enum(['openai', 'assemblyai', 'deepgram']).default('openai'),
  model: z.string().default('whisper-1'),
  language: z.string().default('auto'),
  options: z.object({
    temperature: z.number().min(0).max(1).optional(),
    prompt: z.string().max(1000).optional(),
    timestamps: z.enum(['none', 'segment', 'word']).optional(),
    diarization: z.boolean().optional(),
    punctuation: z.boolean().optional(),
    profanityFilter: z.boolean().optional(),
    responseFormat: z.enum(['json', 'text', 'srt', 'vtt']).optional(),
    vocabulary: z.array(z.string()).optional(),
  }).default({}),
  isDefault: z.boolean().default(false),
});

export const updateConfigSchema = createConfigSchema.partial();

export type CreateConfigInput = z.infer<typeof createConfigSchema>;
export type UpdateConfigInput = z.infer<typeof updateConfigSchema>;

export async function createConfig(projectId: string, input: CreateConfigInput) {
  // If setting as default, unset other defaults
  if (input.isDefault) {
    await prisma.transcriptionConfig.updateMany({
      where: { projectId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.transcriptionConfig.create({
    data: {
      projectId,
      name: input.name,
      description: input.description,
      provider: input.provider,
      model: input.model,
      language: input.language,
      options: JSON.stringify(input.options),
      isDefault: input.isDefault,
    },
  });
}

export async function updateConfig(
  projectId: string,
  configId: string,
  input: UpdateConfigInput
) {
  const config = await prisma.transcriptionConfig.findFirst({
    where: { id: configId, projectId },
  });

  if (!config) return null;

  if (input.isDefault) {
    await prisma.transcriptionConfig.updateMany({
      where: { projectId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.transcriptionConfig.update({
    where: { id: configId },
    data: {
      name: input.name,
      description: input.description,
      provider: input.provider,
      model: input.model,
      language: input.language,
      options: input.options ? JSON.stringify(input.options) : undefined,
      isDefault: input.isDefault,
    },
  });
}

export async function getConfig(projectId: string, configId: string) {
  const config = await prisma.transcriptionConfig.findFirst({
    where: { id: configId, projectId },
  });

  if (!config) return null;

  return {
    ...config,
    options: JSON.parse(config.options),
  };
}

export async function getConfigByName(projectId: string, name: string) {
  const config = await prisma.transcriptionConfig.findUnique({
    where: { projectId_name: { projectId, name } },
  });

  if (!config) return null;

  return {
    ...config,
    options: JSON.parse(config.options),
  };
}

export async function listConfigs(projectId: string) {
  const configs = await prisma.transcriptionConfig.findMany({
    where: { projectId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  return configs.map(c => ({
    ...c,
    options: JSON.parse(c.options),
  }));
}

export async function deleteConfig(projectId: string, configId: string) {
  const config = await prisma.transcriptionConfig.findFirst({
    where: { id: configId, projectId },
  });

  if (!config) return false;

  await prisma.transcriptionConfig.delete({ where: { id: configId } });
  return true;
}
