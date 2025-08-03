const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  validateUpdateProfile,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', 
  validateRegister, 
  handleValidationErrors, 
  authController.register
);

router.post('/login', 
  validateLogin, 
  handleValidationErrors, 
  authController.login
);

// Admin login route
router.post('/admin/login', adminController.adminLogin);

// Admin protected routes
router.post('/admin/change-password', adminController.verifyAdmin, adminController.changePassword);
router.get('/admin/export-submissions', adminController.verifyAdmin, adminController.exportSubmissions);
router.post('/admin/preview-email', adminController.verifyAdmin, adminController.previewEmail);
router.post('/admin/send-email', adminController.verifyAdmin, adminController.sendEmail);

router.post('/logout', authController.logout);

router.post('/forgot-password', 
  validateForgotPassword, 
  handleValidationErrors, 
  authController.forgotPassword
);

router.patch('/reset-password/:token', 
  validateResetPassword, 
  handleValidationErrors, 
  authController.resetPassword
);

router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware require authentication

router.get('/me', authController.getMe);

router.patch('/update-password', 
  validateUpdatePassword, 
  handleValidationErrors, 
  authController.updatePassword
);

router.patch('/update-me', 
  validateUpdateProfile, 
  handleValidationErrors, 
  authController.updateMe
);

router.delete('/delete-me', authController.deleteMe);

// Admin email routes
router.post('/admin/preview-email', adminController.verifyAdmin, adminController.previewEmail);
router.post('/admin/send-email', adminController.verifyAdmin, adminController.sendEmail);

module.exports = router;