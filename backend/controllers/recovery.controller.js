const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');

// In-memory storage for demo (use Redis in production)
const recoveryTokens = new Map();

// Generate recovery token
const generateRecoveryToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Request password recovery
exports.requestPasswordRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email matches admin email
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      // Don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a recovery link has been sent.'
      });
    }
    
    // Generate recovery token
    const token = generateRecoveryToken();
    const expires = Date.now() + 3600000; // 1 hour
    
    // Store token (in production, use Redis or database)
    recoveryTokens.set(token, {
      email,
      expires,
      used: false
    });
    
    // Create recovery URL
    const recoveryUrl = `${req.protocol}://${req.get('host')}/admin/reset-password/${token}`;
    
    // Log recovery request
    logger.info(`Password recovery requested for admin: ${email}`);
    
    // Send recovery email
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Admin Password Recovery - ViticultWhisky',
        html: `
          <h2>Password Recovery Request</h2>
          <p>You requested to reset your admin password.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${recoveryUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f39c12; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>Or copy this link: ${recoveryUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p><small>ViticultWhisky Admin System</small></p>
        `
      });
      
      logger.info(`Recovery email sent to: ${email}`);
    } catch (emailError) {
      logger.error('Failed to send recovery email:', emailError);
      
      // For development, return the token in response
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          message: 'Recovery token generated (email service not configured)',
          devToken: token,
          devUrl: recoveryUrl
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'If the email exists, a recovery link has been sent.'
    });
    
  } catch (error) {
    logger.error('Password recovery error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.'
    });
  }
};

// Verify recovery token
exports.verifyRecoveryToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Check if token exists
    const tokenData = recoveryTokens.get(token);
    
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired recovery token'
      });
    }
    
    // Check if token is expired
    if (Date.now() > tokenData.expires) {
      recoveryTokens.delete(token);
      return res.status(400).json({
        success: false,
        message: 'Recovery token has expired'
      });
    }
    
    // Check if token was already used
    if (tokenData.used) {
      return res.status(400).json({
        success: false,
        message: 'Recovery token has already been used'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      email: tokenData.email
    });
    
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
};

// Reset password with token
exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }
    
    // For production, enforce strong password
    if (process.env.NODE_ENV === 'production') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message: 'Password must contain uppercase, lowercase, number, and special character'
        });
      }
    }
    
    // Verify token
    const tokenData = recoveryTokens.get(token);
    
    if (!tokenData || Date.now() > tokenData.expires || tokenData.used) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired recovery token'
      });
    }
    
    // Generate new password hash
    const newHash = await bcrypt.hash(newPassword, 12);
    
    // Update password in environment (in production, update database or env management system)
    process.env.ADMIN_PASSWORD_HASH = newHash;
    
    // Mark token as used
    tokenData.used = true;
    recoveryTokens.set(token, tokenData);
    
    // Log password reset
    logger.info(`Admin password reset successfully for: ${tokenData.email}`);
    
    // Clean up expired tokens
    for (const [key, value] of recoveryTokens.entries()) {
      if (Date.now() > value.expires || value.used) {
        recoveryTokens.delete(key);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
};

// Emergency access with master key
exports.emergencyAccess = async (req, res) => {
  try {
    const { masterKey, newPassword } = req.body;
    
    // Check master key (in production, use secure comparison)
    const validMasterKey = process.env.MASTER_KEY || 'emergency-master-key-2024';
    
    if (!masterKey || masterKey !== validMasterKey) {
      logger.warn(`Failed emergency access attempt from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid master key'
      });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 12) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 12 characters for emergency reset'
      });
    }
    
    // Generate new hash
    const newHash = await bcrypt.hash(newPassword, 12);
    
    // Update password
    process.env.ADMIN_PASSWORD_HASH = newHash;
    
    // Log emergency access
    logger.warn(`EMERGENCY ACCESS: Admin password reset using master key from IP: ${req.ip}`);
    
    // Generate new session token
    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL, role: 'admin', emergency: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Emergency access granted. Password has been reset.',
      token,
      warning: 'This session will expire in 1 hour. Please update your password normally.'
    });
    
  } catch (error) {
    logger.error('Emergency access error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred'
    });
  }
};