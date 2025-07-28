const { body, param, query, validationResult } = require('express-validator');

// Admin login validation
exports.adminLoginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for authentication
exports.validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('First name can only contain letters, spaces, and hyphens'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('Last name can only contain letters, spaces, and hyphens')
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

exports.validateResetPassword = [
  param('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

exports.validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password')
];

exports.validateUpdateProfile = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('First name can only contain letters, spaces, and hyphens'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('Last name can only contain letters, spaces, and hyphens')
];

// Validation rules for contact form
exports.validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s-]+$/)
    .withMessage('Name can only contain letters, spaces, and hyphens'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s+()-]+$/)
    .withMessage('Phone number can only contain numbers, spaces, and +()-')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Message cannot exceed 5000 characters'),
  body('investmentInterest')
    .optional()
    .isIn(['not-sure', 'starter', 'premium', 'exclusive'])
    .withMessage('Invalid investment interest option'),
  body('preferredContactMethod')
    .optional()
    .isIn(['email', 'phone', 'both'])
    .withMessage('Invalid contact method')
];

// Validation rules for sell whisky form
exports.validateSellWhisky = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[\d\s+()-]+$/)
    .withMessage('Phone number can only contain numbers, spaces, and +()-')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('whiskyType')
    .trim()
    .notEmpty()
    .withMessage('Whisky type is required')
    .isLength({ max: 100 })
    .withMessage('Whisky type cannot exceed 100 characters'),
  body('distillery')
    .trim()
    .notEmpty()
    .withMessage('Distillery is required')
    .isLength({ max: 100 })
    .withMessage('Distillery name cannot exceed 100 characters'),
  body('age')
    .isInt({ min: 0, max: 100 })
    .withMessage('Age must be a number between 0 and 100'),
  body('caskNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Cask number cannot exceed 50 characters'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('askingPrice')
    .isFloat({ min: 0 })
    .withMessage('Asking price must be a positive number'),
  body('additionalInfo')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Additional information cannot exceed 5000 characters')
];

// Validation rules for consultation booking
exports.validateConsultation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[\d\s+()-]+$/)
    .withMessage('Phone number can only contain numbers, spaces, and +()-')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('preferredDate')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => new Date(value) > new Date())
    .withMessage('Consultation date must be in the future'),
  body('preferredTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  body('investmentRange')
    .isIn(['5k-25k', '25k-50k', '50k-100k', '100k+'])
    .withMessage('Please select a valid investment range'),
  body('interests')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Interests cannot exceed 1000 characters')
];

// Common validation rules
exports.validateObjectId = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ID format')
];

exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .matches(/^-?[a-zA-Z_]+$/)
    .withMessage('Invalid sort format')
];

// Error handler for validation
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param, // Support both v6 and v7 format
        message: err.msg,
        value: err.value,
        location: err.location
      }))
    });
  }
  next();
};