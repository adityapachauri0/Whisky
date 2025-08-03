const { chromium } = require('playwright');

async function checkInputVisibility() {
  console.log('🔍 Checking Input Text Visibility\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to calculator
    await page.goto('http://localhost:3000/how-it-works');
    await page.waitForLoadState('networkidle');
    
    // Click Investment Process tab
    await page.locator('button:has-text("Investment Process")').click();
    await page.waitForTimeout(1000);
    
    // Scroll to calculator
    const calculator = await page.locator('h3:has-text("Calculate Your Returns")').first();
    await calculator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    console.log('Checking Investment Amount Input:');
    console.log('================================');
    
    // Get the investment input
    const investmentInput = await page.locator('input[type="text"]').first();
    
    // Check computed styles
    const styles = await investmentInput.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        value: el.value,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        opacity: computed.opacity,
        visibility: computed.visibility,
        display: computed.display,
        fontSize: computed.fontSize,
        border: computed.border,
        padding: computed.padding
      };
    });
    
    console.log('\n📊 Input Element Analysis:');
    console.log(`   • Current Value: "${styles.value}"`);
    console.log(`   • Text Color: ${styles.color}`);
    console.log(`   • Background: ${styles.backgroundColor}`);
    console.log(`   • Opacity: ${styles.opacity}`);
    console.log(`   • Visibility: ${styles.visibility}`);
    console.log(`   • Display: ${styles.display}`);
    console.log(`   • Font Size: ${styles.fontSize}`);
    
    // Test if text is visible by checking contrast
    const isVisible = await investmentInput.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const color = computed.color;
      const bgColor = computed.backgroundColor;
      
      // Check if element is visible
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                          rect.bottom <= window.innerHeight && 
                          rect.right <= window.innerWidth;
      
      return {
        hasValue: el.value.length > 0,
        isInViewport,
        offsetWidth: el.offsetWidth,
        offsetHeight: el.offsetHeight,
        colorRgb: color,
        bgColorRgb: bgColor
      };
    });
    
    console.log('\n🎯 Visibility Check:');
    console.log(`   • Has Value: ${isVisible.hasValue}`);
    console.log(`   • In Viewport: ${isVisible.isInViewport}`);
    console.log(`   • Width: ${isVisible.offsetWidth}px`);
    console.log(`   • Height: ${isVisible.offsetHeight}px`);
    console.log(`   • Text Color RGB: ${isVisible.colorRgb}`);
    console.log(`   • Background RGB: ${isVisible.bgColorRgb}`);
    
    // Try to fix visibility by applying high contrast styles
    console.log('\n🔧 Applying high contrast fix...');
    await investmentInput.evaluate(el => {
      el.style.color = '#FFFFFF !important';
      el.style.backgroundColor = '#000000 !important';
      el.style.fontSize = '18px !important';
      el.style.fontWeight = 'bold !important';
    });
    
    await page.waitForTimeout(1000);
    
    // Move slider to test
    const slider = await page.locator('input[type="range"][max="100000"]').first();
    await slider.fill('35000');
    await page.waitForTimeout(1000);
    
    // Check value after fix
    const afterFix = await investmentInput.inputValue();
    console.log(`\n✅ After contrast fix, input shows: "${afterFix}"`);
    
    // Take screenshots
    await page.screenshot({ path: 'input-visibility-check.png' });
    console.log('\n📸 Screenshot saved: input-visibility-check.png');
    
    // Reset and try another fix
    console.log('\n🔧 Testing alternative fix...');
    await investmentInput.evaluate(el => {
      el.removeAttribute('style');
      el.classList.add('!text-white', '!bg-black');
    });
    
    console.log('\n💡 Possible Solutions:');
    console.log('   1. The text color might be too similar to background');
    console.log('   2. CSS classes might be overriding text visibility');
    console.log('   3. Browser might have custom styles or extensions');
    
    console.log('\n   Browser remains open for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the check
checkInputVisibility().catch(console.error);