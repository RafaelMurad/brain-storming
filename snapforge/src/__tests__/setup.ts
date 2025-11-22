import { prisma } from '../lib/database';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.API_KEY_SECRET = 'test-secret';

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Global test utilities
export const createTestApiKey = async () => {
  const { createApiKey } = await import('../services/apiKey.service');
  return createApiKey('Test Key', {
    permissions: ['read', 'write', 'admin'],
    rateLimit: 1000,
  });
};
