#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// console.log('=== ViticultWhisky Admin Setup ===\n');

async function setupAdmin() {
  try {
    // Get admin email
    const email = await question('Enter admin email: ');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // console.error('Error: Invalid email format');
      process.exit(1);
    }

    // Get admin password
    const password = await question('Enter admin password (min 8 chars, must include uppercase, lowercase, number, and special char): ');
    
    // Validate password
    if (password.length < 8) {
      // console.error('Error: Password must be at least 8 characters long');
      process.exit(1);
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      // console.error('Error: Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      process.exit(1);
    }

    // Generate password hash
    // console.log('\nGenerating secure password hash...');
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate JWT secret
    // console.log('Generating JWT secret...');
    const jwtSecret = crypto.randomBytes(64).toString('hex');

    // Display environment variables
    // console.log('\n=== Environment Variables ===');
    // console.log('\nAdd these to your .env file:\n');
    // console.log(`ADMIN_EMAIL=${email}`);
    // console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
    // console.log(`JWT_SECRET=${jwtSecret}`);
    
    // console.log('\n=== Important Security Notes ===');
    // console.log('1. Never commit the .env file to version control');
    // console.log('2. Use different credentials for each environment (dev, staging, production)');
    // console.log('3. Regularly rotate your JWT secret');
    // console.log('4. Consider using a secrets management service in production');
    // console.log('5. Enable 2FA for admin accounts when possible');
    
    // console.log('\n✅ Admin setup complete!');

  } catch (error) {
    // console.error('Setup error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupAdmin();