import { prisma } from '../lib/database';
import { createApiKey } from '../services/apiKey.service';
import { setFeatureFlag, Feature } from '../lib/featureFlags';
import { logger } from '../config/logger';

/**
 * Seed the database with initial data
 */
async function seed(): Promise<void> {
  logger.info('Starting database seed...');

  try {
    // Create demo API key with admin permissions
    const adminKey = await createApiKey('Demo Admin Key', {
      permissions: ['read', 'write', 'admin'],
      rateLimit: 1000,
    });

    logger.info('Created admin API key:', adminKey.key);

    // Create regular API key
    const regularKey = await createApiKey('Demo Regular Key', {
      permissions: ['read', 'write'],
      rateLimit: 100,
    });

    logger.info('Created regular API key:', regularKey.key);

    // Initialize feature flags
    await setFeatureFlag(Feature.PDF_EXPORT, true);
    await setFeatureFlag(Feature.FULL_PAGE_CAPTURE, true);
    await setFeatureFlag(Feature.CUSTOM_VIEWPORT, true);
    await setFeatureFlag(Feature.DELAY_CAPTURE, true);
    await setFeatureFlag(Feature.ELEMENT_SELECTOR, true);
    await setFeatureFlag(Feature.WEBHOOK_CALLBACK, false);

    logger.info('Feature flags initialized');

    logger.info('Database seed completed successfully!');
    logger.info('');
    logger.info('='.repeat(60));
    logger.info('SAVE THESE API KEYS (they will not be shown again):');
    logger.info('='.repeat(60));
    logger.info(`Admin Key: ${adminKey.key}`);
    logger.info(`Regular Key: ${regularKey.key}`);
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed
seed().catch(error => {
  console.error('Seed error:', error);
  process.exit(1);
});
