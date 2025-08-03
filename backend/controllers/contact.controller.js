const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const getClientIp = require('../utils/getClientIp');
const mongoHandler = require('../utils/mongoConnectionHandler');

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
      ipAddress: await getClientIp(req),
      userAgent: req.get('user-agent')
    };

    console.log('Creating contact with data:', contactData);
    const contact = await Contact.create(contactData);
    console.log('Contact created successfully:', contact._id);
    
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
    const { id } = req.params;

    const result = await mongoHandler.safeDelete(Contact, id, 'contact');
    
    logger.info(`Contact deleted: ${result.deletedDocument.email} (ID: ${id}) by admin from IP: ${req.ip}`);

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: {
        deletedId: result.deletedId,
        deletedEmail: result.deletedDocument.email
      }
    });

  } catch (error) {
    logger.error('Delete contact error:', {
      error: error.message,
      stack: error.stack,
      contactId: req.params.id,
      ip: req.ip
    });
    
    // Handle specific errors
    if (error.message === 'Invalid document ID format') {
      return next(new AppError('Invalid contact ID format', 400));
    }

    if (error.message === 'Document not found') {
      return next(new AppError('Contact not found', 404));
    }
    
    if (error.message === 'Failed to establish MongoDB connection') {
      return next(new AppError('Database connection unavailable. Please try again later.', 503));
    }
    
    next(new AppError('Failed to delete contact. Please try again later.', 500));
  }
};

// Bulk delete contacts (admin only)
exports.bulkDeleteContacts = async (req, res, next) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return next(new AppError('Please provide an array of contact IDs to delete', 400));
    }

    const result = await mongoHandler.safeBulkDelete(Contact, ids, 'contacts');
    
    logger.info(`Bulk delete: ${result.deletedCount} contacts deleted by admin from IP: ${req.ip}`, {
      requestedIds: ids,
      actualDeleted: result.deletedCount
    });
    
    res.json({ 
      success: true, 
      message: `${result.deletedCount} contacts deleted successfully`,
      data: result
    });
  } catch (error) {
    logger.error('Bulk delete contacts error:', {
      error: error.message,
      stack: error.stack,
      requestedIds: req.body.ids,
      ip: req.ip
    });
    
    // Handle specific errors
    if (error.message.includes('Invalid ID format')) {
      return next(new AppError(error.message, 400));
    }
    
    if (error.message === 'Failed to establish MongoDB connection') {
      return next(new AppError('Database connection unavailable. Please try again later.', 503));
    }
    
    next(new AppError('Failed to delete contacts. Please try again later.', 500));
  }
};