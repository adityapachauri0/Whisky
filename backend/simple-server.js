const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const ExcelJS = require('exceljs');
const { generateInvestmentInquiryEmail } = require('./utils/emailTemplates');
const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Simple contact endpoint
app.post('/api/contact', (req, res) => {
  // Get IP address - check various headers for proxied requests
  const ipAddress = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    req.ip;
  
  // Clean up IP address (remove IPv6 prefix if present)
  const cleanIp = ipAddress?.replace(/^::ffff:/, '') || 'Unknown';
  
  const submissionData = {
    ...req.body,
    ipAddress: cleanIp,
    submittedAt: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'Unknown'
  };
  
  logger.info('Contact form submitted:', { 
    email: req.body.email, 
    ipAddress: cleanIp 
  });
  
  res.json({ 
    success: true, 
    message: 'Contact form received successfully',
    data: submissionData 
  });
});

// Mock admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  logger.info('Admin login attempt:', { email });
  
  // For demo purposes, accept any credentials
  if (email === 'admin@viticult.co.uk' && (password === 'admin123' || password === 'Admin@2025!Secure')) {
    res.json({ 
      success: true, 
      token: 'mock-admin-token-' + Date.now(),
      data: {
        user: {
          email: email,
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

// Mock data for Excel export
const mockContacts = [
  {
    _id: 'mock-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '020 7123 4567',
    subject: 'Investment Inquiry - Premium Package',
    message: 'I am interested in learning more about your premium whisky cask investment options.',
    investmentInterest: 'premium',
    preferredContactMethod: 'email',
    status: 'new',
    ipAddress: '185.123.45.67',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '',
    subject: 'Beginner Question',
    message: 'What is the minimum investment amount?',
    investmentInterest: 'starter',
    preferredContactMethod: 'email',
    status: 'contacted',
    ipAddress: '92.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Export endpoint - now returns CSV for Google Sheets
app.get('/api/auth/admin/export-submissions', async (req, res) => {
  try {
    logger.info('Export requested - generating CSV for Google Sheets');
    
    // Determine format from query parameter
    const format = req.query.format || 'csv'; // Default to CSV
    
    if (format === 'excel') {
      // Original Excel export code
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

    // Add mock data and any test submissions
    const allContacts = [...mockContacts];
    
    // Add the test submission we made earlier
    allContacts.push({
      _id: 'test-1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      subject: 'Test Submission',
      message: 'This is a test message to verify the backend is capturing form submissions correctly.',
      investmentInterest: 'not-sure',
      preferredContactMethod: 'email',
      status: 'new',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    allContacts.forEach(contact => {
      contactSheet.addRow({
        ...contact,
        createdAt: new Date(contact.createdAt).toLocaleString(),
        updatedAt: new Date(contact.updatedAt).toLocaleString()
      });
    });

    // Style the header row
    contactSheet.getRow(1).font = { bold: true };
    contactSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4A574' }
    };

    // Add Investment Inquiries sheet (empty for now)
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

    investmentSheet.getRow(1).font = { bold: true };
    investmentSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4A574' }
    };

    // Add Sell Whisky sheet (empty for now)
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
      
    } else {
      // CSV export for Google Sheets
      const allContacts = [...mockContacts];
      
      // Add the test submission
      allContacts.push({
        _id: 'test-1',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '1234567890',
        subject: 'Test Submission',
        message: 'This is a test message to verify the backend is capturing form submissions correctly.',
        investmentInterest: 'not-sure',
        preferredContactMethod: 'email',
        status: 'new',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Create CSV content
      const csvRows = [];
      
      // Headers
      csvRows.push([
        'ID',
        'Name',
        'Email',
        'Phone',
        'Subject',
        'Message',
        'Investment Interest',
        'Preferred Contact',
        'Status',
        'IP Address',
        'Submitted At',
        'Updated At'
      ].join(','));
      
      // Data rows
      allContacts.forEach(contact => {
        const row = [
          contact._id,
          `"${contact.name}"`,
          contact.email,
          `"${contact.phone || ''}"`,
          `"${contact.subject}"`,
          `"${(contact.message || '').replace(/"/g, '""')}"`, // Escape quotes
          contact.investmentInterest,
          contact.preferredContactMethod,
          contact.status,
          contact.ipAddress || 'Unknown',
          new Date(contact.createdAt).toLocaleString(),
          new Date(contact.updatedAt).toLocaleString()
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      
      // Set response headers for CSV
      const filename = `whisky-submissions-${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Send without BOM for better compatibility
      res.send(csvContent);
      
      logger.info(`CSV export completed: ${filename}`);
    }

  } catch (error) {
    logger.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export submissions'
    });
  }
});

// Email preview endpoint
app.post('/api/auth/admin/preview-email', (req, res) => {
  try {
    const { contact } = req.body;
    logger.info('Email preview requested for:', contact.email);
    
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
      message: 'Failed to generate email preview'
    });
  }
});

// Email send endpoint (mock for demo)
app.post('/api/auth/admin/send-email', (req, res) => {
  try {
    const { contact, subject, html } = req.body;
    logger.info('Email send requested to:', contact.email);
    
    // In production, this would use a service like SendGrid, AWS SES, etc.
    // For demo, we'll just log and return success
    logger.info('Email would be sent with subject:', subject);
    
    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: 'mock-' + Date.now()
    });
  } catch (error) {
    logger.error('Email send error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404
app.use((req, res) => {
  logger.warn('404 - Not found:', req.path);
  res.status(404).json({ error: 'Not found' });
});

const PORT = 5001;
app.listen(PORT, () => {
  logger.info(`Simple server running on port ${PORT}`);
  logger.info(`Test the server: http://localhost:${PORT}/api/health`);
});