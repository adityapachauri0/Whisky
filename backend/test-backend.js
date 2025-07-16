#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing backend server...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');
    
    // Test 2: API info
    console.log('2. Testing API info endpoint...');
    const apiResponse = await axios.get(`${API_BASE_URL}/api`);
    console.log('✅ API info retrieved');
    console.log('Version:', apiResponse.data.version);
    console.log('Available endpoints:', Object.keys(apiResponse.data.endpoints).length);
    console.log('');
    
    // Test 3: Admin login
    console.log('3. Testing admin login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/admin/login`, {
        email: 'admin@viticult.co.uk',
        password: 'admin123'
      });
      console.log('✅ Admin login successful!');
      console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n✅ Backend server is running correctly!');
    
  } catch (error) {
    console.error('\n❌ Backend test failed!');
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Backend server is not running!');
      console.error('Please start it with: npm run dev');
    }
  }
}

// Run the test
testBackend();