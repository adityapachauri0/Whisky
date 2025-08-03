// Production-safe logger utility
const isDevelopment = process.env.NODE_ENV === 'development';

interface LogLevel {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const logger: LogLevel = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors, but in production send to monitoring service
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, you would send to error monitoring service like Sentry
      // For now, we'll silently handle errors
      // window.Sentry?.captureException(args[0]);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

export default logger;