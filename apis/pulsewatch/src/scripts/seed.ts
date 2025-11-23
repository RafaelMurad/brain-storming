import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/database';
import { logger } from '../config/logger';

async function seed() {
  logger.info('Starting database seed...');

  try {
    // Create demo user
    const apiKey = `pw_${uuidv4().replace(/-/g, '')}`;

    const user = await prisma.user.create({
      data: {
        email: 'demo@pulsewatch.dev',
        name: 'Demo User',
        apiKey,
        plan: 'pro',
      },
    });

    logger.info(`Created demo user: ${user.email}`);

    // Create demo monitor
    const monitor = await prisma.monitor.create({
      data: {
        userId: user.id,
        name: 'Screenshot API Leads',
        keywords: JSON.stringify([
          'screenshot API',
          'screenshot service',
          'webpage capture',
          'url to image',
          'PDF generation',
        ]),
        subreddits: JSON.stringify(['webdev', 'programming', 'saas', 'startups']),
        platforms: 'reddit',
        minScore: 40,
      },
    });

    logger.info(`Created demo monitor: ${monitor.name}`);

    // Create some demo mentions
    const mentions = [
      {
        platform: 'reddit',
        externalId: 'demo_mention_1',
        title: 'Looking for a reliable screenshot API',
        content:
          "We're building a link preview feature and need a fast, reliable screenshot API. Budget is around $50/month. Any recommendations?",
        author: 'startup_founder',
        url: 'https://reddit.com/r/webdev/demo1',
        subreddit: 'webdev',
        score: 45,
        numComments: 23,
        sentiment: 'neutral',
        sentimentScore: 0.1,
        leadScore: 82,
        leadReason: 'Actively looking with budget - high intent buyer',
        matchedKeywords: JSON.stringify(['screenshot API']),
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        platform: 'reddit',
        externalId: 'demo_mention_2',
        title: 'Frustrated with current screenshot service - need alternatives',
        content:
          "Our current provider has terrible uptime. Looking for something more reliable for our SaaS. We generate about 10k screenshots per month.",
        author: 'saas_developer',
        url: 'https://reddit.com/r/saas/demo2',
        subreddit: 'saas',
        score: 67,
        numComments: 34,
        sentiment: 'negative',
        sentimentScore: -0.4,
        leadScore: 91,
        leadReason: 'Frustrated with competitor, high volume user - excellent lead',
        matchedKeywords: JSON.stringify(['screenshot service']),
        postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        platform: 'reddit',
        externalId: 'demo_mention_3',
        title: 'Best practices for webpage capture in Node.js?',
        content:
          "I'm researching options for capturing webpages programmatically. Puppeteer seems complex - are there simpler alternatives?",
        author: 'nodejs_learner',
        url: 'https://reddit.com/r/programming/demo3',
        subreddit: 'programming',
        score: 28,
        numComments: 15,
        sentiment: 'neutral',
        sentimentScore: 0,
        leadScore: 58,
        leadReason: 'Researching solutions - potential future customer',
        matchedKeywords: JSON.stringify(['webpage capture']),
        postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ];

    for (const mention of mentions) {
      await prisma.mention.create({
        data: {
          userId: user.id,
          monitorId: monitor.id,
          ...mention,
        },
      });
    }

    logger.info(`Created ${mentions.length} demo mentions`);

    // Initialize feature flags
    const flags = [
      { name: 'redditMonitoring', enabled: true, description: 'Reddit monitoring feature' },
      { name: 'twitterMonitoring', enabled: false, description: 'Twitter monitoring feature' },
      { name: 'aiScoring', enabled: true, description: 'AI-powered lead scoring' },
      { name: 'webhookAlerts', enabled: true, description: 'Webhook alert notifications' },
    ];

    for (const flag of flags) {
      await prisma.featureFlag.create({ data: flag });
    }

    logger.info('Feature flags initialized');

    logger.info('');
    logger.info('='.repeat(60));
    logger.info('SAVE THIS API KEY (it will not be shown again):');
    logger.info('='.repeat(60));
    logger.info(`API Key: ${apiKey}`);
    logger.info('='.repeat(60));
    logger.info('');
    logger.info('Seed completed successfully!');
  } catch (error) {
    logger.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(error => {
  console.error('Seed error:', error);
  process.exit(1);
});
