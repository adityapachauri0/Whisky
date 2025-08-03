const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create reusable transporter
const createTransporter = () => {
  // In production, use real SMTP settings
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // In development, use Ethereal Email (fake SMTP service)
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass'
    }
  });
};

// Email template wrapper
const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ViticultWhisky</title>
  <style>
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      color: #2c1810;
      background-color: #f9f7f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #1a0f08;
      color: #d4af37;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: normal;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1a0f08;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .content h3 {
      color: #1a0f08;
      font-size: 20px;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .content p {
      margin-bottom: 15px;
      font-size: 16px;
    }
    .content ul {
      margin-bottom: 20px;
    }
    .content li {
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      background-color: #d4af37;
      color: #1a0f08;
      padding: 12px 30px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 3px;
      margin-top: 20px;
    }
    .footer {
      background-color: #f9f7f4;
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
    strong {
      color: #1a0f08;
    }
    hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VITICULTWHISKY</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2024 ViticultWhisky. All rights reserved.</p>
      <p>
        <a href="https://viticult.co.uk">Visit our website</a> | 
        <a href="mailto:admin@viticult.co.uk">Contact us</a>
      </p>
      <p><small>This email was sent from ViticultWhisky. If you believe this was sent in error, please ignore this message.</small></p>
    </div>
  </div>
</body>
</html>
`;

// Send email function
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Email options
    const mailOptions = {
      from: `"ViticultWhisky" <${process.env.SMTP_USER || 'noreply@viticult.co.uk'}>`,
      to: options.to,
      subject: options.subject,
      html: emailTemplate(options.html),
      text: options.text || options.html.replace(/<[^>]*>/g, '') // Fallback plain text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent:', info.messageId);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    logger.error('Email sending error:', error);
    throw error;
  }
};

// Email templates
exports.emailTemplates = {
  welcome: (name) => `
    <h2>Welcome to ViticultWhisky</h2>
    <p>Dear ${name},</p>
    <p>Welcome to the world of premium whisky investment!</p>
    <p>We're thrilled to have you join our exclusive community of whisky enthusiasts and savvy investors.</p>
    <p>As a member of ViticultWhisky, you'll have access to:</p>
    <ul>
      <li>Carefully curated investment opportunities in rare and premium whiskys</li>
      <li>Expert market insights and analysis</li>
      <li>Personalized investment consultations</li>
      <li>Exclusive access to limited edition casks and bottles</li>
    </ul>
    <p>Ready to start your whisky investment journey?</p>
    <a href="https://viticult.co.uk/get-started" class="button">Get Started</a>
  `,
  
  investmentInquiry: (data) => `
    <h2>Thank You for Your Investment Inquiry</h2>
    <p>Dear ${data.name},</p>
    <p>We've received your inquiry about investing in whisky and are excited about the opportunity to work with you.</p>
    <p>Your investment profile:</p>
    <ul>
      <li><strong>Budget Range:</strong> ${data.budget}</li>
      <li><strong>Experience Level:</strong> ${data.experience}</li>
      <li><strong>Investment Goals:</strong> ${data.goals}</li>
    </ul>
    <p>One of our investment specialists will review your information and contact you within 24-48 hours to discuss your personalized investment strategy.</p>
    <p>In the meantime, feel free to explore our investment guide and market insights on our website.</p>
    <a href="https://viticult.co.uk/investment-guide" class="button">View Investment Guide</a>
  `
};