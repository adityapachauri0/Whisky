const { createClient } = require('redis');
const crypto = require('crypto');

// Redis client for CSRF tokens
let redisClient;

const initializeRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('Redis CSRF Client Error:', err);
    });

    await redisClient.connect();
    console.log('✅ Redis CSRF client connected');
  }
  return redisClient;
};

// CSRF Token Management with Redis
const csrfRedis = {
  // Generate CSRF token
  generateToken: async () => {
    try {
      await initializeRedis();
      const token = crypto.randomBytes(32).toString('hex');
      const key = `csrf:${token}`;
      
      // Store token with 1 hour expiration
      await redisClient.setEx(key, 3600, 'valid');
      
      return token;
    } catch (error) {
      console.error('Error generating CSRF token:', error);
      throw new Error('Failed to generate CSRF token');
    }
  },

  // Validate CSRF token
  validateToken: async (token) => {
    try {
      await initializeRedis();
      const key = `csrf:${token}`;
      
      const exists = await redisClient.get(key);
      if (exists) {
        // Delete token after use (single-use)
        await redisClient.del(key);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating CSRF token:', error);
      return false;
    }
  },

  // Cleanup expired tokens (called periodically)
  cleanup: async () => {
    try {
      await initializeRedis();
      const keys = await redisClient.keys('csrf:*');
      console.log(`🧹 CSRF cleanup: found ${keys.length} tokens`);
    } catch (error) {
      console.error('Error during CSRF cleanup:', error);
    }
  }
};

// CSRF Middleware
const csrfProtection = async (req, res, next) => {
  // Skip CSRF for GET requests and health checks
  if (req.method === 'GET' || req.path === '/api/health') {
    return next();
  }

  // Generate token for GET requests to login page
  if (req.method === 'GET' && req.path.includes('/admin/login')) {
    try {
      const token = await csrfRedis.generateToken();
      res.set('X-CSRF-Token', token);
    } catch (error) {
      console.error('Error setting CSRF token:', error);
    }
    return next();
  }

  // Validate token for state-changing requests
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token missing'
    });
  }

  try {
    const isValid = await csrfRedis.validateToken(token);
    
    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: 'Invalid CSRF token'
      });
    }

    next();
  } catch (error) {
    console.error('CSRF validation error:', error);
    res.status(500).json({
      success: false,
      message: 'CSRF validation failed'
    });
  }
};

// Generate token endpoint
const generateCsrfToken = async (req, res) => {
  try {
    const token = await csrfRedis.generateToken();
    res.json({
      success: true,
      token: token
    });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CSRF token'
    });
  }
};

module.exports = {
  csrfProtection,
  generateCsrfToken,
  csrfRedis,
  initializeRedis
};