const crypto = require('crypto');

console.log('🔐 Generating secure secrets for production...\n');

// Generate random secrets
const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('base64').replace(/[/+=]/g, '');
};

console.log('# Add these to your .env.production file:\n');

// JWT Secret
console.log(`JWT_SECRET=${generateSecret(32)}`);

// Cookie Secret
console.log(`COOKIE_SECRET=${generateSecret(32)}`);

// Session Secret
console.log(`SESSION_SECRET=${generateSecret(32)}`);

// Encryption Key (exactly 32 chars)
const encKey = generateSecret(24).substring(0, 32);
console.log(`ENCRYPTION_KEY=${encKey}`);

// CSRF Secret
console.log(`CSRF_SECRET=${generateSecret(32)}`);

// Backup Encryption Key
console.log(`BACKUP_ENCRYPTION_KEY=${generateSecret(32)}`);

console.log('\n# Generate admin password hash:');
console.log('# Replace YOUR_STRONG_PASSWORD with a secure password');
console.log('# Run: node -e "console.log(require(\'bcryptjs\').hashSync(\'YOUR_STRONG_PASSWORD\', 12))"');

console.log('\n# MongoDB Connection String:');
console.log('# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/whisky-investment');
console.log('# For self-hosted: mongodb://username:password@hostname:27017/whisky-investment?authSource=admin&ssl=true');

console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('1. Use a password manager to generate the admin password');
console.log('2. Enable 2FA for all admin accounts');
console.log('3. Use different secrets for each environment');
console.log('4. Store these secrets in a secure secret management system');
console.log('5. Never commit .env files to version control');
console.log('6. Rotate secrets every 90 days');
console.log('7. Set up monitoring for failed login attempts');

console.log('\n✅ Secret generation complete!');