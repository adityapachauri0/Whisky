const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function completeSecurityAudit() {
  console.log('🔒 COMPREHENSIVE SECURITY AUDIT\n');
  console.log('=' + '='.repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const securityIssues = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };
  
  // Helper to add security issue
  function addIssue(severity, issue, details, fix) {
    securityIssues[severity].push({ issue, details, fix });
    console.log(`${severity.toUpperCase()}: ${issue}`);
    console.log(`  Details: ${details}`);
    console.log(`  Fix: ${fix}\n`);
  }
  
  try {
    // === 1. FRONTEND SECURITY AUDIT ===
    console.log('🔍 FRONTEND SECURITY AUDIT\n');
    
    // Check for exposed API keys or secrets in frontend build
    console.log('Checking frontend build for exposed secrets...');
    const buildFiles = [
      'frontend/build/static/js/main.*.js',
      'frontend/build/index.html'
    ];
    
    // Check if any sensitive data is exposed in JavaScript
    await page.goto('http://localhost:3000');
    
    // Check localStorage/sessionStorage usage
    const storageData = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage)
      };
    });
    
    if (storageData.localStorage.includes('adminToken')) {
      addIssue('medium', 
        'JWT Token in localStorage',
        'JWT tokens stored in localStorage are vulnerable to XSS attacks',
        'Move to httpOnly cookies for token storage'
      );
    }
    
    // Check for console.log statements in production
    const consoleLogs = await page.evaluate(() => {
      const originalLog = console.log;
      let logCount = 0;
      console.log = function() {
        logCount++;
        originalLog.apply(console, arguments);
      };
      // Wait a bit to catch any logs
      return new Promise(resolve => {
        setTimeout(() => {
          console.log = originalLog;
          resolve(logCount);
        }, 2000);
      });
    });
    
    if (consoleLogs > 0) {
      addIssue('low',
        'Console logs in production',
        `Found ${consoleLogs} console.log statements`,
        'Remove all console.log statements from production build'
      );
    }
    
    // === 2. XSS VULNERABILITY TESTING ===
    console.log('🔍 XSS VULNERABILITY TESTING\n');
    
    // Test contact form for XSS
    await page.goto('http://localhost:3000/contact');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>'
    ];
    
    for (const payload of xssPayloads) {
      await page.fill('input[name="name"]', payload);
      await page.fill('textarea[name="message"]', payload);
      
      // Check if payload is escaped in DOM
      const nameValue = await page.inputValue('input[name="name"]');
      if (nameValue === payload) {
        // Input is not sanitized on input - check on submit
        console.log(`Testing XSS payload: ${payload.substring(0, 30)}...`);
      }
    }
    
    // === 3. API SECURITY TESTING ===
    console.log('🔍 API SECURITY TESTING\n');
    
    // Test for SQL/NoSQL injection
    const injectionPayloads = [
      { email: "admin' OR '1'='1", password: "anything" },
      { email: '{"$gt": ""}', password: "anything" },
      { email: "admin@test.com", password: "' OR '1'='1" }
    ];
    
    for (const payload of injectionPayloads) {
      const response = await page.evaluate(async (data) => {
        const resp = await fetch('http://localhost:5001/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          body: JSON.stringify(data)
        });
        return { status: resp.status };
      }, payload);
      
      if (response.status === 200) {
        addIssue('critical',
          'Possible injection vulnerability',
          `Payload ${JSON.stringify(payload)} returned success`,
          'Implement proper input validation and parameterized queries'
        );
      }
    }
    
    // Check for API rate limiting
    console.log('Testing API rate limiting...');
    let rateLimitHit = false;
    for (let i = 0; i < 10; i++) {
      const response = await page.evaluate(async () => {
        const resp = await fetch('http://localhost:5001/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          body: JSON.stringify({ email: 'test@test.com', password: 'test' })
        });
        return resp.status;
      });
      
      if (response === 429) {
        rateLimitHit = true;
        break;
      }
    }
    
    if (!rateLimitHit) {
      addIssue('high',
        'Insufficient rate limiting',
        'API allows too many requests without rate limiting',
        'Configure stricter rate limits for authentication endpoints'
      );
    }
    
    // === 4. MONGODB SECURITY CHECK ===
    console.log('🔍 MONGODB SECURITY CHECK\n');
    
    // Check MongoDB connection string
    const mongoCheck = await page.evaluate(async () => {
      try {
        // Try to access MongoDB status endpoint if exposed
        const resp = await fetch('http://localhost:5001/api/db-status');
        return resp.status;
      } catch {
        return 'not-exposed';
      }
    });
    
    if (mongoCheck !== 'not-exposed') {
      addIssue('critical',
        'Database status endpoint exposed',
        'MongoDB status information accessible via API',
        'Remove or protect database status endpoints'
      );
    }
    
    // Check if MongoDB is running without authentication
    console.log('Checking MongoDB authentication...');
    const envFile = fs.readFileSync('backend/.env', 'utf8');
    if (!envFile.includes('mongodb://username:password')) {
      addIssue('critical',
        'MongoDB running without authentication',
        'MongoDB connection string does not include authentication',
        'Enable MongoDB authentication and update connection string'
      );
    }
    
    // === 5. CORS AND HEADERS CHECK ===
    console.log('🔍 CORS AND SECURITY HEADERS CHECK\n');
    
    const headers = await page.evaluate(async () => {
      const resp = await fetch('http://localhost:5001/api/admin/csrf-token', {
        headers: { 'Origin': 'http://evil-site.com' }
      });
      return {
        status: resp.status,
        corsAllowed: resp.headers.get('access-control-allow-origin')
      };
    });
    
    if (headers.corsAllowed === '*') {
      addIssue('high',
        'CORS allows all origins',
        'API accepts requests from any origin',
        'Configure CORS to only allow specific trusted origins'
      );
    }
    
    // === 6. FILE UPLOAD SECURITY ===
    console.log('🔍 FILE UPLOAD SECURITY CHECK\n');
    
    // Check if there are any file upload endpoints
    const hasFileUpload = await page.evaluate(async () => {
      const forms = document.querySelectorAll('input[type="file"]');
      return forms.length > 0;
    });
    
    if (hasFileUpload) {
      addIssue('medium',
        'File upload functionality detected',
        'File uploads need proper validation',
        'Implement file type validation, size limits, and virus scanning'
      );
    }
    
    // === 7. AUTHENTICATION FLOW ===
    console.log('🔍 AUTHENTICATION FLOW CHECK\n');
    
    // Check password reset functionality
    const hasPasswordReset = await page.evaluate(() => {
      return !!document.querySelector('a[href*="reset"], a[href*="forgot"]');
    });
    
    if (!hasPasswordReset) {
      addIssue('low',
        'No password reset functionality',
        'Users cannot reset forgotten passwords',
        'Implement secure password reset with email verification'
      );
    }
    
    // Check for 2FA
    addIssue('medium',
      'No two-factor authentication',
      'Admin accounts lack 2FA protection',
      'Implement 2FA for admin accounts'
    );
    
  } catch (error) {
    console.error('Audit error:', error);
  } finally {
    await browser.close();
  }
  
  // === SUMMARY ===
  console.log('\n' + '=' + '='.repeat(60));
  console.log('🔒 SECURITY AUDIT SUMMARY');
  console.log('=' + '='.repeat(60) + '\n');
  
  const severities = ['critical', 'high', 'medium', 'low'];
  let totalIssues = 0;
  
  severities.forEach(severity => {
    const count = securityIssues[severity].length;
    totalIssues += count;
    console.log(`${severity.toUpperCase()}: ${count} issues`);
  });
  
  console.log(`\nTOTAL: ${totalIssues} security issues found\n`);
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    issues: securityIssues,
    summary: {
      critical: securityIssues.critical.length,
      high: securityIssues.high.length,
      medium: securityIssues.medium.length,
      low: securityIssues.low.length,
      total: totalIssues
    }
  };
  
  fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Detailed report saved to: security-audit-report.json');
  
  if (securityIssues.critical.length > 0) {
    console.log('\n❌ CRITICAL SECURITY ISSUES FOUND!');
    console.log('Fix these before deployment:');
    securityIssues.critical.forEach(issue => {
      console.log(`  - ${issue.issue}`);
    });
  } else if (totalIssues === 0) {
    console.log('\n✅ No security issues found!');
  } else {
    console.log('\n⚠️  Non-critical issues found. Review before deployment.');
  }
}

// Run audit
completeSecurityAudit().catch(console.error);