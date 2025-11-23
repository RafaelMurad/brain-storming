import winston from 'winston';
import { config } from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  config.nodeEnv === 'development'
    ? winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      )
    : winston.format.json()
);

export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
  ],
  defaultMeta: { service: 'analytics-hub' },
});
