import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/database';
import { logger } from '../config/logger';

async function seed() {
  logger.info('Starting database seed...');

  try {
    const apiKey = `ck_${uuidv4().replace(/-/g, '')}`;

    // Create demo app
    const app = await prisma.app.create({
      data: {
        name: 'Demo App',
        apiKey,
        domain: 'localhost',
        plan: 'pro',
      },
    });

    logger.info(`Created demo app: ${app.name}`);

    // Create achievements
    const achievements = [
      { code: 'first_step', name: 'First Step', description: 'Complete your first action', icon: 'star', rarity: 'common', points: 10 },
      { code: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: 'fire', rarity: 'rare', points: 50 },
      { code: 'level_10', name: 'Rising Star', description: 'Reach level 10', icon: 'rocket', rarity: 'epic', points: 100 },
      { code: 'master', name: 'Master', description: 'Unlock all achievements', icon: 'crown', rarity: 'legendary', points: 500 },
    ];

    for (const ach of achievements) {
      await prisma.achievement.create({
        data: { appId: app.id, ...ach },
      });
    }

    logger.info(`Created ${achievements.length} achievements`);

    // Create demo users with progress
    const users = ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'];

    for (let i = 0; i < users.length; i++) {
      await prisma.userProgress.create({
        data: {
          appId: app.id,
          userId: users[i],
          points: Math.floor(Math.random() * 500) + 50,
          level: Math.floor(Math.random() * 10) + 1,
          streak: Math.floor(Math.random() * 7),
        },
      });
    }

    logger.info('Created demo user progress');

    // Create demo theme
    await prisma.theme.create({
      data: {
        appId: app.id,
        name: 'Brand Colors',
        colors: JSON.stringify(['#FF6B6B', '#4ECDC4', '#45B7D1']),
        particleShape: 'square',
        animation: 'fall',
        isDefault: true,
      },
    });

    // Feature flags
    const flags = [
      { name: 'confetti', enabled: true },
      { name: 'achievements', enabled: true },
      { name: 'leaderboard', enabled: true },
      { name: 'soundEffects', enabled: true },
      { name: 'customThemes', enabled: true },
    ];

    for (const flag of flags) {
      await prisma.featureFlag.create({ data: flag });
    }

    logger.info('');
    logger.info('='.repeat(60));
    logger.info('SAVE THIS INFORMATION:');
    logger.info('='.repeat(60));
    logger.info(`App ID: ${app.id}`);
    logger.info(`API Key: ${apiKey}`);
    logger.info('='.repeat(60));
    logger.info('');
    logger.info('Usage:');
    logger.info(`<script src="http://localhost:3004/widget/celebratekit.js"></script>`);
    logger.info(`<script>CelebrateKit.init({ appId: '${app.id}' }); CelebrateKit.confetti();</script>`);
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
