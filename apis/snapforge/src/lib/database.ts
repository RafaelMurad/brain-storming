import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

// Declare global prisma for development hot reload
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with logging
const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });
};

// Use global prisma in development to prevent multiple instances
export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};

// Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

export default prisma;
