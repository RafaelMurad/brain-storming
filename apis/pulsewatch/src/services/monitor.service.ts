import { prisma } from '../lib/database';
import { logger } from '../config/logger';
import {
  searchReddit,
  getSubredditPosts,
  matchesKeywords,
  getDemoPosts,
  isRedditConfigured,
  RedditPost,
} from './reddit.service';
import { analyzeSentiment, scoreLeads } from './ai.service';

// Create a new monitor
export const createMonitor = async (
  userId: string,
  data: {
    name: string;
    keywords: string[];
    subreddits?: string[];
    platforms?: string[];
    minScore?: number;
  }
) => {
  const monitor = await prisma.monitor.create({
    data: {
      userId,
      name: data.name,
      keywords: JSON.stringify(data.keywords),
      subreddits: data.subreddits ? JSON.stringify(data.subreddits) : null,
      platforms: data.platforms?.join(',') || 'reddit',
      minScore: data.minScore || 0,
    },
  });

  logger.info(`Monitor created: ${monitor.id}`);
  return formatMonitor(monitor);
};

// Get monitors for a user
export const getMonitors = async (userId: string) => {
  const monitors = await prisma.monitor.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return monitors.map(formatMonitor);
};

// Get a single monitor
export const getMonitor = async (id: string, userId: string) => {
  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
  });

  if (!monitor) {
    throw new Error('Monitor not found');
  }

  return formatMonitor(monitor);
};

// Update a monitor
export const updateMonitor = async (
  id: string,
  userId: string,
  data: {
    name?: string;
    keywords?: string[];
    subreddits?: string[];
    platforms?: string[];
    minScore?: number;
    isActive?: boolean;
  }
) => {
  const monitor = await prisma.monitor.updateMany({
    where: { id, userId },
    data: {
      name: data.name,
      keywords: data.keywords ? JSON.stringify(data.keywords) : undefined,
      subreddits: data.subreddits ? JSON.stringify(data.subreddits) : undefined,
      platforms: data.platforms?.join(','),
      minScore: data.minScore,
      isActive: data.isActive,
    },
  });

  if (monitor.count === 0) {
    throw new Error('Monitor not found');
  }

  return getMonitor(id, userId);
};

// Delete a monitor
export const deleteMonitor = async (id: string, userId: string) => {
  const result = await prisma.monitor.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new Error('Monitor not found');
  }

  logger.info(`Monitor deleted: ${id}`);
};

// Run a scan for a monitor
export const runMonitorScan = async (monitorId: string) => {
  const startTime = Date.now();

  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId },
  });

  if (!monitor || !monitor.isActive) {
    throw new Error('Monitor not found or inactive');
  }

  const keywords: string[] = JSON.parse(monitor.keywords);
  const subreddits: string[] = monitor.subreddits ? JSON.parse(monitor.subreddits) : [];

  let allPosts: RedditPost[] = [];
  let mentionsFound = 0;

  try {
    // Get posts based on configuration
    if (isRedditConfigured()) {
      if (subreddits.length > 0) {
        // Search in specific subreddits
        for (const subreddit of subreddits) {
          const posts = await getSubredditPosts(subreddit, { sort: 'new', limit: 50 });
          allPosts.push(...posts);
        }
      } else {
        // Search all of Reddit for keywords
        for (const keyword of keywords.slice(0, 3)) {
          const posts = await searchReddit(keyword, { sort: 'new', limit: 25 });
          allPosts.push(...posts);
        }
      }
    } else {
      // Demo mode
      allPosts = getDemoPosts();
    }

    // Process posts
    for (const post of allPosts) {
      const { matches, matchedKeywords } = matchesKeywords(post, keywords);

      if (!matches) continue;

      // Check if we already have this mention
      const existing = await prisma.mention.findUnique({
        where: {
          platform_externalId: {
            platform: 'reddit',
            externalId: post.id,
          },
        },
      });

      if (existing) continue;

      // Analyze sentiment and score lead
      const sentiment = await analyzeSentiment(`${post.title} ${post.selftext}`);
      const leadScore = await scoreLeads(post.title, post.selftext, {
        subreddit: post.subreddit,
        score: post.score,
        numComments: post.numComments,
      });

      // Create mention
      await prisma.mention.create({
        data: {
          userId: monitor.userId,
          monitorId: monitor.id,
          platform: 'reddit',
          externalId: post.id,
          title: post.title,
          content: post.selftext || '',
          author: post.author,
          url: post.permalink,
          subreddit: post.subreddit,
          score: post.score,
          numComments: post.numComments,
          sentiment: sentiment.sentiment,
          sentimentScore: sentiment.score,
          leadScore: leadScore.score,
          leadReason: leadScore.reason,
          matchedKeywords: JSON.stringify(matchedKeywords),
          postedAt: new Date(post.createdUtc * 1000),
        },
      });

      mentionsFound++;
    }

    // Log scan
    await prisma.scanLog.create({
      data: {
        monitorId,
        platform: 'reddit',
        postsScanned: allPosts.length,
        mentionsFound,
        duration: Date.now() - startTime,
      },
    });

    logger.info(`Scan completed for monitor ${monitorId}: ${mentionsFound} new mentions found`);

    return {
      postsScanned: allPosts.length,
      mentionsFound,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    // Log error
    await prisma.scanLog.create({
      data: {
        monitorId,
        platform: 'reddit',
        postsScanned: allPosts.length,
        mentionsFound,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
};

// Run scans for all active monitors
export const runAllMonitorScans = async () => {
  const monitors = await prisma.monitor.findMany({
    where: { isActive: true },
  });

  logger.info(`Running scans for ${monitors.length} active monitors`);

  const results = [];

  for (const monitor of monitors) {
    try {
      const result = await runMonitorScan(monitor.id);
      results.push({ monitorId: monitor.id, success: true, ...result });
    } catch (error) {
      logger.error(`Scan failed for monitor ${monitor.id}:`, error);
      results.push({
        monitorId: monitor.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
};

// Helper to format monitor for API response
const formatMonitor = (monitor: any) => ({
  id: monitor.id,
  name: monitor.name,
  keywords: JSON.parse(monitor.keywords),
  subreddits: monitor.subreddits ? JSON.parse(monitor.subreddits) : [],
  platforms: monitor.platforms.split(','),
  minScore: monitor.minScore,
  isActive: monitor.isActive,
  createdAt: monitor.createdAt,
  updatedAt: monitor.updatedAt,
});
