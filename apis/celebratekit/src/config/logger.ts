import winston from 'winston';
import { config } from './index';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: config.nodeEnv === 'development' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    }),
  ],
});

export default logger;
