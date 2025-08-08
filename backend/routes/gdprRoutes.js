const express = require('express');
const router = express.Router();
const gdprController = require('../controllers/gdprController');
const rateLimit = require('express-rate-limit');

// Rate limiting for GDPR requests
const gdprLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many GDPR requests from this IP, please try again later.'
});

// Public GDPR endpoints
router.post('/consent/log', gdprController.logConsent);
router.post('/delete', gdprLimiter, gdprController.deleteUserData);
router.post('/export', gdprLimiter, gdprController.exportUserData);
router.post('/update', gdprLimiter, gdprController.updateUserData);
router.get('/rights', gdprController.getPrivacyRights);
router.post('/opt-out', gdprController.optOut);

module.exports = router;