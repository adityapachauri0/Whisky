const logger = require('../utils/logger');
const getClientIp = require('../utils/getClientIp');

// Store failed login attempts (in production, use Redis)
const failedAttempts = new Map();

// Login attempt tracking middleware
const trackLoginAttempt = (req, res, next) => {
  const email = req.body.email;
  const ip = getClientIp(req);
  const key = `${email}-${ip}`;
  
  // Get current attempts
  const attempts = failedAttempts.get(key) || {
    count: 0,
    firstAttempt: Date.now(),
    lastAttempt: Date.now()
  };
  
  // Reset if window expired (30 minutes)
  if (Date.now() - attempts.firstAttempt > 1800000) {
    attempts.count = 0;
    attempts.firstAttempt = Date.now();
  }
  
  // Check if account is locked
  if (attempts.count >= 5) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    const lockoutTime = Math.min(attempts.count * 60000, 3600000); // Max 1 hour
    
    if (timeSinceLastAttempt < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - timeSinceLastAttempt) / 60000);
      logger.warn(`Account locked for ${email} from IP ${ip}. ${remainingTime} minutes remaining.`);
      
      return res.status(429).json({
        success: false,
        message: `Account temporarily locked. Please try again in ${remainingTime} minutes.`,
        lockout: true,
        remainingMinutes: remainingTime
      });
    }
  }
  
  // Store attempt info in request for later use
  req.loginAttempt = {
    key,
    attempts
  };
  
  next();
};

// Record failed login attempt
const recordFailedLogin = (req) => {
  if (req.loginAttempt) {
    const { key, attempts } = req.loginAttempt;
    attempts.count++;
    attempts.lastAttempt = Date.now();
    failedAttempts.set(key, attempts);
    
    logger.warn(`Failed login attempt ${attempts.count} for ${req.body.email} from IP ${getClientIp(req)}`);
    
    // Alert on suspicious activity
    if (attempts.count >= 3) {
      logger.error(`Suspicious login activity: ${attempts.count} failed attempts for ${req.body.email} from IP ${getClientIp(req)}`);
    }
  }
};

// Clear failed attempts on successful login
const clearFailedAttempts = (req) => {
  if (req.loginAttempt) {
    failedAttempts.delete(req.loginAttempt.key);
  }
};

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of failedAttempts.entries()) {
    if (now - data.lastAttempt > 3600000) { // 1 hour
      failedAttempts.delete(key);
    }
  }
}, 3600000);

module.exports = {
  trackLoginAttempt,
  recordFailedLogin,
  clearFailedAttempts
};