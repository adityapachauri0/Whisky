const express = require('express');
const cors = require('cors');
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Simple contact endpoint
app.post('/api/contact', (req, res) => {
  console.log('Contact form submitted:', req.body);
  res.json({ 
    success: true, 
    message: 'Contact form received successfully',
    data: req.body 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404
app.use((req, res) => {
  console.log('404 - Not found:', req.path);
  res.status(404).json({ error: 'Not found' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Test the server: http://localhost:${PORT}/api/health`);
});