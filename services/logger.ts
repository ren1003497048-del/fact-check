/**
 * Simple logging utility
 * In production, consider using Winston or Pino
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Set minimum log level from environment or default to INFO
// Check if we're in browser (Vite) or Node.js environment
const getMinLevel = (): LogLevel => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env.LOG_LEVEL as LogLevel) || 'INFO';
  }
  if (typeof process !== 'undefined' && process.env) {
    return (process.env.LOG_LEVEL as LogLevel) || 'INFO';
  }
  return 'INFO';
};

const MIN_LEVEL = getMinLevel();
const MIN_LEVEL_VALUE = LOG_LEVELS[MIN_LEVEL] || 1;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= MIN_LEVEL_VALUE;
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('DEBUG')) {
      console.debug(formatMessage('DEBUG', message, meta));
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('INFO')) {
      console.log(formatMessage('INFO', message, meta));
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('WARN')) {
      console.warn(formatMessage('WARN', message, meta));
    }
  },
  error: (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    if (shouldLog('ERROR')) {
      const errorMeta = error instanceof Error
        ? { ...meta, error: error.message, stack: error.stack }
        : meta;
      console.error(formatMessage('ERROR', message, errorMeta));
    }
  },
};
