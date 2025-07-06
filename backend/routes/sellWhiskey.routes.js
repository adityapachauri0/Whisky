const express = require('express');
const router = express.Router();
const { submitSellWhiskey } = require('../controllers/sellWhiskey.controller');
const { rateLimiter } = require('../middleware/rateLimiter');

// Rate limiter for sell whiskey submissions (5 requests per hour per IP)
const sellWhiskeyLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many submissions from this IP, please try again later.'
});

// POST /api/sell-whiskey
router.post('/sell-whiskey', sellWhiskeyLimiter, submitSellWhiskey);

module.exports = router;