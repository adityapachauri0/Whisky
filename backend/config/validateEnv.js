const logger = require('../utils/logger');

/**
 * Validates required environment variables are set
 * Throws error if critical variables are missing in production
 */
function validateEnvironment() {
  const requiredVars = {
    // Critical security variables
    JWT_SECRET: 'JWT secret for token signing',
    COOKIE_SECRET: 'Cookie encryption secret',
    SESSION_SECRET: 'Session secret key',
    ENCRYPTION_KEY: 'Data encryption key (must be 32 characters)',
    CSRF_SECRET: 'CSRF token secret',
    
    // Admin configuration
    ADMIN_EMAIL: 'Admin email address',
    ADMIN_PASSWORD_HASH: 'Admin password hash',
    
    // Database
    MONGODB_URI: 'MongoDB connection string',
    
    // Application
    NODE_ENV: 'Node environment (development/production)',
    PORT: 'Server port number',
    FRONTEND_URL: 'Frontend application URL',
    ALLOWED_ORIGINS: 'CORS allowed origins'
  };

  const warnings = [];
  const errors = [];

  // Check required variables
  Object.entries(requiredVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      if (process.env.NODE_ENV === 'production') {
        errors.push(`Missing required environment variable: ${key} (${description})`);
      } else {
        warnings.push(`Missing environment variable: ${key} (${description})`);
      }
    }
  });

  // Additional validations
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length !== 32) {
    errors.push('ENCRYPTION_KEY must be exactly 32 characters long');
  }

  if (process.env.NODE_ENV === 'production') {
    // Production-specific checks
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost')) {
      warnings.push('Using localhost MongoDB in production - consider using MongoDB Atlas or secured instance');
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      warnings.push('Email configuration missing - contact form submissions will fail');
    }

    // Check for default/weak values
    const weakValues = ['dev', 'development', 'test', 'secret', 'password', '123'];
    const secretVars = ['JWT_SECRET', 'COOKIE_SECRET', 'SESSION_SECRET', 'ENCRYPTION_KEY', 'CSRF_SECRET'];
    
    secretVars.forEach(varName => {
      const value = process.env[varName];
      if (value && weakValues.some(weak => value.toLowerCase().includes(weak))) {
        errors.push(`${varName} appears to contain a weak/default value in production`);
      }
    });

    // Check secure cookie settings
    if (process.env.SECURE_COOKIES !== 'true') {
      warnings.push('SECURE_COOKIES should be set to true in production');
    }
  }

  // Log warnings
  warnings.forEach(warning => logger.warn(`ENV: ${warning}`));

  // Throw error if critical variables are missing
  if (errors.length > 0) {
    const errorMessage = 'Environment validation failed:\n' + errors.join('\n');
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Environment variables validated successfully');
}

module.exports = validateEnvironment;