const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Whisky Investment Platform - Comprehensive Test Suite\n');
console.log('This will test all security features and functionality before deployment.\n');

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function checkPrerequisites() {
  console.log(`${colors.blue}📋 Checking Prerequisites...${colors.reset}\n`);
  
  try {
    // Check if servers are running
    const axios = require('axios');
    
    // Check backend
    try {
      await axios.get('http://localhost:5001/api/health');
      console.log(`${colors.green}✅ Backend server is running on port 5001${colors.reset}`);
    } catch (e) {
      console.log(`${colors.red}❌ Backend server is not running!${colors.reset}`);
      console.log(`   Run: cd backend && npm start\n`);
      return false;
    }
    
    // Check frontend
    try {
      await axios.get('http://localhost:3000');
      console.log(`${colors.green}✅ Frontend server is running on port 3000${colors.reset}`);
    } catch (e) {
      console.log(`${colors.red}❌ Frontend server is not running!${colors.reset}`);
      console.log(`   Run: cd frontend && npm start\n`);
      return false;
    }
    
    // Check MongoDB
    const mongoose = require('mongoose');
    try {
      await mongoose.connect('mongodb://localhost:27017/whisky-investment', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log(`${colors.green}✅ MongoDB is running${colors.reset}`);
      await mongoose.disconnect();
    } catch (e) {
      console.log(`${colors.yellow}⚠️  MongoDB connection warning${colors.reset}`);
      console.log(`   MongoDB might require authentication in production\n`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error checking prerequisites:${colors.reset}`, error.message);
    return false;
  }
}

async function runAllTests() {
  const startTime = Date.now();
  
  // Check prerequisites
  const ready = await checkPrerequisites();
  if (!ready) {
    console.log(`\n${colors.red}❌ Prerequisites not met. Please start all services and try again.${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`\n${colors.bright}Starting Test Suite...${colors.reset}\n`);
  
  const tests = [
    {
      name: 'Security Tests',
      file: 'test-security-playwright.js',
      description: 'Testing authentication, XSS, CORS, and security headers'
    },
    {
      name: 'Functionality Tests',
      file: 'test-functionality-playwright.js',
      description: 'Testing UI, forms, navigation, and user flows'
    },
    {
      name: 'API Security Tests',
      file: 'test-secure-auth.js',
      description: 'Testing httpOnly cookies and secure authentication'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n${colors.blue}▶️  Running ${test.name}${colors.reset}`);
    console.log(`   ${test.description}\n`);
    
    try {
      await runCommand('node', [test.file]);
      passed++;
      console.log(`\n${colors.green}✅ ${test.name} PASSED${colors.reset}`);
    } catch (error) {
      failed++;
      console.log(`\n${colors.red}❌ ${test.name} FAILED${colors.reset}`);
    }
    
    console.log('\n' + '='.repeat(80));
  }
  
  // Final Report
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`\n${colors.bright}📊 FINAL TEST REPORT${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`Total Tests Run: ${tests.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Time: ${totalTime}s`);
  
  if (failed === 0) {
    console.log(`\n${colors.green}${colors.bright}🎉 ALL TESTS PASSED!${colors.reset}`);
    console.log(`\n${colors.green}✅ Application is secure and ready for deployment!${colors.reset}`);
    
    console.log(`\n${colors.yellow}📝 Next Steps:${colors.reset}`);
    console.log('1. Review SECURITY-CLEANUP.md and remove sensitive files');
    console.log('2. Commit your changes (excluding .env files)');
    console.log('3. Follow DEPLOYMENT-CHECKLIST.md for VPS deployment');
    console.log('4. Enable MongoDB authentication on VPS (see MONGODB-SETUP.md)');
  } else {
    console.log(`\n${colors.red}⚠️  Some tests failed. Please fix issues before deployment.${colors.reset}`);
  }
}

// Install Playwright if needed
async function ensurePlaywright() {
  try {
    require('playwright');
  } catch (e) {
    console.log(`${colors.yellow}Installing Playwright...${colors.reset}`);
    await runCommand('npm', ['install', 'playwright']);
  }
}

// Main execution
(async () => {
  try {
    await ensurePlaywright();
    await runAllTests();
  } catch (error) {
    console.error(`\n${colors.red}Test suite error:${colors.reset}`, error.message);
    process.exit(1);
  }
})();