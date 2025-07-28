const bcrypt = require('bcryptjs');
const logger = require('./logger');

const validateEnvironment = async () => {
  const errors = [];
  const warnings = [];

  // Check required environment variables
  const required = [
    'NODE_ENV',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH',
    'JWT_SECRET',
    'MONGODB_URI'
  ];

  required.forEach(key => {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  // Validate admin email format
  if (process.env.ADMIN_EMAIL) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(process.env.ADMIN_EMAIL)) {
      errors.push('ADMIN_EMAIL is not a valid email format');
    }
  }

  // Validate password hash
  if (process.env.ADMIN_PASSWORD_HASH) {
    // Check if it's a valid bcrypt hash
    if (!process.env.ADMIN_PASSWORD_HASH.startsWith('$2a$') && 
        !process.env.ADMIN_PASSWORD_HASH.startsWith('$2b$')) {
      errors.push('ADMIN_PASSWORD_HASH does not appear to be a valid bcrypt hash');
      warnings.push('Run ./setup-admin.sh to generate a proper password hash');
    }
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters for security');
  }

  // Check for default credentials in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.ADMIN_EMAIL === 'admin@viticultwhisky.com') {
      warnings.push('Using default admin email in production - please change!');
    }
    
    // Test if default password works
    if (process.env.ADMIN_PASSWORD_HASH) {
      const isDefaultPassword = await bcrypt.compare('admin123', process.env.ADMIN_PASSWORD_HASH);
      if (isDefaultPassword) {
        warnings.push('⚠️  SECURITY WARNING: Using default admin password in production!');
      }
    }
  }

  // Log results
  if (errors.length > 0) {
    logger.error('Environment validation failed:', errors);
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => logger.warn(warning));
  }

  logger.info('✅ Environment validation passed');
  
  // Log admin setup info (without sensitive data)
  logger.info(`Admin email configured: ${process.env.ADMIN_EMAIL}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
};

module.exports = validateEnvironment;