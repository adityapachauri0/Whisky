#!/usr/bin/env node

/**
 * Admin User Setup Script
 * Creates admin user in MongoDB for production deployment
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`)
};

async function setupAdmin() {
  try {
    // Load environment variables
    require('dotenv').config();
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/viticult-whisky';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@viticultwhisky.co.uk';
    const ADMIN_PASSWORD = 'admin123'; // Default password
    
    log.info('Starting admin user setup...');
    log.info(`Connecting to MongoDB: ${MONGODB_URI}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    log.success('Connected to MongoDB successfully');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: ADMIN_EMAIL.toLowerCase(),
      role: 'admin' 
    });
    
    if (existingAdmin) {
      log.warning(`Admin user with email ${ADMIN_EMAIL} already exists`);
      
      // Update password hash if needed
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      existingAdmin.password = hashedPassword;
      existingAdmin.active = true;
      existingAdmin.loginAttempts = 0;
      existingAdmin.lockUntil = undefined;
      
      await existingAdmin.save({ validateBeforeSave: false });
      log.success('Existing admin user updated with fresh password');
    } else {
      // Create new admin user
      log.info('Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      const adminUser = new User({
        email: ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        active: true,
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await adminUser.save({ validateBeforeSave: false });
      log.success(`Admin user created successfully with email: ${ADMIN_EMAIL}`);
    }
    
    // Verify admin user
    const adminUser = await User.findOne({ 
      email: ADMIN_EMAIL.toLowerCase(),
      role: 'admin' 
    });
    
    if (adminUser) {
      log.success('Admin user verification passed');
      log.info(`Admin Details:`);
      console.log(`  Email: ${adminUser.email}`);
      console.log(`  Role: ${adminUser.role}`);
      console.log(`  Active: ${adminUser.active}`);
      console.log(`  Name: ${adminUser.firstName} ${adminUser.lastName}`);
    }
    
    log.success('Admin setup completed successfully!');
    log.info(`Default login credentials:`);
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    log.warning('Please change the default password after first login');
    
  } catch (error) {
    log.error(`Admin setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupAdmin();
}

module.exports = setupAdmin;