const logger = require('../utils/logger');

/**
 * Middleware to enforce HTTPS connections
 * Redirects HTTP requests to HTTPS in production
 */
const httpsEnforce = (req, res, next) => {
  // Skip enforcement in development or for localhost testing
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  if (process.env.NODE_ENV === 'development' || isLocalhost) {
    return next();
  }

  // Check if request is already secure
  const isSecure = req.secure || 
                   req.headers['x-forwarded-proto'] === 'https' ||
                   req.protocol === 'https';

  if (isSecure) {
    // Request is already secure, continue
    return next();
  }

  // Log the redirect attempt
  logger.info(`Redirecting HTTP to HTTPS for ${req.method} ${req.url} from IP: ${req.ip}`);

  // Construct the HTTPS URL
  const httpsUrl = `https://${req.hostname}${req.originalUrl}`;

  // For GET requests, redirect
  if (req.method === 'GET') {
    return res.redirect(301, httpsUrl);
  }

  // For non-GET requests, return an error
  // (redirecting POST/PUT/DELETE requests can cause issues)
  return res.status(403).json({
    success: false,
    message: 'HTTPS is required for this request',
    httpsUrl: httpsUrl
  });
};

module.exports = httpsEnforce;