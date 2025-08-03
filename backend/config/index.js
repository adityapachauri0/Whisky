// Configuration loader with validation
const path = require('path');

// Load environment-specific config
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env';

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });

// Required environment variables for production
const requiredEnvVars = {
  production: [
    'JWT_SECRET',
    'SESSION_SECRET', 
    'CSRF_SECRET',
    'MONGODB_URI',
    'EMAIL_USER',
    'EMAIL_PASS',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
  ],
  development: [
    'JWT_SECRET',
    'SESSION_SECRET',
    'MONGODB_URI'
  ]
};

// Validate required environment variables
function validateEnv() {
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const missing = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file or environment configuration.');
    
    if (env === 'production') {
      // Exit in production if required vars are missing
      process.exit(1);
    }
  }

  // Validate secret strength in production
  if (env === 'production') {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET is too short. Use at least 32 characters.');
      process.exit(1);
    }
    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
      console.error('❌ SESSION_SECRET is too short. Use at least 32 characters.');
      process.exit(1);
    }
  }
}

// Validate on load
validateEnv();

// Load configuration based on environment
let config;
try {
  config = require(`./${env}`);
} catch (error) {
  console.warn(`No specific config found for ${env}, using defaults`);
  config = require('./development');
}

// Export configuration
module.exports = {
  ...config,
  env,
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  isTest: env === 'test'
};