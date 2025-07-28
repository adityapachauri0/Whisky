const { chromium } = require('playwright');

(async () => {
  console.log('🔐 Admin Login Verification\n');
  console.log('URL: https://viticultwhisky.co.uk/admin/login');
  console.log('Email: admin@viticultwhisky.co.uk');
  console.log('Password: admin123\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('📍 Opening login page...');
    await page.goto('https://viticultwhisky.co.uk/admin/login');
    await page.waitForTimeout(2000);
    
    console.log('✏️  Entering email...');
    await page.fill('input[type="email"]', 'admin@viticultwhisky.co.uk');
    
    console.log('🔑 Entering password...');
    await page.fill('input[type="password"]', 'admin123');
    
    console.log('🚀 Clicking login button...');
    await page.click('button[type="submit"]');
    
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(5000);
    
    const url = page.url();
    console.log('\n📊 Result:');
    console.log('Current URL:', url);
    
    if (url.includes('dashboard')) {
      console.log('✅ SUCCESS! You are logged in!');
      console.log('🎉 Admin dashboard is accessible');
      await page.screenshot({ path: 'admin-dashboard.png' });
      console.log('📸 Screenshot saved as admin-dashboard.png');
    } else {
      console.log('❌ Login failed - still on login page');
      const error = await page.$eval('.text-red-400', el => el.textContent).catch(() => 'No error message found');
      console.log('Error:', error);
      
      console.log('\n🔧 This means the frontend build needs to be deployed.');
      console.log('Please run the deployment commands shown above.');
    }
    
    console.log('\nPress Ctrl+C to close the browser...');
    await page.waitForTimeout(30000); // Keep browser open for 30 seconds
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();