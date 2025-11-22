import { prisma } from '../lib/db';
import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/i, 'Name must be alphanumeric with dashes/underscores'),
  description: z.string().max(500).optional(),
  subject: z.string().max(500).optional(),
  body: z.string().min(1),
  bodyText: z.string().optional(),
  variables: z.array(z.object({
    name: z.string(),
    type: z.string().default('string'),
    required: z.boolean().default(false),
    default: z.any().optional(),
  })).default([]),
  channelType: z.enum(['email', 'webhook', 'sms', 'push']).default('email'),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

export async function createTemplate(projectId: string, input: CreateTemplateInput) {
  return prisma.template.create({
    data: {
      projectId,
      name: input.name,
      description: input.description,
      subject: input.subject,
      body: input.body,
      bodyText: input.bodyText,
      variables: JSON.stringify(input.variables || []),
      channelType: input.channelType || 'email',
    },
  });
}

export async function updateTemplate(
  projectId: string,
  templateId: string,
  input: UpdateTemplateInput
) {
  const template = await prisma.template.findFirst({
    where: { id: templateId, projectId },
  });

  if (!template) return null;

  return prisma.template.update({
    where: { id: templateId },
    data: {
      name: input.name,
      description: input.description,
      subject: input.subject,
      body: input.body,
      bodyText: input.bodyText,
      variables: input.variables ? JSON.stringify(input.variables) : undefined,
      channelType: input.channelType,
      version: { increment: 1 },
    },
  });
}

export async function getTemplate(projectId: string, templateId: string) {
  const template = await prisma.template.findFirst({
    where: { id: templateId, projectId },
  });

  if (!template) return null;

  return {
    ...template,
    variables: JSON.parse(template.variables),
  };
}

export async function getTemplateByName(projectId: string, name: string) {
  const template = await prisma.template.findUnique({
    where: { projectId_name: { projectId, name } },
  });

  if (!template) return null;

  return {
    ...template,
    variables: JSON.parse(template.variables),
  };
}

export async function listTemplates(projectId: string) {
  const templates = await prisma.template.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });

  return templates.map(t => ({
    ...t,
    variables: JSON.parse(t.variables),
  }));
}

export async function deleteTemplate(projectId: string, templateId: string) {
  const template = await prisma.template.findFirst({
    where: { id: templateId, projectId },
  });

  if (!template) return false;

  await prisma.template.delete({ where: { id: templateId } });
  return true;
}

// Preview template with sample data
export async function previewTemplate(
  projectId: string,
  templateName: string,
  data: Record<string, any>
) {
  const Handlebars = await import('handlebars');
  const template = await getTemplateByName(projectId, templateName);

  if (!template) return null;

  const compiledSubject = template.subject
    ? Handlebars.compile(template.subject)(data)
    : null;
  const compiledBody = Handlebars.compile(template.body)(data);
  const compiledBodyText = template.bodyText
    ? Handlebars.compile(template.bodyText)(data)
    : null;

  return {
    name: template.name,
    subject: compiledSubject,
    body: compiledBody,
    bodyText: compiledBodyText,
  };
}
