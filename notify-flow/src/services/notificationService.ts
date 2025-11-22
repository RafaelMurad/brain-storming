import { prisma } from '../lib/db';
import { logger } from '../lib/logger';
import { z } from 'zod';
import Handlebars from 'handlebars';

export const sendNotificationSchema = z.object({
  recipient: z.string().min(1),
  recipientType: z.enum(['email', 'webhook', 'sms', 'push']).default('email'),
  templateName: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  data: z.record(z.any()).default({}),
  metadata: z.record(z.any()).default({}),
  tags: z.array(z.string()).default([]),
  scheduledFor: z.string().datetime().optional(),
  priority: z.number().int().min(1).max(10).default(5),
  channelName: z.string().optional(),
});

export const sendBatchSchema = z.object({
  notifications: z.array(sendNotificationSchema).min(1).max(1000),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;

function compileTemplate(template: string, data: Record<string, any>): string {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

export async function sendNotification(
  projectId: string,
  input: SendNotificationInput
): Promise<{ id: string; status: string }> {
  // Resolve template if provided
  let subject = input.subject;
  let body = input.body;

  if (input.templateName) {
    const template = await prisma.template.findUnique({
      where: {
        projectId_name: {
          projectId,
          name: input.templateName,
        },
      },
    });

    if (!template) {
      throw new Error(`Template '${input.templateName}' not found`);
    }

    if (!template.isActive) {
      throw new Error(`Template '${input.templateName}' is inactive`);
    }

    subject = template.subject ? compileTemplate(template.subject, input.data) : subject;
    body = compileTemplate(template.body, input.data);
  }

  if (!body) {
    throw new Error('Body is required (either directly or via template)');
  }

  // Resolve channel
  let channelId: string | null = null;
  if (input.channelName) {
    const channel = await prisma.channel.findUnique({
      where: {
        projectId_name: {
          projectId,
          name: input.channelName,
        },
      },
    });
    if (channel && channel.isActive) {
      channelId = channel.id;
    }
  }

  // Create notification
  const notification = await prisma.notification.create({
    data: {
      projectId,
      channelId,
      recipient: input.recipient,
      recipientType: input.recipientType,
      subject,
      body,
      data: JSON.stringify(input.data),
      metadata: JSON.stringify(input.metadata),
      tags: JSON.stringify(input.tags),
      scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
      priority: input.priority,
      status: input.scheduledFor ? 'pending' : 'queued',
    },
  });

  // Create queued event
  await prisma.notificationEvent.create({
    data: {
      notificationId: notification.id,
      type: 'queued',
      data: JSON.stringify({ queuedAt: new Date().toISOString() }),
    },
  });

  logger.info('Notification created', {
    id: notification.id,
    recipient: input.recipient,
    status: notification.status,
  });

  return { id: notification.id, status: notification.status };
}

export async function sendBatchNotifications(
  projectId: string,
  inputs: SendNotificationInput[]
): Promise<{ count: number; notifications: { id: string; status: string }[] }> {
  const results: { id: string; status: string }[] = [];

  for (const input of inputs) {
    try {
      const result = await sendNotification(projectId, input);
      results.push(result);
    } catch (error) {
      logger.error('Batch notification failed', {
        recipient: input.recipient,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      results.push({ id: '', status: 'failed' });
    }
  }

  return { count: results.filter(r => r.status !== 'failed').length, notifications: results };
}

export async function getNotification(notificationId: string, projectId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, projectId },
    include: {
      events: {
        orderBy: { timestamp: 'desc' },
        take: 10,
      },
      channel: {
        select: { name: true, type: true },
      },
      template: {
        select: { name: true },
      },
    },
  });

  if (!notification) return null;

  return {
    ...notification,
    data: JSON.parse(notification.data),
    metadata: JSON.parse(notification.metadata),
    tags: JSON.parse(notification.tags),
    events: notification.events.map(e => ({
      ...e,
      data: JSON.parse(e.data),
    })),
  };
}

export interface NotificationQuery {
  projectId: string;
  status?: string;
  recipient?: string;
  recipientType?: string;
  tag?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export async function queryNotifications(query: NotificationQuery) {
  const where: any = { projectId: query.projectId };

  if (query.status) where.status = query.status;
  if (query.recipient) where.recipient = { contains: query.recipient };
  if (query.recipientType) where.recipientType = query.recipientType;
  if (query.tag) where.tags = { contains: query.tag };

  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) where.createdAt.gte = query.startDate;
    if (query.endDate) where.createdAt.lte = query.endDate;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
      skip: query.offset || 0,
      select: {
        id: true,
        recipient: true,
        recipientType: true,
        subject: true,
        status: true,
        priority: true,
        sentAt: true,
        deliveredAt: true,
        openedAt: true,
        failedAt: true,
        errorMessage: true,
        createdAt: true,
      },
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    notifications,
    total,
    limit: query.limit || 50,
    offset: query.offset || 0,
  };
}

export async function getNotificationStats(projectId: string, days: number = 7) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [statusCounts, dailyCounts, deliveryRate] = await Promise.all([
    prisma.notification.groupBy({
      by: ['status'],
      where: { projectId, createdAt: { gte: startDate } },
      _count: { id: true },
    }),
    prisma.notification.groupBy({
      by: ['recipientType'],
      where: { projectId, createdAt: { gte: startDate } },
      _count: { id: true },
    }),
    prisma.notification.aggregate({
      where: { projectId, createdAt: { gte: startDate }, status: { in: ['sent', 'delivered'] } },
      _count: { id: true },
    }),
  ]);

  const totalSent = statusCounts.find(s => s.status === 'sent')?._count.id || 0;
  const totalDelivered = statusCounts.find(s => s.status === 'delivered')?._count.id || 0;
  const totalFailed = statusCounts.find(s => s.status === 'failed')?._count.id || 0;

  return {
    byStatus: statusCounts.map(s => ({ status: s.status, count: s._count.id })),
    byChannel: dailyCounts.map(d => ({ type: d.recipientType, count: d._count.id })),
    deliveryRate: totalSent > 0
      ? Math.round(((totalDelivered) / (totalSent + totalDelivered)) * 10000) / 100
      : 0,
    failureRate: (totalSent + totalDelivered + totalFailed) > 0
      ? Math.round((totalFailed / (totalSent + totalDelivered + totalFailed)) * 10000) / 100
      : 0,
    period: { days, start: startDate.toISOString(), end: new Date().toISOString() },
  };
}
