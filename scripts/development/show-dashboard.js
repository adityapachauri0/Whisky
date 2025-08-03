const { chromium } = require('playwright');

async function showDashboard() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to login
  await page.goto('http://localhost:3000/admin/login');
  await page.waitForLoadState('networkidle');
  
  // Login
  await page.fill('input[type="email"]', 'admin@viticultwhisky.co.uk');
  await page.fill('input[type="password"]', 'SecureAdmin123!');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard
  await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'dashboard-view.png', fullPage: true });
  
  console.log('Dashboard loaded successfully!');
  console.log('Screenshot saved as dashboard-view.png');
  console.log('\nKeeping browser open...');
  
  // Keep open
  await page.waitForTimeout(60000);
  await browser.close();
}

showDashboard().catch(console.error);