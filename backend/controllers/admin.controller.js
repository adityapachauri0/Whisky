const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const getClientIp = require('../utils/getClientIp');
const bcrypt = require('bcryptjs');
const ExcelJS = require('exceljs');
const Contact = require('../models/Contact');
const InvestmentInquiry = require('../models/InvestmentInquiry');
const SellWhisky = require('../models/SellWhisky');
const emailService = require('../utils/emailService');
const { generateInvestmentInquiryEmail } = require('../utils/emailTemplates');

// Get admin credentials from environment variables
const getAdminCredentials = () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    logger.error('Admin credentials not properly configured in environment variables');
    throw new Error('Admin configuration error');
  }
  
  return {
    email: process.env.ADMIN_EMAIL,
    passwordHash: process.env.ADMIN_PASSWORD_HASH
  };
};

// Generate JWT token
const generateToken = (email) => {
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET not configured in environment variables');
    throw new Error('Authentication configuration error');
  }
  
  return jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Import login security
const { recordFailedLogin, clearFailedAttempts } = require('../middleware/loginSecurity');

// Admin login - Updated to use database auth
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Use database authentication instead of environment variables
    const User = require('../models/User');
    
    // Find admin user in database
    const adminUser = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'admin',
      active: true 
    }).select('+password +loginAttempts +lockUntil');

    if (!adminUser) {
      recordFailedLogin(req);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (adminUser.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check password using User model method
    const isValidPassword = await adminUser.comparePassword(password);

    if (!isValidPassword) {
      await adminUser.incLoginAttempts();
      recordFailedLogin(req);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts and update last login
    if (adminUser.loginAttempts > 0) {
      await adminUser.resetLoginAttempts();
    }
    
    adminUser.lastLogin = Date.now();
    await adminUser.save({ validateBeforeSave: false });

    // Clear failed attempts on successful login
    clearFailedAttempts(req);

    // Generate token with additional claims
    const token = generateToken(email);

    // Log successful login with IP
    logger.info(`Admin login successful: ${email} from IP: ${getClientIp(req)}`);

    // Set secure httpOnly cookie - PRODUCTION READY
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // Allow both HTTP and HTTPS for flexibility
      sameSite: 'lax', // Permissive for cross-origin requests
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: undefined, // Allow all domains
      path: '/api' // Set cookie for all API endpoints
    });

    res.json({
      success: true,
      data: {
        user: {
          email,
          role: 'admin',
          firstName: adminUser.firstName,
          lastName: adminUser.lastName
        }
      }
    });

  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Admin logout
exports.adminLogout = async (req, res) => {
  try {
    // Clear the httpOnly cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/api' // Match the path used when setting the cookie
    });

    logger.info(`Admin logout: ${req.ip}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Verify admin token middleware
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Check for token in httpOnly cookie first
    let token = req.cookies?.authToken;
    
    // Fallback to Authorization header for backward compatibility
    if (!token) {
      token = req.headers.authorization?.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET not configured in environment variables');
      throw new Error('Authentication configuration error');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    logger.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Import update utility
const updateEnvPassword = require('../utils/updateEnvPassword');

// Change admin password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Get admin credentials from environment
    const adminCredentials = getAdminCredentials();

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, adminCredentials.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Automatically update the environment file
    const updateSuccess = updateEnvPassword(passwordHash);

    if (updateSuccess) {
      logger.info(`Admin password changed successfully by ${adminCredentials.email}`);
      
      res.json({
        success: true,
        message: 'Password changed successfully. The change is effective immediately.',
        note: 'Your new password is now active. Please use it for your next login.'
      });
    } else {
      // Fallback to manual update instructions
      logger.warn('Automatic password update failed, providing manual instructions');
      
      res.json({
        success: true,
        message: 'Password hash generated. Automatic update failed.',
        passwordHash,
        instructions: 'Please manually update ADMIN_PASSWORD_HASH in your .env file with the hash above, then restart the server.'
      });
    }

  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Export form submissions to Excel
exports.exportSubmissions = async (req, res) => {
  try {
    // Force Excel format - ignore any other format requests
    const format = req.query.format || 'excel';
    if (format !== 'excel') {
      return res.status(400).json({
        success: false,
        message: 'Only Excel format is supported'
      });
    }
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ViticultWhisky Admin';
    workbook.created = new Date();

    // Export Contact Form Submissions
    const contactSheet = workbook.addWorksheet('Contact Inquiries');
    contactSheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Subject', key: 'subject', width: 30 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Investment Interest', key: 'investmentInterest', width: 20 },
      { header: 'Preferred Contact', key: 'preferredContactMethod', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'IP Address', key: 'ipAddress', width: 20 },
      { header: 'Submitted At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    const contacts = await Contact.find().sort({ createdAt: -1 });
    contacts.forEach(contact => {
      const contactObj = contact.toObject();
      contactSheet.addRow({
        _id: contactObj._id,
        name: contactObj.name,
        email: contactObj.email,
        phone: contactObj.phone,
        subject: contactObj.subject,
        message: contactObj.message,
        investmentInterest: contactObj.investmentInterest,
        preferredContactMethod: contactObj.preferredContactMethod,
        status: contactObj.status,
        ipAddress: contactObj.ipAddress,
        createdAt: contact.createdAt ? new Date(contact.createdAt).toLocaleString() : '',
        updatedAt: contact.updatedAt ? new Date(contact.updatedAt).toLocaleString() : ''
      });
    });

    // Style the header row
    contactSheet.getRow(1).font = { bold: true };
    contactSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4A574' }
    };

    // Export Investment Inquiries
    const investmentSheet = workbook.addWorksheet('Investment Inquiries');
    investmentSheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Investment Type', key: 'investmentType', width: 20 },
      { header: 'Budget', key: 'budget', width: 20 },
      { header: 'Timeline', key: 'timeline', width: 20 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Submitted At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    const investments = await InvestmentInquiry.find().sort({ createdAt: -1 });
    investments.forEach(investment => {
      investmentSheet.addRow({
        ...investment.toObject(),
        createdAt: investment.createdAt ? new Date(investment.createdAt).toLocaleString() : '',
        updatedAt: investment.updatedAt ? new Date(investment.updatedAt).toLocaleString() : ''
      });
    });

    investmentSheet.getRow(1).font = { bold: true };
    investmentSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4A574' }
    };

    // Export Sell Whisky Submissions
    const sellSheet = workbook.addWorksheet('Sell Whisky Requests');
    sellSheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Distillery', key: 'distillery', width: 25 },
      { header: 'Cask Type', key: 'caskType', width: 20 },
      { header: 'Year', key: 'year', width: 15 },
      { header: 'Litres', key: 'litres', width: 15 },
      { header: 'ABV', key: 'abv', width: 15 },
      { header: 'Asking Price', key: 'askingPrice', width: 20 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'IP Address', key: 'ipAddress', width: 20 },
      { header: 'Submitted At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    const sellRequests = await SellWhisky.find().sort({ createdAt: -1 });
    sellRequests.forEach(sell => {
      const sellObj = sell.toObject();
      sellSheet.addRow({
        _id: sellObj._id,
        name: sellObj.name,
        email: sellObj.email,
        phone: sellObj.phone,
        distillery: sellObj.distillery,
        caskType: sellObj.caskType,
        year: sellObj.year,
        litres: sellObj.litres,
        abv: sellObj.abv,
        askingPrice: sellObj.askingPrice,
        message: sellObj.message,
        status: sellObj.status,
        ipAddress: sellObj.ipAddress,
        createdAt: sell.createdAt ? new Date(sell.createdAt).toLocaleString() : '',
        updatedAt: sell.updatedAt ? new Date(sell.updatedAt).toLocaleString() : ''
      });
    });

    sellSheet.getRow(1).font = { bold: true };
    sellSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4A574' }
    };

    // Set response headers
    const filename = `whisky-submissions-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

    logger.info(`Excel export completed: ${filename}`);

  } catch (error) {
    logger.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export submissions'
    });
  }
};

// Preview email before sending
exports.previewEmail = async (req, res) => {
  try {
    const { contact } = req.body;

    // Validate input
    if (!contact || !contact.email) {
      return res.status(400).json({
        success: false,
        message: 'Contact information is required'
      });
    }

    // Generate the beautiful investment inquiry email
    const emailContent = generateInvestmentInquiryEmail(contact);

    res.json({
      success: true,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

  } catch (error) {
    logger.error('Email preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate email preview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Send email to contact
exports.sendEmail = async (req, res) => {
  try {
    const { contact, subject, html } = req.body;

    // Validate input
    if (!contact || !contact.email || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Contact email, subject, and message body are required'
      });
    }

    // Check if we should use the beautiful template
    if (contact.investmentInterest || contact.subject?.toLowerCase().includes('investment')) {
      // Use the beautiful investment inquiry template
      const emailContent = generateInvestmentInquiryEmail(contact);
      
      await emailService.sendEmail({
        to: contact.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html
      });

      logger.info(`Investment inquiry email sent to ${contact.email} using beautiful template`);
    } else {
      // Send the custom HTML provided by admin
      await emailService.sendEmail({
        to: contact.email,
        subject: subject,
        text: `Email from ViticultWhisky`, // Basic text fallback
        html: html
      });

      logger.info(`Custom email sent to ${contact.email}`);
    }

    // Update contact status to 'contacted' if it's a contact submission
    if (contact._id) {
      await Contact.findByIdAndUpdate(contact._id, { 
        status: 'contacted',
        lastContactedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    logger.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all contact submissions
exports.getContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// Get all sell whisky submissions  
exports.getSellWhiskySubmissions = async (req, res) => {
  try {
    const SellWhisky = require('../models/SellWhisky');
    const submissions = await SellWhisky.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    logger.error('Error fetching sell whisky submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
};

// Get all consultation requests
exports.getConsultationRequests = async (req, res) => {
  try {
    const Consultation = require('../models/Consultation');
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    logger.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations'
    });
  }
};