import { prisma } from '../lib/db';
import { logger } from '../lib/logger';
import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.string().max(100).default('general'),
  userId: z.string().max(255).optional(),
  sessionId: z.string().max(255).optional(),
  anonymousId: z.string().max(255).optional(),
  properties: z.record(z.any()).default({}),
  value: z.number().optional(),
  source: z.string().max(50).optional(),
  referrer: z.string().max(2048).optional(),
  timestamp: z.string().datetime().optional(),
});

export const batchEventSchema = z.object({
  events: z.array(eventSchema).min(1).max(1000),
});

export type EventInput = z.infer<typeof eventSchema>;
export type BatchEventInput = z.infer<typeof batchEventSchema>;

interface EventContext {
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

function parseUserAgent(userAgent?: string): Partial<EventContext> {
  if (!userAgent) return {};

  const result: Partial<EventContext> = {};

  // Simple device detection
  if (/mobile/i.test(userAgent)) {
    result.device = 'mobile';
  } else if (/tablet/i.test(userAgent)) {
    result.device = 'tablet';
  } else {
    result.device = 'desktop';
  }

  // Simple browser detection
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
    result.browser = 'Chrome';
  } else if (/firefox/i.test(userAgent)) {
    result.browser = 'Firefox';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    result.browser = 'Safari';
  } else if (/edge/i.test(userAgent)) {
    result.browser = 'Edge';
  }

  // Simple OS detection
  if (/windows/i.test(userAgent)) {
    result.os = 'Windows';
  } else if (/mac/i.test(userAgent)) {
    result.os = 'MacOS';
  } else if (/linux/i.test(userAgent)) {
    result.os = 'Linux';
  } else if (/android/i.test(userAgent)) {
    result.os = 'Android';
  } else if (/ios|iphone|ipad/i.test(userAgent)) {
    result.os = 'iOS';
  }

  return result;
}

export async function trackEvent(
  projectId: string,
  apiKeyId: string | undefined,
  event: EventInput,
  context: EventContext
): Promise<{ id: string }> {
  const parsedContext = parseUserAgent(context.userAgent);

  const created = await prisma.event.create({
    data: {
      projectId,
      apiKeyId,
      name: event.name,
      category: event.category || 'general',
      userId: event.userId,
      sessionId: event.sessionId,
      anonymousId: event.anonymousId,
      properties: JSON.stringify(event.properties || {}),
      value: event.value,
      source: event.source,
      referrer: event.referrer,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
      country: context.country,
      city: context.city,
      device: parsedContext.device || context.device,
      browser: parsedContext.browser || context.browser,
      os: parsedContext.os || context.os,
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
      receivedAt: new Date(),
    },
    select: { id: true },
  });

  logger.debug('Event tracked', { eventId: created.id, name: event.name, projectId });

  return created;
}

export async function trackBatchEvents(
  projectId: string,
  apiKeyId: string | undefined,
  events: EventInput[],
  context: EventContext
): Promise<{ count: number; ids: string[] }> {
  const parsedContext = parseUserAgent(context.userAgent);
  const now = new Date();

  const data = events.map(event => ({
    projectId,
    apiKeyId,
    name: event.name,
    category: event.category || 'general',
    userId: event.userId,
    sessionId: event.sessionId,
    anonymousId: event.anonymousId,
    properties: JSON.stringify(event.properties || {}),
    value: event.value,
    source: event.source,
    referrer: event.referrer,
    userAgent: context.userAgent,
    ipAddress: context.ipAddress,
    country: context.country,
    city: context.city,
    device: parsedContext.device || context.device,
    browser: parsedContext.browser || context.browser,
    os: parsedContext.os || context.os,
    timestamp: event.timestamp ? new Date(event.timestamp) : now,
    receivedAt: now,
  }));

  const result = await prisma.event.createMany({ data });

  logger.info('Batch events tracked', { count: result.count, projectId });

  return { count: result.count, ids: [] }; // SQLite doesn't return IDs on createMany
}

export interface EventQuery {
  projectId: string;
  name?: string;
  category?: string;
  userId?: string;
  sessionId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export async function queryEvents(query: EventQuery) {
  const where: any = { projectId: query.projectId };

  if (query.name) where.name = query.name;
  if (query.category) where.category = query.category;
  if (query.userId) where.userId = query.userId;
  if (query.sessionId) where.sessionId = query.sessionId;

  if (query.startDate || query.endDate) {
    where.timestamp = {};
    if (query.startDate) where.timestamp.gte = query.startDate;
    if (query.endDate) where.timestamp.lte = query.endDate;
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: query.limit || 100,
      skip: query.offset || 0,
      select: {
        id: true,
        name: true,
        category: true,
        userId: true,
        sessionId: true,
        properties: true,
        value: true,
        source: true,
        device: true,
        browser: true,
        os: true,
        country: true,
        timestamp: true,
      },
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events: events.map(e => ({
      ...e,
      properties: JSON.parse(e.properties),
    })),
    total,
    limit: query.limit || 100,
    offset: query.offset || 0,
  };
}
