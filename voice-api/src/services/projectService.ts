import { prisma } from '../lib/db';
import crypto from 'crypto';
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  openaiKey: z.string().optional(),
  assemblyaiKey: z.string().optional(),
  deepgramKey: z.string().optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  permissions: z.string().default('read,write'),
  rateLimit: z.number().int().min(1).max(1000).default(60),
  dailyMinutes: z.number().min(0).optional(),
  monthlyMinutes: z.number().min(0).optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

function generateApiKey(): string {
  return `va_${crypto.randomBytes(32).toString('hex')}`;
}

export async function createProject(data: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      openaiKey: data.openaiKey,
      assemblyaiKey: data.assemblyaiKey,
      deepgramKey: data.deepgramKey,
    },
  });

  const apiKey = await prisma.apiKey.create({
    data: {
      projectId: project.id,
      name: 'Default Key',
      key: generateApiKey(),
      permissions: 'read,write',
      rateLimit: 60,
    },
  });

  return {
    project: {
      id: project.id,
      name: project.name,
      hasOpenAI: !!data.openaiKey,
      hasAssemblyAI: !!data.assemblyaiKey,
      hasDeepgram: !!data.deepgramKey,
    },
    apiKey: {
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
    },
  };
}

export async function getProject(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      _count: {
        select: {
          transcriptions: true,
          vocabularies: true,
          configs: true,
        },
      },
    },
  });

  if (!project) return null;

  return {
    id: project.id,
    name: project.name,
    hasOpenAI: !!project.openaiKey,
    hasAssemblyAI: !!project.assemblyaiKey,
    hasDeepgram: !!project.deepgramKey,
    _count: project._count,
    createdAt: project.createdAt,
  };
}

export async function createApiKey(projectId: string, data: CreateApiKeyInput) {
  return prisma.apiKey.create({
    data: {
      projectId,
      name: data.name,
      key: generateApiKey(),
      permissions: data.permissions || 'read,write',
      rateLimit: data.rateLimit || 60,
      dailyMinutes: data.dailyMinutes,
      monthlyMinutes: data.monthlyMinutes,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
    select: {
      id: true,
      key: true,
      name: true,
      permissions: true,
      rateLimit: true,
      dailyMinutes: true,
      monthlyMinutes: true,
      expiresAt: true,
      createdAt: true,
    },
  });
}

export async function listApiKeys(projectId: string) {
  return prisma.apiKey.findMany({
    where: { projectId },
    select: {
      id: true,
      name: true,
      key: true,
      permissions: true,
      rateLimit: true,
      dailyMinutes: true,
      monthlyMinutes: true,
      isActive: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function revokeApiKey(keyId: string, projectId: string) {
  return prisma.apiKey.update({
    where: { id: keyId, projectId },
    data: { isActive: false },
  });
}
