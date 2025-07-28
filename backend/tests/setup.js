// Test setup file
const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing';
process.env.SESSION_SECRET = 'test-session-secret-for-testing';
process.env.CSRF_SECRET = 'test-csrf-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/viticultwhisky-test';

// Increase test timeout
jest.setTimeout(30000);

// Clean up after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});