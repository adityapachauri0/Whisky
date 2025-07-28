// Local Backend with Mock Form Data
// This shows how admin dashboard should work with real submissions

const express = require('express');
const cors = require('cors');
const app = express();

// CORS for local development
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

// Mock form submissions data
const mockContactSubmissions = [
  {
    _id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    message: 'Interested in whisky investment opportunities',
    createdAt: new Date('2024-01-15'),
    status: 'new'
  },
  {
    _id: '2', 
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    message: 'Would like consultation on rare scotch',
    createdAt: new Date('2024-01-14'),
    status: 'contacted'
  }
];

const mockSellSubmissions = [
  {
    _id: '1',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    whiskyDetails: 'Macallan 25 Year Old',
    estimatedValue: '£2500',
    condition: 'Excellent',
    createdAt: new Date('2024-01-13'),
    status: 'pending'
  }
];

const mockConsultationRequests = [
  {
    _id: '1',
    name: 'Emma Brown',
    email: 'emma@example.com',
    consultationType: 'Investment Strategy',
    budget: '£10,000-50,000',
    createdAt: new Date('2024-01-12'),
    status: 'scheduled'
  }
];

// Admin login endpoint
app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@viticultwhisky.co.uk' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        user: {
          email: 'admin@viticultwhisky.co.uk',
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Form submission endpoints
app.get('/api/admin/contact-submissions', (req, res) => {
  console.log('📋 Contact submissions requested');
  res.json({ success: true, data: mockContactSubmissions });
});

app.get('/api/admin/sell-submissions', (req, res) => {
  console.log('📋 Sell whisky submissions requested');
  res.json({ success: true, data: mockSellSubmissions });
});

app.get('/api/admin/consultation-requests', (req, res) => {
  console.log('📋 Consultation requests requested');
  res.json({ success: true, data: mockConsultationRequests });
});

// Export submissions endpoint
app.get('/api/admin/export/:type', (req, res) => {
  const { type } = req.params;
  let data = [];
  
  if (type === 'contacts') data = mockContactSubmissions;
  else if (type === 'sell') data = mockSellSubmissions;
  else if (type === 'consultations') data = mockConsultationRequests;
  
  console.log(`📤 Exporting ${type} data`);
  res.json({ success: true, data });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log('🚀 LOCAL BACKEND WITH FORM DATA RUNNING');
  console.log('======================================');
  console.log(`📡 API Server: http://localhost:${PORT}`);
  console.log('📋 Form submissions data loaded:');
  console.log(`   - Contact forms: ${mockContactSubmissions.length}`);
  console.log(`   - Sell whisky: ${mockSellSubmissions.length}`);
  console.log(`   - Consultations: ${mockConsultationRequests.length}`);
  console.log('');
  console.log('✅ Admin login: admin@viticultwhisky.co.uk / admin123');
  console.log('');
  console.log('🔍 Now test admin dashboard at: http://localhost:3000/admin/login');
});