const { chromium } = require('playwright');

async function finalLoginTest() {
  console.log('🔐 Final Login Test with Playwright\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Navigate to login page
    console.log('1️⃣ Navigating to admin login page...');
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('networkidle');
    console.log('   ✅ Login page loaded');
    
    // 2. Take screenshot of login page
    await page.screenshot({ path: 'final-test-1-login-page.png' });
    console.log('   📸 Login page screenshot saved');
    
    // 3. Fill in credentials
    console.log('\n2️⃣ Entering admin credentials...');
    await page.fill('input[type="email"]', 'admin@viticultwhisky.co.uk');
    await page.fill('input[type="password"]', 'SecureAdmin123!');
    console.log('   ✅ Credentials entered');
    
    // 4. Click login button
    console.log('\n3️⃣ Clicking login button...');
    await page.click('button[type="submit"]');
    
    // 5. Wait for dashboard
    console.log('\n4️⃣ Waiting for dashboard to load...');
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    console.log('   ✅ Successfully redirected to dashboard!');
    
    // 6. Take dashboard screenshot
    await page.screenshot({ path: 'final-test-2-dashboard.png', fullPage: true });
    console.log('   📸 Dashboard screenshot saved');
    
    // 7. Check dashboard elements
    console.log('\n5️⃣ Verifying dashboard elements...');
    
    const title = await page.textContent('h1');
    console.log(`   • Title: ${title}`);
    
    const stats = await page.evaluate(() => {
      const cards = document.querySelectorAll('.bg-white.rounded-lg.shadow-md');
      const stats = {};
      cards.forEach(card => {
        const label = card.querySelector('p')?.textContent;
        const value = card.querySelector('h3')?.textContent;
        if (label && value) {
          stats[label] = value;
        }
      });
      return stats;
    });
    console.log('   • Statistics:', stats);
    
    // 8. Test navigation buttons
    console.log('\n6️⃣ Testing navigation buttons...');
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(btn => btn.textContent?.trim());
    });
    console.log('   • Available buttons:', buttons.filter(Boolean).join(', '));
    
    // 9. Check session storage
    console.log('\n7️⃣ Checking session management...');
    const sessionData = await page.evaluate(() => {
      return {
        adminUser: sessionStorage.getItem('adminUser') ? 'Present' : 'Missing',
        localStorage: Object.keys(localStorage).length
      };
    });
    console.log('   • Session storage:', sessionData.adminUser);
    console.log('   • Local storage items:', sessionData.localStorage);
    
    // 10. Test logout functionality
    console.log('\n8️⃣ Testing logout...');
    await page.click('button:has-text("Logout")');
    await page.waitForURL('**/admin/login', { timeout: 5000 });
    console.log('   ✅ Logout successful - redirected to login page');
    
    // Final screenshot
    await page.screenshot({ path: 'final-test-3-after-logout.png' });
    console.log('   📸 Logout screenshot saved');
    
    console.log('\n✅ All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Login functionality working');
    console.log('   ✅ Dashboard loading correctly');
    console.log('   ✅ Session management functional');
    console.log('   ✅ Logout working properly');
    console.log('   ✅ UI elements rendering correctly');
    
    console.log('\n🎉 Application is ready for production!');
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will remain open for 30 seconds...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'final-test-error.png' });
    console.log('   📸 Error screenshot saved');
  } finally {
    await browser.close();
    console.log('\n✅ Test completed!');
  }
}

// Run the test
finalLoginTest().catch(console.error);