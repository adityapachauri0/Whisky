const express = require('express');
const router = express.Router();
const { submitSellWhisky } = require('../controllers/sellWhisky.controller');
const { rateLimiter } = require('../middleware/rateLimiter');

// Rate limiter for sell whisky submissions (5 requests per hour per IP)
const sellWhiskyLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many submissions from this IP, please try again later.'
});

// POST /api/sell-whisky
router.post('/sell-whisky', sellWhiskyLimiter, submitSellWhisky);

module.exports = router;