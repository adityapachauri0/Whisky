#!/usr/bin/env node

require('dotenv').config();

// console.log('=== Verifying Environment Variables ===\n');

const required = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD_HASH'
];

const optional = [
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
  'FRONTEND_URL'
];

let allGood = true;

// console.log('Required Variables:');
required.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    let displayValue = value;
    if (varName.includes('SECRET') || varName.includes('PASSWORD') || varName.includes('HASH')) {
      displayValue = value.substring(0, 10) + '...' + (value.length > 10 ? ` (${value.length} chars)` : '');
    }
    // console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    // console.log(`❌ ${varName}: NOT SET`);
    allGood = false;
  }
});

// console.log('\nOptional Variables:');
optional.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'your-email@gmail.com' && value !== 'your-app-password') {
    // console.log(`✅ ${varName}: Configured`);
  } else {
    // console.log(`⚠️  ${varName}: Not configured (using example values)`);
  }
});

// console.log('\n=== Summary ===');
if (allGood) {
  // console.log('✅ All required environment variables are configured!');
  // console.log('\n🔐 Admin Login Credentials:');
  // console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
  // console.log('   Password: Admin@2025!Secure');
  // console.log('\n⚠️  Remember to change this password after first login!');
} else {
  // console.log('❌ Some required environment variables are missing.');
  // console.log('Please check your .env file.');
}

// console.log('\n📝 Note: Email configuration is optional for local development.');