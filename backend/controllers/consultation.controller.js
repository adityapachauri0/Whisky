const Consultation = require('../models/Consultation');
const { sendEmail } = require('../utils/email');
const { validationResult } = require('express-validator');

// Create new consultation booking
exports.createConsultation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Create consultation
    const consultation = await Consultation.create(req.body);

    // Generate meeting details (in production, integrate with Calendly or similar)
    const meetingDetails = {
      date: new Date(consultation.preferredDate).toLocaleDateString(),
      time: consultation.preferredTime,
      timezone: consultation.timezone
    };

    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@whiskytradingco.com',
        subject: `New Consultation Booking - ${consultation.name}`,
        html: `
          <h2>New Consultation Request</h2>
          <p><strong>Name:</strong> ${consultation.name}</p>
          <p><strong>Email:</strong> ${consultation.email}</p>
          <p><strong>Phone:</strong> ${consultation.phone}</p>
          <p><strong>Preferred Date:</strong> ${meetingDetails.date}</p>
          <p><strong>Preferred Time:</strong> ${consultation.preferredTime}</p>
          <p><strong>Timezone:</strong> ${consultation.timezone}</p>
          <p><strong>Investment Budget:</strong> ${consultation.investmentBudget}</p>
          <p><strong>Experience Level:</strong> ${consultation.investmentExperience}</p>
          <p><strong>Interested In:</strong> ${consultation.interestedIn.join(', ')}</p>
          ${consultation.additionalInfo ? `<p><strong>Additional Info:</strong> ${consultation.additionalInfo}</p>` : ''}
        `
      });

      // Send confirmation email to user
      await sendEmail({
        to: consultation.email,
        subject: 'Consultation Booking Confirmation - ViticultWhisky',
        html: `
          <h2>Consultation Booking Confirmed</h2>
          <p>Dear ${consultation.name},</p>
          <p>Thank you for booking a consultation with ViticultWhisky. We're excited to discuss your whisky investment journey!</p>
          
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${meetingDetails.date}</li>
            <li><strong>Time:</strong> ${consultation.preferredTime}</li>
            <li><strong>Timezone:</strong> ${consultation.timezone}</li>
          </ul>
          
          <p>One of our investment specialists will contact you within 24 hours to confirm the exact meeting time and provide you with a meeting link or phone number.</p>
          
          <h3>What to Expect:</h3>
          <ul>
            <li>30-45 minute personalized consultation</li>
            <li>Overview of whisky investment opportunities</li>
            <li>Portfolio recommendations based on your budget and goals</li>
            <li>Q&A session to address all your questions</li>
          </ul>
          
          <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The ViticultWhisky Team</p>
        `
      });
    } catch (emailError) {
      // console.error('Email sending error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: {
        id: consultation._id,
        name: consultation.name,
        preferredDate: consultation.preferredDate,
        preferredTime: consultation.preferredTime
      }
    });

  } catch (error) {
    // console.error('Consultation creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book consultation. Please try again later.'
    });
  }
};

// Get all consultations (admin only)
exports.getAllConsultations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.preferredDate = {};
      if (startDate) query.preferredDate.$gte = new Date(startDate);
      if (endDate) query.preferredDate.$lte = new Date(endDate);
    }

    const consultations = await Consultation.find(query)
      .sort({ preferredDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Consultation.countDocuments(query);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    // console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve consultations'
    });
  }
};

// Update consultation status (admin only)
exports.updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }

    // Send email if status changed to confirmed
    if (updateData.status === 'confirmed' && updateData.meetingLink) {
      try {
        await sendEmail({
          to: consultation.email,
          subject: 'Consultation Confirmed - Meeting Details Inside',
          html: `
            <h2>Your Consultation is Confirmed!</h2>
            <p>Dear ${consultation.name},</p>
            <p>Your consultation has been confirmed. Here are your meeting details:</p>
            
            <h3>Meeting Information:</h3>
            <p><strong>Date:</strong> ${new Date(consultation.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${consultation.preferredTime}</p>
            <p><strong>Meeting Link:</strong> <a href="${updateData.meetingLink}">${updateData.meetingLink}</a></p>
            
            <p>Please join the meeting 5 minutes early to ensure everything is working properly.</p>
            
            <p>Best regards,<br>The ViticultWhisky Team</p>
          `
        });
      } catch (emailError) {
        // console.error('Confirmation email error:', emailError);
      }
    }

    res.json({
      success: true,
      data: consultation
    });

  } catch (error) {
    // console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update consultation'
    });
  }
};

// Get upcoming consultations reminder (for cron job)
exports.getUpcomingConsultations = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const consultations = await Consultation.find({
      preferredDate: {
        $gte: tomorrow,
        $lt: dayAfter
      },
      status: 'confirmed',
      reminderSent: false
    });

    // Send reminders
    for (const consultation of consultations) {
      try {
        await sendEmail({
          to: consultation.email,
          subject: 'Reminder: Your Whisky Investment Consultation Tomorrow',
          html: `
            <h2>Consultation Reminder</h2>
            <p>Dear ${consultation.name},</p>
            <p>This is a friendly reminder about your consultation tomorrow.</p>
            
            <h3>Meeting Details:</h3>
            <p><strong>Date:</strong> ${new Date(consultation.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${consultation.preferredTime}</p>
            ${consultation.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${consultation.meetingLink}">${consultation.meetingLink}</a></p>` : ''}
            
            <p>We look forward to speaking with you!</p>
            
            <p>Best regards,<br>The ViticultWhisky Team</p>
          `
        });

        // Mark reminder as sent
        consultation.reminderSent = true;
        await consultation.save();
      } catch (emailError) {
        // console.error('Reminder email error:', emailError);
      }
    }

    res.json({
      success: true,
      remindersCount: consultations.length
    });

  } catch (error) {
    // console.error('Get upcoming consultations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process consultation reminders'
    });
  }
};