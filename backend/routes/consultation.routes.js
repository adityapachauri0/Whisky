const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const consultationController = require('../controllers/consultation.controller');
const { rateLimiter } = require('../middleware/rateLimiter');
const adminController = require('../controllers/admin.controller');

// Validation middleware
const validateConsultation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),
  body('preferredDate')
    .notEmpty().withMessage('Preferred date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      return date > now;
    }).withMessage('Consultation date must be in the future'),
  body('preferredTime')
    .notEmpty().withMessage('Preferred time is required')
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Invalid time preference'),
  body('timezone')
    .notEmpty().withMessage('Timezone is required'),
  body('investmentBudget')
    .notEmpty().withMessage('Investment budget is required')
    .isIn(['under-10k', '10k-25k', '25k-50k', '50k-100k', 'above-100k'])
    .withMessage('Invalid budget range'),
  body('investmentExperience')
    .notEmpty().withMessage('Investment experience is required')
    .isIn(['beginner', 'intermediate', 'experienced', 'expert'])
    .withMessage('Invalid experience level'),
  body('interestedIn')
    .isArray({ min: 1 }).withMessage('Please select at least one area of interest')
    .custom((value) => {
      const validOptions = ['single-casks', 'cask-portfolios', 'rare-bottles', 'investment-advice', 'market-insights'];
      return value.every(item => validOptions.includes(item));
    }).withMessage('Invalid interest selection'),
  body('additionalInfo')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Additional info must be less than 1000 characters')
];

// Routes
// Create new consultation booking (public)
router.post(
  '/',
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }), // 3 bookings per hour
  validateConsultation,
  consultationController.createConsultation
);

// Get all consultations (admin only)
router.get(
  '/',
  adminController.verifyAdmin,
  consultationController.getAllConsultations
);

// Update consultation (admin only)
router.patch(
  '/:id',
  adminController.verifyAdmin,
  consultationController.updateConsultationStatus
);

// Get upcoming consultations for reminders (system use)
router.get(
  '/reminders/upcoming',
  // adminController.verifyAdmin, // For now, use admin auth for system endpoints
  adminController.verifyAdmin,
  consultationController.getUpcomingConsultations
);

module.exports = router;