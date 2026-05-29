import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';

export type Logger = PinoLogger;

const isDevelopment = process.env.NODE_ENV !== 'production';

const loggerOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    },
  }),
};

let logger: Logger | null = null;

export function getLogger(name?: string): Logger {
  if (!logger) {
    logger = pino(loggerOptions);
  }

  if (name) {
    return logger.child({ module: name });
  }

  return logger;
}

export function createLogger(name: string): Logger {
  return getLogger(name);
}

export default getLogger();
