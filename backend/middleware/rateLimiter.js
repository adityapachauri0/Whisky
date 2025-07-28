const rateLimit = require('express-rate-limit');

// Create a flexible rate limiter
exports.rateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: options.message || 'Too many requests from this IP, please try again later.',
        retryAfter: req.rateLimit.resetTime
      });
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

// Specific rate limiters for different endpoints
exports.strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Very strict for sensitive endpoints (3x increase)
  message: 'Too many attempts, please try again later.'
});

exports.authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // For auth endpoints
  message: 'Too many authentication attempts, please try again later.'
});

exports.apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // General API limit (3x increase)
  message: 'API rate limit exceeded, please try again later.'
});