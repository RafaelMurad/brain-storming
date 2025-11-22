import { prisma } from '../lib/database';
import { logger } from '../config/logger';

// Get mentions for a user
export const getMentions = async (
  userId: string,
  options: {
    monitorId?: string;
    platform?: string;
    minScore?: number;
    isRead?: boolean;
    isFlagged?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'leadScore' | 'createdAt' | 'postedAt';
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  const {
    monitorId,
    platform,
    minScore,
    isRead,
    isFlagged,
    limit = 50,
    offset = 0,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const where: any = { userId, isArchived: false };

  if (monitorId) where.monitorId = monitorId;
  if (platform) where.platform = platform;
  if (minScore !== undefined) where.leadScore = { gte: minScore };
  if (isRead !== undefined) where.isRead = isRead;
  if (isFlagged !== undefined) where.isFlagged = isFlagged;

  const [mentions, total] = await Promise.all([
    prisma.mention.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
      include: {
        monitor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.mention.count({ where }),
  ]);

  return {
    mentions: mentions.map(formatMention),
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + mentions.length < total,
    },
  };
};

// Get a single mention
export const getMention = async (id: string, userId: string) => {
  const mention = await prisma.mention.findFirst({
    where: { id, userId },
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!mention) {
    throw new Error('Mention not found');
  }

  return formatMention(mention);
};

// Mark mention as read
export const markAsRead = async (id: string, userId: string) => {
  const result = await prisma.mention.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

  if (result.count === 0) {
    throw new Error('Mention not found');
  }

  return getMention(id, userId);
};

// Mark multiple mentions as read
export const markMultipleAsRead = async (ids: string[], userId: string) => {
  const result = await prisma.mention.updateMany({
    where: { id: { in: ids }, userId },
    data: { isRead: true },
  });

  return { updated: result.count };
};

// Flag/unflag a mention
export const toggleFlag = async (id: string, userId: string, flagged: boolean) => {
  const result = await prisma.mention.updateMany({
    where: { id, userId },
    data: { isFlagged: flagged },
  });

  if (result.count === 0) {
    throw new Error('Mention not found');
  }

  return getMention(id, userId);
};

// Archive a mention
export const archiveMention = async (id: string, userId: string) => {
  const result = await prisma.mention.updateMany({
    where: { id, userId },
    data: { isArchived: true },
  });

  if (result.count === 0) {
    throw new Error('Mention not found');
  }

  logger.info(`Mention archived: ${id}`);
};

// Get mention stats for a user
export const getMentionStats = async (
  userId: string,
  options: { days?: number; monitorId?: string } = {}
) => {
  const { days = 30, monitorId } = options;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const where: any = {
    userId,
    createdAt: { gte: since },
  };

  if (monitorId) where.monitorId = monitorId;

  const [total, unread, highScore, byPlatform, bySentiment] = await Promise.all([
    prisma.mention.count({ where }),
    prisma.mention.count({ where: { ...where, isRead: false } }),
    prisma.mention.count({ where: { ...where, leadScore: { gte: 70 } } }),
    prisma.mention.groupBy({
      by: ['platform'],
      where,
      _count: true,
    }),
    prisma.mention.groupBy({
      by: ['sentiment'],
      where,
      _count: true,
    }),
  ]);

  return {
    total,
    unread,
    highScoreLeads: highScore,
    byPlatform: byPlatform.reduce(
      (acc, item) => {
        acc[item.platform] = item._count;
        return acc;
      },
      {} as Record<string, number>
    ),
    bySentiment: bySentiment.reduce(
      (acc, item) => {
        if (item.sentiment) acc[item.sentiment] = item._count;
        return acc;
      },
      {} as Record<string, number>
    ),
    period: `${days} days`,
  };
};

// Get top leads (highest scoring mentions)
export const getTopLeads = async (userId: string, limit = 10) => {
  const mentions = await prisma.mention.findMany({
    where: {
      userId,
      isArchived: false,
      leadScore: { gte: 50 },
    },
    orderBy: { leadScore: 'desc' },
    take: limit,
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return mentions.map(formatMention);
};

// Helper to format mention for API response
const formatMention = (mention: any) => ({
  id: mention.id,
  platform: mention.platform,
  title: mention.title,
  content: mention.content,
  author: mention.author,
  url: mention.url,
  subreddit: mention.subreddit,
  score: mention.score,
  numComments: mention.numComments,
  sentiment: mention.sentiment,
  sentimentScore: mention.sentimentScore,
  leadScore: mention.leadScore,
  leadReason: mention.leadReason,
  matchedKeywords: JSON.parse(mention.matchedKeywords),
  isRead: mention.isRead,
  isFlagged: mention.isFlagged,
  postedAt: mention.postedAt,
  createdAt: mention.createdAt,
  monitor: mention.monitor
    ? {
        id: mention.monitor.id,
        name: mention.monitor.name,
      }
    : null,
});
