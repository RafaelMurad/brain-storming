import { prisma } from '../lib/db';
import { logger } from '../lib/logger';

export interface MetricQuery {
  projectId: string;
  metric: string;
  startDate: Date;
  endDate: Date;
  groupBy?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  filters?: Record<string, string>;
}

export interface MetricResult {
  metric: string;
  value: number;
  breakdown?: { label: string; value: number }[];
  timeseries?: { timestamp: string; value: number }[];
}

// Get real-time event count
export async function getEventCount(
  projectId: string,
  startDate: Date,
  endDate: Date,
  eventName?: string
): Promise<number> {
  const where: any = {
    projectId,
    timestamp: { gte: startDate, lte: endDate },
  };
  if (eventName) where.name = eventName;

  return prisma.event.count({ where });
}

// Get unique users count
export async function getUniqueUsers(
  projectId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const result = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: { gte: startDate, lte: endDate },
      userId: { not: null },
    },
    distinct: ['userId'],
    select: { userId: true },
  });

  return result.length;
}

// Get unique sessions count
export async function getUniqueSessions(
  projectId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const result = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: { gte: startDate, lte: endDate },
      sessionId: { not: null },
    },
    distinct: ['sessionId'],
    select: { sessionId: true },
  });

  return result.length;
}

// Get top events
export async function getTopEvents(
  projectId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<{ name: string; count: number }[]> {
  const events = await prisma.event.groupBy({
    by: ['name'],
    where: {
      projectId,
      timestamp: { gte: startDate, lte: endDate },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit,
  });

  return events.map(e => ({
    name: e.name,
    count: e._count.id,
  }));
}

// Get events breakdown by dimension
export async function getEventBreakdown(
  projectId: string,
  startDate: Date,
  endDate: Date,
  dimension: 'device' | 'browser' | 'os' | 'country' | 'source' | 'category'
): Promise<{ label: string; count: number; percentage: number }[]> {
  const groupBy = dimension as any;

  const events = await prisma.event.groupBy({
    by: [groupBy],
    where: {
      projectId,
      timestamp: { gte: startDate, lte: endDate },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  const total = events.reduce((sum, e) => sum + e._count.id, 0);

  return events.map(e => ({
    label: (e as any)[dimension] || 'Unknown',
    count: e._count.id,
    percentage: total > 0 ? Math.round((e._count.id / total) * 10000) / 100 : 0,
  }));
}

// Get timeseries data
export async function getTimeseries(
  projectId: string,
  startDate: Date,
  endDate: Date,
  interval: 'hour' | 'day' = 'day',
  eventName?: string
): Promise<{ timestamp: string; count: number }[]> {
  const where: any = {
    projectId,
    timestamp: { gte: startDate, lte: endDate },
  };
  if (eventName) where.name = eventName;

  const events = await prisma.event.findMany({
    where,
    select: { timestamp: true },
    orderBy: { timestamp: 'asc' },
  });

  // Group by interval
  const buckets = new Map<string, number>();

  for (const event of events) {
    const date = new Date(event.timestamp);
    let key: string;

    if (interval === 'hour') {
      key = `${date.toISOString().slice(0, 13)}:00:00.000Z`;
    } else {
      key = `${date.toISOString().slice(0, 10)}T00:00:00.000Z`;
    }

    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return Array.from(buckets.entries())
    .map(([timestamp, count]) => ({ timestamp, count }))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// Get comprehensive dashboard metrics
export async function getDashboardMetrics(
  projectId: string,
  startDate: Date,
  endDate: Date
) {
  // Calculate previous period for comparison
  const periodMs = endDate.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - periodMs);
  const prevEndDate = new Date(startDate.getTime() - 1);

  const [
    totalEvents,
    prevTotalEvents,
    uniqueUsers,
    prevUniqueUsers,
    uniqueSessions,
    topEvents,
    deviceBreakdown,
    browserBreakdown,
    timeseries,
  ] = await Promise.all([
    getEventCount(projectId, startDate, endDate),
    getEventCount(projectId, prevStartDate, prevEndDate),
    getUniqueUsers(projectId, startDate, endDate),
    getUniqueUsers(projectId, prevStartDate, prevEndDate),
    getUniqueSessions(projectId, startDate, endDate),
    getTopEvents(projectId, startDate, endDate, 10),
    getEventBreakdown(projectId, startDate, endDate, 'device'),
    getEventBreakdown(projectId, startDate, endDate, 'browser'),
    getTimeseries(projectId, startDate, endDate, 'day'),
  ]);

  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 10000) / 100;
  };

  return {
    summary: {
      totalEvents: {
        value: totalEvents,
        change: calcChange(totalEvents, prevTotalEvents),
      },
      uniqueUsers: {
        value: uniqueUsers,
        change: calcChange(uniqueUsers, prevUniqueUsers),
      },
      uniqueSessions: {
        value: uniqueSessions,
        change: null, // Would need prev period calc
      },
      avgEventsPerUser: {
        value: uniqueUsers > 0 ? Math.round((totalEvents / uniqueUsers) * 100) / 100 : 0,
        change: null,
      },
    },
    topEvents,
    deviceBreakdown,
    browserBreakdown,
    timeseries,
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
  };
}

// Real-time stats (last 5 minutes)
export async function getRealTimeStats(projectId: string) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  const [eventsLast5Min, eventsLastMin, activeUsers] = await Promise.all([
    prisma.event.count({
      where: { projectId, timestamp: { gte: fiveMinutesAgo } },
    }),
    prisma.event.count({
      where: { projectId, timestamp: { gte: oneMinuteAgo } },
    }),
    prisma.event.findMany({
      where: {
        projectId,
        timestamp: { gte: fiveMinutesAgo },
        userId: { not: null },
      },
      distinct: ['userId'],
      select: { userId: true },
    }),
  ]);

  return {
    eventsPerMinute: Math.round(eventsLast5Min / 5),
    eventsLastMinute: eventsLastMin,
    activeUsers: activeUsers.length,
    timestamp: new Date().toISOString(),
  };
}
