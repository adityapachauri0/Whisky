const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');
const AppError = require('../utils/appError');

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Create and send token
const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove sensitive data
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user
    }
  });
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Generate email verification token
    const verifyToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, verifyToken);
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      logger.error('Email sending failed:', error);
      return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    createSendToken(user, 201, res, 'Registration successful! Please check your email to verify your account.');
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if account is locked
    if (user.isLocked) {
      return next(new AppError('Account is locked due to too many failed login attempts. Please try again later.', 423));
    }

    // Check if account is active
    if (!user.active) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      await user.incLoginAttempts();
      return next(new AppError('Invalid email or password', 401));
    }

    // Reset login attempts and update last login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }
    
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Log successful login
    logger.info(`User ${user.email} logged in successfully`);

    createSendToken(user, 200, res, 'Login successful!');
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    // Hash the token from params
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    // Verify email and clear token
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!'
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return next(new AppError('No user found with that email address', 404));
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to your email!'
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      logger.error('Password reset email failed:', error);
      return next(new AppError('Failed to send password reset email. Please try again.', 500));
    }
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    // Update password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log password reset
    logger.info(`Password reset for user ${user.email}`);

    createSendToken(user, 200, res, 'Password reset successful!');
  } catch (error) {
    logger.error('Password reset error:', error);
    next(error);
  }
};

// Update password (for logged in users)
exports.updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    createSendToken(user, 200, res, 'Password updated successfully!');
  } catch (error) {
    logger.error('Password update error:', error);
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    next(error);
  }
};

// Update user profile
exports.updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    // Filter allowed fields
    const allowedFields = ['firstName', 'lastName', 'email'];
    const filteredBody = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully!',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

// Delete user account
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    next(error);
  }
};