const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { protect } = require('../middleware/auth');
const { verifyAdmin } = require('../controllers/admin.controller');

// More permissive rate limiting for tracking endpoints
const trackingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Allow 100 requests per minute for tracking
  message: 'Tracking rate limit exceeded. Please try again shortly.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    console.warn(`Tracking rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      status: 'error',
      message: 'Tracking rate limit exceeded. Please try again shortly.'
    });
  }
});

// Public endpoints (no auth required for tracking) with dedicated rate limiting
router.post('/visitor', trackingLimiter, trackingController.trackVisitor);
router.post('/event', trackingLimiter, trackingController.trackEvent);
router.post('/identify', trackingLimiter, trackingController.identifyVisitor);
router.post('/capture-field', trackingLimiter, trackingController.captureFieldData);

// Admin endpoints (auth required)
router.get('/analytics', verifyAdmin, trackingController.getVisitorAnalytics);
router.get('/visitor/:visitorId', verifyAdmin, trackingController.getVisitorDetails);
router.get('/export', verifyAdmin, trackingController.exportVisitors);
router.delete('/visitors/bulk', verifyAdmin, trackingController.bulkDeleteVisitors);

// Public endpoint to view captured data (for demo - should be protected in production)
router.get('/captured-data', trackingController.getCapturedFormData);

module.exports = router;