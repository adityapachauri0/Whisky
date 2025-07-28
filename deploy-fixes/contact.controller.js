const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const getClientIp = require('../utils/getClientIp');

// Create new contact submission
exports.createContact = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Create contact with request data
    const contactData = {
      ...req.body,
      ipAddress: getClientIp(req),
      userAgent: req.get('user-agent')
    };

    const contact = await Contact.create(contactData);
    
    // Log IP address for debugging
    logger.info(`Contact form submitted by ${contactData.email} from IP: ${contactData.ipAddress}`);

    // Send email notifications
    try {
      await emailService.sendContactFormEmail(contactData);
      logger.info(`Email notification sent for ${contactData.email}`);
    } catch (emailError) {
      logger.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email
      }
    });

  } catch (error) {
    logger.error('Contact creation error:', error);
    next(new AppError('Failed to submit contact form. Please try again later.', 500));
  }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res, next) => {
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
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    let contacts = [];
    let total = 0;

    try {
      contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await Contact.countDocuments(query);
    } catch (dbError) {
      logger.warn('MongoDB not available, returning empty data');
      // Return empty data if MongoDB is not available
    }

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get contacts error:', error);
    next(new AppError('Failed to retrieve contacts', 500));
  }
};

// Get single contact (admin only)
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error('Get contact error:', error);
    next(error);
  }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { 
        status, 
        notes,
        respondedAt: status === 'responded' ? Date.now() : undefined
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    logger.error('Update contact error:', error);
    next(new AppError('Failed to update contact', 500));
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    logger.error('Delete contact error:', error);
    next(error);
  }
};