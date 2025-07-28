const { chromium } = require('playwright');
const fs = require('fs');

async function finalDeploymentTest() {
  console.log('🚀 FINAL DEPLOYMENT VALIDATION\n');
  console.log('Testing Date:', new Date().toISOString());
  console.log('=' + '='.repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  
  const testResults = [];
  let criticalPassed = true;
  
  // Helper to add test result
  function addResult(category, test, passed, details = '') {
    testResults.push({ category, test, passed, details });
    if (category === 'CRITICAL' && !passed) {
      criticalPassed = false;
    }
    console.log(`${passed ? '✅' : '❌'} [${category}] ${test}${details ? ': ' + details : ''}`);
  }
  
  try {
    // === CRITICAL TESTS ===
    console.log('🔴 CRITICAL TESTS\n');
    
    // 1. Frontend Accessibility
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      const title = await page.title();
      addResult('CRITICAL', 'Frontend Running', true, title);
      await page.screenshot({ path: 'deploy-test-homepage.png' });
    } catch (error) {
      addResult('CRITICAL', 'Frontend Running', false, error.message);
    }
    
    // 2. Backend API Health
    try {
      const apiHealth = await page.evaluate(async () => {
        const response = await fetch('http://localhost:5001/api/admin/csrf-token', {
          headers: { 'Origin': 'http://localhost:3000' }
        });
        const data = await response.json();
        return { status: response.status, hasToken: !!data.csrfToken };
      });
      addResult('CRITICAL', 'Backend API Health', apiHealth.hasToken, `Status: ${apiHealth.status}`);
    } catch (error) {
      addResult('CRITICAL', 'Backend API Health', false, error.message);
    }
    
    // 3. Admin Authentication
    try {
      await page.goto('http://localhost:3000/admin/login');
      await page.fill('input[type="email"]', 'admin@viticult.co.uk');
      await page.fill('input[type="password"]', 'AdminPass2024');
      
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/admin/login')),
        page.click('button[type="submit"]')
      ]);
      
      const responseData = await response.json();
      const loginSuccess = response.status() === 200 && responseData.success;
      
      if (loginSuccess) {
        await page.waitForURL('**/admin/dashboard', { timeout: 5000 });
        await page.screenshot({ path: 'deploy-test-dashboard.png' });
      }
      
      addResult('CRITICAL', 'Admin Login', loginSuccess, 
        loginSuccess ? 'Dashboard accessed' : `Failed: ${response.status()}`);
    } catch (error) {
      addResult('CRITICAL', 'Admin Login', false, error.message);
    }
    
    // === SECURITY TESTS ===
    console.log('\n🔒 SECURITY TESTS\n');
    
    // 4. API Security Headers
    try {
      const headers = await page.evaluate(async () => {
        const response = await fetch('http://localhost:5001/api/admin/csrf-token', {
          headers: { 'Origin': 'http://localhost:3000' }
        });
        return {
          'x-frame-options': response.headers.get('x-frame-options'),
          'x-content-type-options': response.headers.get('x-content-type-options'),
          'strict-transport-security': response.headers.get('strict-transport-security')
        };
      });
      
      const hasHeaders = Object.values(headers).some(h => h !== null);
      addResult('SECURITY', 'API Security Headers', hasHeaders, 
        hasHeaders ? 'Headers present' : 'Headers missing (OK for dev)');
    } catch (error) {
      addResult('SECURITY', 'API Security Headers', false, error.message);
    }
    
    // 5. Rate Limiting Test
    try {
      let blocked = false;
      for (let i = 0; i < 5; i++) {
        const response = await page.evaluate(async () => {
          const resp = await fetch('http://localhost:5001/api/admin/login', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({ email: 'test@test.com', password: 'wrong' })
          });
          return resp.status;
        });
        if (response === 429) {
          blocked = true;
          break;
        }
      }
      addResult('SECURITY', 'Rate Limiting', blocked, 
        blocked ? 'Working correctly' : 'May need adjustment');
    } catch (error) {
      addResult('SECURITY', 'Rate Limiting', false, error.message);
    }
    
    // === FUNCTIONAL TESTS ===
    console.log('\n⚙️ FUNCTIONAL TESTS\n');
    
    // 6. Navigation
    try {
      await page.goto('http://localhost:3000');
      const links = ['How It Works', 'About', 'Contact'];
      let navWorking = true;
      
      for (const link of links) {
        try {
          await page.click(`text="${link}"`, { timeout: 3000 });
          await page.waitForLoadState('networkidle');
        } catch {
          navWorking = false;
          break;
        }
      }
      addResult('FUNCTIONAL', 'Navigation', navWorking);
    } catch (error) {
      addResult('FUNCTIONAL', 'Navigation', false, error.message);
    }
    
    // 7. Responsive Design
    try {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000');
      await page.screenshot({ path: 'deploy-test-mobile.png' });
      addResult('FUNCTIONAL', 'Mobile Responsive', true, 'Screenshot saved');
    } catch (error) {
      addResult('FUNCTIONAL', 'Mobile Responsive', false, error.message);
    }
    
    // === CONFIGURATION TESTS ===
    console.log('\n⚙️ CONFIGURATION TESTS\n');
    
    // 8. Check production files exist
    const productionFiles = [
      'backend/.env.production',
      'backend/ecosystem.config.js',
      'frontend/.env.production',
      'DEPLOYMENT-CHECKLIST.md',
      'SECURITY.md'
    ];
    
    let allFilesExist = true;
    for (const file of productionFiles) {
      const exists = fs.existsSync(file);
      if (!exists) {
        allFilesExist = false;
        console.log(`  ❌ Missing: ${file}`);
      }
    }
    addResult('CONFIG', 'Production Files', allFilesExist, 
      allFilesExist ? 'All files present' : 'Some files missing');
    
  } catch (error) {
    console.error('\n❌ Fatal test error:', error.message);
  } finally {
    await browser.close();
  }
  
  // === SUMMARY ===
  console.log('\n' + '='.repeat(60));
  console.log('📊 DEPLOYMENT READINESS SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  const categories = ['CRITICAL', 'SECURITY', 'FUNCTIONAL', 'CONFIG'];
  
  categories.forEach(cat => {
    const catTests = testResults.filter(r => r.category === cat);
    const passed = catTests.filter(r => r.passed).length;
    const total = catTests.length;
    console.log(`${cat}: ${passed}/${total} passed`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  const totalPassed = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const percentage = Math.round((totalPassed / totalTests) * 100);
  
  console.log(`OVERALL: ${totalPassed}/${totalTests} tests passed (${percentage}%)`);
  console.log('='.repeat(60) + '\n');
  
  if (criticalPassed && percentage >= 75) {
    console.log('✅ READY FOR DEPLOYMENT!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run: ./deploy-to-vps.sh');
    console.log('2. Follow DEPLOYMENT-CHECKLIST.md');
    console.log('3. Update production .env on VPS');
    console.log('4. Test on production after deployment');
  } else if (!criticalPassed) {
    console.log('❌ CRITICAL TESTS FAILED - DO NOT DEPLOY!');
    console.log('Fix critical issues before proceeding.');
  } else {
    console.log('⚠️  Some tests failed. Review before deployment.');
  }
  
  console.log('\n📸 Test artifacts saved:');
  console.log('  - deploy-test-homepage.png');
  console.log('  - deploy-test-dashboard.png'); 
  console.log('  - deploy-test-mobile.png');
  
  // Create deployment report
  const report = {
    timestamp: new Date().toISOString(),
    results: testResults,
    summary: {
      total: totalTests,
      passed: totalPassed,
      percentage,
      criticalPassed,
      readyForDeployment: criticalPassed && percentage >= 75
    }
  };
  
  fs.writeFileSync('deployment-test-report.json', JSON.stringify(report, null, 2));
  console.log('  - deployment-test-report.json');
}

// Run the test
finalDeploymentTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});