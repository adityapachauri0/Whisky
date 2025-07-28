// Production configuration with proper environment variable usage
require('dotenv').config({ path: '.env.production' });

module.exports = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/viticultwhisky',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    csrfSecret: process.env.CSRF_SECRET,
    bcryptRounds: 12,
    tokenExpiry: '24h',
    refreshTokenExpiry: '7d'
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },

  // Payment
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET
    }
  },

  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },

  // App settings
  app: {
    port: parseInt(process.env.PORT || '5001'),
    env: 'production',
    frontendUrl: process.env.FRONTEND_URL || 'https://viticultwhisky.com',
    trustProxy: true
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '60'),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '3')
  },

  // Session
  session: {
    secure: process.env.SECURE_COOKIES === 'true',
    sameSite: process.env.SAME_SITE || 'strict',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'),
    checkPeriod: parseInt(process.env.SESSION_CHECK_PERIOD || '900000')
  },

  // Security policies
  securityPolicies: {
    accountLockout: {
      attempts: parseInt(process.env.ACCOUNT_LOCKOUT_ATTEMPTS || '5'),
      duration: parseInt(process.env.ACCOUNT_LOCKOUT_DURATION || '1800000')
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'error',
    file: process.env.LOG_FILE || './logs/app.log'
  },

  // Optional services
  services: {
    redis: process.env.REDIS_URL,
    sentry: process.env.SENTRY_DSN
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://viticultwhisky.com',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  }
};