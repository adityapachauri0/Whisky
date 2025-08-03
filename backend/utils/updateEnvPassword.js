const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Update password hash in .env file
 * @param {string} newHash - The new bcrypt password hash
 * @returns {boolean} - Success status
 */
function updateEnvPassword(newHash) {
  try {
    // Determine which env file to update based on NODE_ENV
    const envFile = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, '../.env.production')
      : path.join(__dirname, '../.env');
    
    // Check if file exists
    if (!fs.existsSync(envFile)) {
      logger.error(`Environment file not found: ${envFile}`);
      return false;
    }
    
    // Read current file
    let envContent = fs.readFileSync(envFile, 'utf8');
    
    // Create backup
    const backupFile = `${envFile}.backup-${Date.now()}`;
    fs.writeFileSync(backupFile, envContent);
    logger.info(`Backup created: ${backupFile}`);
    
    // Update password hash
    const regex = /^ADMIN_PASSWORD_HASH=.*/m;
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `ADMIN_PASSWORD_HASH=${newHash}`);
    } else {
      // Add if not exists
      envContent += `\nADMIN_PASSWORD_HASH=${newHash}`;
    }
    
    // Write updated content
    fs.writeFileSync(envFile, envContent);
    
    // Update process.env immediately
    process.env.ADMIN_PASSWORD_HASH = newHash;
    
    logger.info('Password hash updated successfully in environment file');
    return true;
    
  } catch (error) {
    logger.error('Failed to update environment file:', error);
    return false;
  }
}

module.exports = updateEnvPassword;