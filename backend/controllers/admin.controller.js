const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const Contact = require('../models/Contact');
const InvestmentInquiry = require('../models/InvestmentInquiry');
const SellWhisky = require('../models/SellWhisky');

// Configuration file path
const CONFIG_PATH = path.join(__dirname, '../config/admin-config.json');

// Initialize admin credentials
let adminCredentials = {
  email: 'admin@viticult.co.uk',
  password: 'admin123'
};

// Load credentials from file if it exists
const loadAdminCredentials = async () => {
  try {
    const configExists = await fs.access(CONFIG_PATH).then(() => true).catch(() => false);
    if (configExists) {
      const data = await fs.readFile(CONFIG_PATH, 'utf8');
      const config = JSON.parse(data);
      if (config.email && config.passwordHash) {
        adminCredentials = config;
      }
    }
  } catch (error) {
    logger.error('Error loading admin config:', error);
  }
};

// Save credentials to file
const saveAdminCredentials = async (credentials) => {
  try {
    const configDir = path.dirname(CONFIG_PATH);
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(credentials, null, 2));
  } catch (error) {
    logger.error('Error saving admin config:', error);
    throw error;
  }
};

// Load credentials on startup
loadAdminCredentials();

// Generate JWT token
const generateToken = (email) => {
  return jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET || 'whisky-admin-secret-key',
    { expiresIn: '24h' }
  );
};

// Admin login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check email
    if (email !== adminCredentials.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password - handle both plain and hashed passwords
    let isValidPassword = false;
    if (adminCredentials.passwordHash) {
      // Compare with hashed password
      isValidPassword = await bcrypt.compare(password, adminCredentials.passwordHash);
    } else {
      // Compare with plain password (for backward compatibility)
      isValidPassword = password === adminCredentials.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(email);

    logger.info(`Admin login successful: ${email}`);

    res.json({
      success: true,
      token,
      data: {
        user: {
          email,
          role: 'admin'
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

// Verify admin token middleware
exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'whisky-admin-secret-key');
    
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
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Verify current password
    let isValidPassword = false;
    if (adminCredentials.passwordHash) {
      isValidPassword = await bcrypt.compare(currentPassword, adminCredentials.passwordHash);
    } else {
      isValidPassword = currentPassword === adminCredentials.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update credentials
    const newCredentials = {
      email: adminCredentials.email,
      passwordHash
    };

    // Save to file
    await saveAdminCredentials(newCredentials);

    // Update in memory
    adminCredentials = newCredentials;

    logger.info('Admin password changed successfully');

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

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
      { header: 'Submitted At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    const contacts = await Contact.find().sort({ createdAt: -1 });
    contacts.forEach(contact => {
      contactSheet.addRow({
        ...contact.toObject(),
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
      { header: 'Age', key: 'age', width: 15 },
      { header: 'Cask Number', key: 'caskNumber', width: 20 },
      { header: 'Ownership Proof', key: 'ownershipProof', width: 30 },
      { header: 'Additional Info', key: 'additionalInfo', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Submitted At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    const sellRequests = await SellWhisky.find().sort({ createdAt: -1 });
    sellRequests.forEach(sell => {
      sellSheet.addRow({
        ...sell.toObject(),
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