const express = require('express');
const router = express.Router();
const { submitSellWhisky, getAllSubmissions, updateSubmissionStatus, deleteSubmission } = require('../controllers/sellWhisky.controller');
const { rateLimiter } = require('../middleware/rateLimiter');
const { verifyAdmin } = require('../controllers/admin.controller');

// Rate limiter for sell whisky submissions (100 requests per hour per IP)
const sellWhiskyLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many submissions from this IP, please try again later.'
});

// POST /api/sell-whisky
router.post('/', sellWhiskyLimiter, submitSellWhisky);

// Protected routes (admin only) - TODO: Re-enable after fixing global middleware issue
// router.use(verifyAdmin);

// GET /api/sell-whisky/submissions  
router.get('/submissions', verifyAdmin, getAllSubmissions);

// PATCH /api/sell-whisky/submissions/:id/status
router.patch('/submissions/:id/status', verifyAdmin, updateSubmissionStatus);

// DELETE /api/sell-whisky/submissions/:id
router.delete('/submissions/:id', verifyAdmin, deleteSubmission);

module.exports = router;