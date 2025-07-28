const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { verifyAdmin } = require('../controllers/admin.controller');
const { validateContactForm, validateObjectId, handleValidationErrors } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiter for contact form
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many contact form submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many contact form submissions. Please try again later.'
    });
  }
});

// Public routes
router.post(
  '/',
  contactRateLimiter,
  validateContactForm,
  handleValidationErrors,
  contactController.createContact
);

// Protected routes (admin only)
router.use(verifyAdmin); // All routes after this require admin authentication

router.get('/', contactController.getAllContacts);

router.get(
  '/:id',
  validateObjectId,
  handleValidationErrors,
  contactController.getContact
);

router.patch(
  '/:id/status',
  validateObjectId,
  handleValidationErrors,
  contactController.updateContactStatus
);

router.delete(
  '/:id',
  validateObjectId,
  handleValidationErrors,
  contactController.deleteContact
);

module.exports = router;