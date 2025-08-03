const { chromium } = require('playwright');

async function checkCalculatorColors() {
  console.log('🎨 Checking Calculator Colors\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to How It Works page
    console.log('1️⃣ Navigating to How It Works page...');
    await page.goto('http://localhost:3000/how-it-works');
    await page.waitForLoadState('networkidle');
    
    // Click Investment Process tab
    console.log('\n2️⃣ Opening Investment Process tab...');
    const investmentTab = await page.locator('button:has-text("Investment Process")').first();
    await investmentTab.click();
    await page.waitForTimeout(1000);
    
    // Scroll to calculator
    const calculator = await page.locator('h3:has-text("Calculate Your Returns")').first();
    await calculator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Take screenshot of Investment Calculator
    await page.screenshot({ path: 'investment-calculator-colors.png', fullPage: false });
    console.log('   📸 Investment Calculator screenshot saved');
    
    // Now switch to ROI Calculator
    console.log('\n3️⃣ Opening ROI Calculator tab...');
    const roiTab = await page.locator('button:has-text("ROI Calculator")').first();
    await roiTab.click();
    await page.waitForTimeout(1000);
    
    // Scroll to ROI calculator
    const roiCalc = await page.locator('h3:has-text("Whisky Cask ROI Calculator")').first();
    if (await roiCalc.isVisible()) {
      await roiCalc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Take screenshot of ROI Calculator
      await page.screenshot({ path: 'roi-calculator-colors.png', fullPage: false });
      console.log('   📸 ROI Calculator screenshot saved');
    }
    
    // Take a full page screenshot
    await page.screenshot({ path: 'full-calculator-page.png', fullPage: true });
    console.log('\n   📸 Full page screenshot saved');
    
    console.log('\n🔍 Please check the screenshots to identify color issues');
    console.log('   Browser will remain open for 20 seconds...');
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'color-check-error.png' });
  } finally {
    await browser.close();
    console.log('\n✅ Color check completed!');
  }
}

// Run the check
checkCalculatorColors().catch(console.error);