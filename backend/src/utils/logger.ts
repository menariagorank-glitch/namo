import winston from 'winston';
import { env } from '../config/env.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const cleanMeta = Object.fromEntries(
      Object.entries(meta).filter(([key]) => isNaN(Number(key)))
    );
    const metaString = Object.keys(cleanMeta).length ? JSON.stringify(cleanMeta) : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${metaString} ${stack || ''}`.trim();
  })
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
  ],
});
