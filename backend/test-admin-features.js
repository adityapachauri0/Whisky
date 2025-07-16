#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Admin credentials
const adminEmail = 'admin@viticult.co.uk';
const currentPassword = 'admin123';
const newPassword = 'newPassword123';

// Test admin features
async function testAdminFeatures() {
  try {
    console.log('🔐 Testing Admin Login...');
    
    // 1. Login as admin
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
      email: adminEmail,
      password: currentPassword
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful!');
    console.log('Token:', token.substring(0, 20) + '...');

    // 2. Test password change
    console.log('\n🔑 Testing Password Change...');
    try {
      const changePasswordResponse = await axios.post(
        `${API_BASE_URL}/auth/admin/change-password`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('✅ Password changed successfully!');
      console.log('Response:', changePasswordResponse.data);
      
      // Try logging in with new password
      console.log('\n🔐 Testing login with new password...');
      const newLoginResponse = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
        email: adminEmail,
        password: newPassword
      });
      
      console.log('✅ Login with new password successful!');
      
      // Change it back
      console.log('\n🔄 Changing password back to original...');
      await axios.post(
        `${API_BASE_URL}/auth/admin/change-password`,
        {
          currentPassword: newPassword,
          newPassword: currentPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${newLoginResponse.data.token}`
          }
        }
      );
      console.log('✅ Password restored to original!');
      
    } catch (error) {
      console.error('❌ Password change error:', error.response?.data || error.message);
    }

    // 3. Test Excel export
    console.log('\n📊 Testing Excel Export...');
    try {
      const exportResponse = await axios.get(
        `${API_BASE_URL}/auth/admin/export-submissions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer'
        }
      );
      
      console.log('✅ Excel export successful!');
      console.log('File size:', exportResponse.data.byteLength, 'bytes');
      console.log('Content-Type:', exportResponse.headers['content-type']);
      console.log('Filename:', exportResponse.headers['content-disposition']);
      
    } catch (error) {
      console.error('❌ Excel export error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run tests
console.log('🚀 Starting admin feature tests...\n');
testAdminFeatures();