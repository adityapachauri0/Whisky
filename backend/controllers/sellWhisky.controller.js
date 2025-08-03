const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const SellWhisky = require('../models/SellWhisky');
const logger = require('../utils/logger');
const getClientIp = require('../utils/getClientIp');
const { validationResult } = require('express-validator');
const mongoHandler = require('../utils/mongoConnectionHandler');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle sell whisky submissions
exports.submitSellWhisky = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      caskType,
      distillery,
      year,
      litres,
      abv,
      askingPrice,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !caskType || !distillery || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Whisky Cask Sale Submission - ${distillery} ${year}`,
      html: `
        <h2>New Whisky Cask Sale Submission</h2>
        
        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
        </ul>
        
        <h3>Cask Details:</h3>
        <ul>
          <li><strong>Cask Type:</strong> ${caskType}</li>
          <li><strong>Distillery:</strong> ${distillery}</li>
          <li><strong>Year Distilled:</strong> ${year}</li>
          <li><strong>Volume:</strong> ${litres || 'Not provided'} litres</li>
          <li><strong>ABV:</strong> ${abv || 'Not provided'}%</li>
          <li><strong>Asking Price:</strong> £${askingPrice || 'Not provided'}</li>
        </ul>
        
        <h3>Additional Information:</h3>
        <p>${message || 'No additional information provided'}</p>
        
        <hr>
        <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
      `
    };

    // Send confirmation email to the seller
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We\'ve Received Your Whisky Cask Submission',
      html: `
        <h2>Thank You for Your Submission</h2>
        
        <p>Dear ${name},</p>
        
        <p>We've received your whisky cask submission for the ${distillery} ${year} cask. Our team of experts will review your submission and provide a valuation within 48 hours.</p>
        
        <h3>What Happens Next?</h3>
        <ol>
          <li><strong>Expert Review:</strong> Our specialists will analyze your cask details and current market conditions</li>
          <li><strong>Valuation Report:</strong> You'll receive a detailed valuation report within 48 hours</li>
          <li><strong>Marketing & Sale:</strong> If you proceed, we'll market your cask to our global buyer network</li>
        </ol>
        
        <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>
        The Whisky Investment Team</p>
      `
    };

    // Save to database
    const sellWhiskyData = {
      name,
      email,
      phone,
      caskType,
      distillery,
      year,
      litres,
      abv,
      askingPrice,
      message,
      ipAddress: await getClientIp(req),
      userAgent: req.get('user-agent')
    };

    const submission = await SellWhisky.create(sellWhiskyData);

    // Send emails
    try {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(confirmationMail);
      logger.info(`Sell whisky submission created: ${submission._id}`);
    } catch (emailError) {
      logger.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your submission has been received successfully. We will contact you within 48 hours.',
      data: {
        id: submission._id,
        name: submission.name,
        email: submission.email
      }
    });

  } catch (error) {
    // console.error('Sell whisky submission error:', error);
    logger.error('Sell whisky submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your submission. Please try again later.'
    });
  }
};

// Get all sell whisky submissions (admin only)
exports.getAllSubmissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { distillery: { $regex: search, $options: 'i' } }
      ];
    }

    const submissions = await SellWhisky.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SellWhisky.countDocuments(query);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get sell whisky submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve submissions'
    });
  }
};

// Update submission status (admin only)
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const submission = await SellWhisky.findByIdAndUpdate(
      id,
      { 
        status, 
        notes
      },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });

  } catch (error) {
    logger.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission'
    });
  }
};

// Delete sell whisky submission (admin only)
exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await mongoHandler.safeDelete(SellWhisky, id, 'sell whisky submission');
    
    logger.info(`Sell submission deleted: ${result.deletedDocument.email} (ID: ${id}) by admin from IP: ${req.ip}`);

    res.json({
      success: true,
      message: 'Submission deleted successfully',
      data: {
        deletedId: result.deletedId,
        deletedEmail: result.deletedDocument.email
      }
    });

  } catch (error) {
    logger.error('Delete submission error:', {
      error: error.message,
      stack: error.stack,
      submissionId: req.params.id,
      ip: req.ip
    });
    
    // Handle specific errors
    if (error.message === 'Invalid document ID format') {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format'
      });
    }

    if (error.message === 'Document not found') {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    if (error.message === 'Failed to establish MongoDB connection') {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission. Please try again later.'
    });
  }
};

// Bulk delete sell whisky submissions (admin only)
exports.bulkDeleteSubmissions = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of submission IDs to delete'
      });
    }

    const result = await mongoHandler.safeBulkDelete(SellWhisky, ids, 'sell whisky submissions');
    
    logger.info(`Bulk delete: ${result.deletedCount} sell submissions deleted by admin from IP: ${req.ip}`, {
      requestedIds: ids,
      actualDeleted: result.deletedCount
    });
    
    res.json({ 
      success: true, 
      message: `${result.deletedCount} submissions deleted successfully`,
      data: result
    });
  } catch (error) {
    logger.error('Bulk delete submissions error:', {
      error: error.message,
      stack: error.stack,
      requestedIds: req.body.ids,
      ip: req.ip
    });
    
    // Handle specific errors
    if (error.message.includes('Invalid ID format')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'Failed to establish MongoDB connection') {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete submissions. Please try again later.'
    });
  }
};