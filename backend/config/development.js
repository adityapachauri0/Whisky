// Development configuration
module.exports = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/viticultwhisky',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET, // Required - no default for security
    sessionSecret: process.env.SESSION_SECRET, // Required - no default for security
    csrfSecret: process.env.CSRF_SECRET, // Required - no default for security
    bcryptRounds: 10,
    tokenExpiry: '24h',
    refreshTokenExpiry: '7d'
  },

  // Email (mock in development)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'test@example.com',
      pass: process.env.EMAIL_PASS || 'test-password'
    }
  },

  // Payment (test keys)
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || 'test_key_id',
      keySecret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
    }
  },

  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL, // Required - no default
    password: process.env.ADMIN_PASSWORD // Required - no default, not used in production
  },

  // App settings
  app: {
    port: parseInt(process.env.PORT || '5001'),
    env: 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    trustProxy: false
  },

  // Rate limiting (relaxed for development)
  rateLimit: {
    windowMs: 900000,
    max: 1000,
    authMax: 10
  },

  // Session
  session: {
    secure: false,
    sameSite: 'lax',
    maxAge: 86400000,
    checkPeriod: 900000
  },

  // Security policies (relaxed for development)
  securityPolicies: {
    accountLockout: {
      attempts: 10,
      duration: 300000 // 5 minutes
    }
  },

  // Logging
  logging: {
    level: 'debug',
    file: './logs/dev.log'
  },

  // CORS
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
};