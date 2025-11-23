import { prisma } from '../lib/db';
import crypto from 'crypto';
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  settings: z.record(z.any()).default({}),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  permissions: z.string().default('read,write'),
  rateLimit: z.number().int().min(10).max(100000).default(1000),
  expiresAt: z.string().datetime().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

function generateApiKey(): string {
  return `nf_${crypto.randomBytes(32).toString('hex')}`;
}

export async function createProject(data: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      settings: JSON.stringify(data.settings || {}),
    },
  });

  // Auto-create a default API key
  const apiKey = await prisma.apiKey.create({
    data: {
      projectId: project.id,
      name: 'Default Key',
      key: generateApiKey(),
      permissions: 'read,write',
      rateLimit: 1000,
    },
  });

  // Create default email channel
  await prisma.channel.create({
    data: {
      projectId: project.id,
      name: 'default-email',
      type: 'email',
      isDefault: true,
      config: JSON.stringify({}),
    },
  });

  return {
    project,
    apiKey: {
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
    },
  };
}

export async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      _count: {
        select: {
          notifications: true,
          templates: true,
          channels: true,
          subscribers: true,
        },
      },
    },
  });
}

export async function createApiKey(projectId: string, data: CreateApiKeyInput) {
  return prisma.apiKey.create({
    data: {
      projectId,
      name: data.name,
      key: generateApiKey(),
      permissions: data.permissions || 'read,write',
      rateLimit: data.rateLimit || 1000,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
    select: {
      id: true,
      key: true,
      name: true,
      permissions: true,
      rateLimit: true,
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
