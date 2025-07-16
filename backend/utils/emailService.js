const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production email service (e.g., SendGrid, AWS SES)
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Development email service (Mailtrap or similar)
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
          user: process.env.EMAIL_USERNAME || 'test',
          pass: process.env.EMAIL_PASSWORD || 'test',
        },
      });
    }

    // Verify transporter
    this.transporter.verify((error, success) => {
      if (error) {
        logger.error('Email service error:', error);
      } else {
        logger.info('Email service ready');
      }
    });
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'ViticultWhisky'} <${process.env.EMAIL_FROM || 'noreply@viticult.co.uk'}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a0f08; color: #d4af37; padding: 20px; text-align: center; }
          .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #d4af37; color: #1a0f08; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ViticultWhisky</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for registering with ViticultWhisky. To complete your registration and access our exclusive whisky investment opportunities, please verify your email address.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ViticultWhisky. All rights reserved.</p>
            <p>3rd Floor, 35 Artillery Lane, London, E1 7LP</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - ViticultWhisky',
      text: `Welcome to ViticultWhisky! Please verify your email by visiting: ${verificationUrl}`,
      html,
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a0f08; color: #d4af37; padding: 20px; text-align: center; }
          .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #d4af37; color: #1a0f08; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ViticultWhisky</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            <div class="warning">
              <p><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ViticultWhisky. All rights reserved.</p>
            <p>3rd Floor, 35 Artillery Lane, London, E1 7LP</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset - ViticultWhisky',
      text: `Reset your password by visiting: ${resetUrl}. This link expires in 1 hour.`,
      html,
    });
  }

  async sendContactFormEmail(data) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a0f08; color: #d4af37; padding: 20px; text-align: center; }
          .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Investment Interest:</div>
              <div class="value">${data.investmentInterest || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Preferred Contact Method:</div>
              <div class="value">${data.preferredContactMethod || 'Email'}</div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message}</div>
            </div>
            <div class="field">
              <div class="label">Submitted at:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin
    await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@viticult.co.uk',
      subject: `New Contact Form Submission - ${data.subject}`,
      text: `New contact form submission from ${data.name} (${data.email})`,
      html,
    });

    // Send confirmation to user
    await this.sendContactConfirmationEmail(data.email, data.name);
  }

  async sendContactConfirmationEmail(email, name) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a0f08; color: #d4af37; padding: 20px; text-align: center; }
          .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to ViticultWhisky. We've received your message and one of our investment specialists will get back to you within 24-48 hours.</p>
            <p>In the meantime, feel free to explore our website to learn more about whisky cask investment opportunities.</p>
            <p>Best regards,<br>The ViticultWhisky Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ViticultWhisky. All rights reserved.</p>
            <p>3rd Floor, 35 Artillery Lane, London, E1 7LP</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Thank You for Contacting ViticultWhisky',
      text: `Dear ${name}, Thank you for contacting us. We'll get back to you within 24-48 hours.`,
      html,
    });
  }

  async sendInvestmentConfirmationEmail(email, investmentData) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a0f08; color: #d4af37; padding: 20px; text-align: center; }
          .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
          .investment-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Investment Confirmation</h1>
          </div>
          <div class="content">
            <h2>Your Investment is Being Processed</h2>
            <p>Thank you for your investment in premium whisky casks. Your investment details are being reviewed by our team.</p>
            <div class="investment-details">
              <h3>Investment Summary:</h3>
              <p><strong>Package:</strong> ${investmentData.package}</p>
              <p><strong>Amount:</strong> €${investmentData.amount.toLocaleString()}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Reference:</strong> ${investmentData.reference}</p>
            </div>
            <p>Next steps:</p>
            <ol>
              <li>Our team will review your investment within 24 hours</li>
              <li>You'll receive a detailed investment agreement</li>
              <li>Once signed, we'll process your payment</li>
              <li>You'll receive your cask ownership certificate</li>
            </ol>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ViticultWhisky. All rights reserved.</p>
            <p>Investment opportunities are subject to terms and conditions.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Investment Confirmation - ViticultWhisky',
      text: `Your investment in ${investmentData.package} for €${investmentData.amount} is being processed.`,
      html,
    });
  }
}

module.exports = new EmailService();