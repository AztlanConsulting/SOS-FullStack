import fs from 'fs';
import os from 'os';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir =
  process.env.LOG_DIR?.trim() ||
  path.join(os.homedir(), '.sos-backend', 'logs');
fs.mkdirSync(logDir, { recursive: true });

const prettyPrint = winston.format.printf(
  ({ timestamp, level, message, stack, ...meta }) => {
    const metaKeys = Object.keys(meta || {});
    let metaStr = '';
    if (metaKeys.length) {
      try {
        metaStr = '\nMeta: ' + JSON.stringify(meta, null, 2);
      } catch {
        metaStr = '\nMeta: [unserializable]';
      }
    }
    const stackStr = stack ? '\nStack: ' + stack : '';
    return `${timestamp} ${level.toUpperCase()}: ${message}${stackStr}${metaStr}\n`;
  },
);

const rotateTransport = new DailyRotateFile({
  filename: path.join(logDir, '%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
});

const errorTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), prettyPrint),
});

const normalizeError = (value: unknown): unknown => {
  if (value instanceof Error) {
    const errorObject: Record<string, unknown> = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
    Object.getOwnPropertyNames(value).forEach((key) => {
      if (!['name', 'message', 'stack'].includes(key)) {
        try {
          errorObject[key] = (value as any)[key];
        } catch {
          // ignore inaccessible properties
        }
      }
    });
    return errorObject;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeError);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce(
      (acc, [key, entry]) => {
        acc[key] = normalizeError(entry);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
  return value;
};

const errorMetaFormat = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (
      key === 'level' ||
      key === 'message' ||
      key === 'timestamp' ||
      key === 'stack'
    )
      continue;
    info[key] = normalizeError((info as any)[key]);
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    errorMetaFormat(),
    winston.format.json(),
  ),
  transports: [rotateTransport, errorTransport],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

export default logger;
