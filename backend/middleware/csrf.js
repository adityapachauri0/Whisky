const crypto = require('crypto');
const logger = require('../utils/logger');

// Store CSRF tokens (in production, use Redis or similar)
const csrfTokens = new Map();

// Generate CSRF token
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF token generation endpoint
const getCSRFToken = (req, res) => {
  const token = generateCSRFToken();
  const sessionId = req.sessionID || req.ip;
  
  // Store token with expiration (1 hour)
  csrfTokens.set(`${sessionId}-${token}`, {
    createdAt: Date.now(),
    used: false
  });
  
  // Clean up old tokens
  cleanupExpiredTokens();
  
  res.json({
    success: true,
    csrfToken: token
  });
};

// CSRF validation middleware
const validateCSRF = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionId = req.sessionID || req.ip;
  
  if (!token) {
    logger.warn(`CSRF token missing for ${req.method} ${req.path} from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'CSRF token missing'
    });
  }
  
  const tokenKey = `${sessionId}-${token}`;
  const tokenData = csrfTokens.get(tokenKey);
  
  if (!tokenData) {
    logger.warn(`Invalid CSRF token for ${req.method} ${req.path} from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }
  
  // Check token expiration (1 hour)
  if (Date.now() - tokenData.createdAt > 3600000) {
    csrfTokens.delete(tokenKey);
    logger.warn(`Expired CSRF token for ${req.method} ${req.path} from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'CSRF token expired'
    });
  }
  
  // Mark token as used (single-use tokens for sensitive operations)
  if (req.path.includes('/admin/') && tokenData.used) {
    logger.warn(`Reused CSRF token for admin route ${req.path} from IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'CSRF token already used'
    });
  }
  
  // Mark token as used for admin routes
  if (req.path.includes('/admin/')) {
    tokenData.used = true;
  }
  
  next();
};

// Clean up expired tokens
const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [key, data] of csrfTokens.entries()) {
    if (now - data.createdAt > 3600000) { // 1 hour
      csrfTokens.delete(key);
    }
  }
};

// Run cleanup every 30 minutes
setInterval(cleanupExpiredTokens, 1800000);

module.exports = {
  getCSRFToken,
  validateCSRF
};