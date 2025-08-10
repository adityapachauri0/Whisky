#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/viticult-whisky');
    console.log('✅ Connected to MongoDB');
    
    const email = 'admin@viticultwhisky.co.uk';
    const newPassword = 'admin123';
    
    // Find or create admin user
    let admin = await User.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      // Create new admin user
      admin = new User({
        email: email.toLowerCase(),
        password: newPassword, // Pre-save hook will hash this
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        active: true
      });
    } else {
      // Update existing admin user
      admin.password = newPassword; // Pre-save hook will hash this
      admin.role = 'admin';
      admin.active = true;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
    }
    
    await admin.save();
    
    if (admin) {
      console.log('✅ Admin password reset successfully');
      console.log('Email:', email);
      console.log('Password:', newPassword);
      
      // Test the password
      const isValid = await bcrypt.compare(newPassword, admin.password);
      console.log('Password verification:', isValid ? '✅ PASSED' : '❌ FAILED');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdminPassword();