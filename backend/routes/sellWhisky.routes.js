const express = require('express');
const router = express.Router();
const { submitSellWhisky, getAllSubmissions, updateSubmissionStatus } = require('../controllers/sellWhisky.controller');
const { rateLimiter } = require('../middleware/rateLimiter');
const { verifyAdmin } = require('../controllers/admin.controller');

// Rate limiter for sell whisky submissions (5 requests per hour per IP)
const sellWhiskyLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many submissions from this IP, please try again later.'
});

// POST /api/sell-whisky
router.post('/sell-whisky', sellWhiskyLimiter, submitSellWhisky);

// Protected routes (admin only)
router.use(verifyAdmin);

// GET /api/sell-whisky/submissions
router.get('/sell-whisky/submissions', getAllSubmissions);

// PATCH /api/sell-whisky/submissions/:id/status
router.patch('/sell-whisky/submissions/:id/status', updateSubmissionStatus);

module.exports = router;