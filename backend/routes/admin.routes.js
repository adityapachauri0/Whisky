const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { deleteSubmission, bulkDeleteSubmissions } = require('../controllers/sellWhisky.controller');
const { deleteContact, bulkDeleteContacts } = require('../controllers/contact.controller');
const { adminLoginValidation } = require('../middleware/validation');
const { trackLoginAttempt } = require('../middleware/loginSecurity');
const { validateCSRF, getCSRFToken } = require('../middleware/csrf');

// Get CSRF token
router.get('/csrf-token', getCSRFToken);

// Simple test login without middleware
router.post('/test-login', adminController.adminLogin);

// Admin login with security middleware
router.post('/login', 
  trackLoginAttempt,
  adminLoginValidation, 
  adminController.adminLogin
);

// Admin logout
router.post('/logout', adminController.adminLogout);

// Protected routes (require admin authentication)
router.use(adminController.verifyAdmin);

// Apply CSRF protection to state-changing operations
router.post('/change-password', validateCSRF, adminController.changePassword);

// Get form submissions (read-only, no CSRF needed)
router.get('/contact-submissions', adminController.getContactSubmissions);
router.get('/sell-submissions', adminController.getSellWhiskySubmissions);
router.get('/consultation-requests', adminController.getConsultationRequests);

// Export submissions (read-only, no CSRF needed)
router.get('/export', adminController.exportSubmissions);

// Delete operations
router.delete('/contact/:id', deleteContact);
router.delete('/sell-submissions/:id', deleteSubmission);

// Bulk delete operations
router.post('/contact/bulk-delete', bulkDeleteContacts);
router.post('/sell-submissions/bulk-delete', bulkDeleteSubmissions);

module.exports = router;