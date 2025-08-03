const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recovery.controller');
const { rateLimiter } = require('../middleware/rateLimiter');

// Rate limit recovery endpoints
const recoveryLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many recovery attempts. Please try again later.'
});

// Password recovery routes
router.post('/request-recovery', recoveryLimiter, recoveryController.requestPasswordRecovery);
router.get('/verify-token/:token', recoveryController.verifyRecoveryToken);
router.post('/reset-password/:token', recoveryLimiter, recoveryController.resetPasswordWithToken);

// Emergency access (protect this endpoint!)
router.post('/emergency-access', recoveryLimiter, recoveryController.emergencyAccess);

module.exports = router;