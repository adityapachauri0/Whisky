// Simple script to create a diagnostic file on the server
// This will help us understand the server structure

const diagnosticCode = `
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Creating server diagnostic report...');

const report = [];
report.push('=== Whisky Server Diagnostic Report ===');
report.push('Generated: ' + new Date().toISOString());
report.push('');

// Current directory
report.push('Current Directory: ' + __dirname);
report.push('');

// Check common paths
const pathsToCheck = [
  '/var/www/viticultwhisky',
  '/home/nodeapp/whisky',
  '/root/whisky',
  '/var/www/whisky',
  '/opt/whisky'
];

report.push('=== Checking Common Paths ===');
pathsToCheck.forEach(p => {
  if (fs.existsSync(p)) {
    report.push('✓ EXISTS: ' + p);
    try {
      const stats = fs.statSync(p);
      report.push('  Type: ' + (stats.isDirectory() ? 'Directory' : 'File'));
      report.push('  Modified: ' + stats.mtime);
    } catch (e) {}
  } else {
    report.push('✗ NOT FOUND: ' + p);
  }
});

// Write report
const reportPath = path.join(__dirname, 'diagnostic-report.txt');
fs.writeFileSync(reportPath, report.join('\\n'));
console.log('Report saved to: ' + reportPath);

// Also try to run commands
exec('pm2 list', (err, stdout) => {
  if (!err) {
    fs.appendFileSync(reportPath, '\\n\\n=== PM2 Processes ===\\n' + stdout);
  }
  
  exec('find /var/www -name "*whisky*" -type d', (err2, stdout2) => {
    if (!err2) {
      fs.appendFileSync(reportPath, '\\n\\n=== Whisky Directories in /var/www ===\\n' + stdout2);
    }
    console.log('Diagnostic complete!');
  });
});
`;

console.log('=== Server Diagnostic Script ===');
console.log('Since SSH is blocked, here are your options:');
console.log('');
console.log('Option 1: If you have any file upload method:');
console.log('1. Save the code below as diagnostic.js');
console.log('2. Upload it to your server');
console.log('3. Run it somehow (maybe through PM2 or a temporary endpoint)');
console.log('');
console.log('Option 2: Contact your VPS provider');
console.log('Ask them to:');
console.log('- Check why SSH is blocked from your IP');
console.log('- Provide alternative access (web terminal, VNC, etc.)');
console.log('- Whitelist your IP address');
console.log('');
console.log('Option 3: Use a VPN');
console.log('Try connecting through a VPN to bypass the IP block');
console.log('');
console.log('Here is the diagnostic code:');
console.log('---START---');
console.log(diagnosticCode);
console.log('---END---');