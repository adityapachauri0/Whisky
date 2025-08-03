const { chromium } = require('playwright');

async function showSiteConfigDetailed() {
  console.log('🚀 Creating detailed Site Configuration demonstration\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 800
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // Create a complete demo page
    await page.goto('data:text/html,<!DOCTYPE html><html><head><title>Site Configuration Demo</title></head><body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;"></body></html>');
    
    // Create the full interface
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div style="min-height: 100vh; background: #f3f4f6;">
          <!-- Header -->
          <div style="background: #1a1a1a; color: white; padding: 16px 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 0; font-size: 24px; display: flex; align-items: center;">
                <span style="color: #d4af37; margin-right: 12px;">⚜️</span>
                ViticultWhisky Admin Dashboard
              </h1>
              <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-size: 14px; opacity: 0.8;">admin@viticultwhisky.com</span>
                <button style="background: #d4af37; color: #1a1a1a; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Logout</button>
              </div>
            </div>
          </div>
          
          <!-- Navigation Tabs -->
          <div style="background: white; border-bottom: 1px solid #e5e7eb;">
            <div style="max-width: 1400px; margin: 0 auto; display: flex; gap: 0;">
              <button style="padding: 16px 24px; border: none; background: none; font-size: 15px; font-weight: 500; color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent;">
                Contact Inquiries
              </button>
              <button style="padding: 16px 24px; border: none; background: none; font-size: 15px; font-weight: 500; color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent;">
                Sell Whisky Submissions
              </button>
              <button style="padding: 16px 24px; border: none; background: #f9fafb; font-size: 15px; font-weight: 600; color: #1a1a1a; cursor: pointer; border-bottom: 2px solid #d4af37;">
                ⚙️ Site Configuration
              </button>
            </div>
          </div>
          
          <!-- Main Content -->
          <div style="max-width: 1200px; margin: 32px auto; padding: 0 24px;">
            <div style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px;">
              <div style="display: flex; align-items: center; margin-bottom: 32px;">
                <svg style="width: 32px; height: 32px; color: #d4af37; margin-right: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h2 style="font-size: 28px; font-weight: bold; margin: 0;">Site Configuration</h2>
              </div>
              
              <div style="display: grid; gap: 24px;">
                <!-- Google Tag Manager -->
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; display: flex; align-items: center;">
                      <span style="margin-right: 8px;">🏷️</span> Google Tag Manager
                    </h3>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                      <input type="checkbox" checked style="width: 20px; height: 20px; margin-right: 8px; accent-color: #d4af37;">
                      <span style="font-size: 14px; font-weight: 500;">Enabled</span>
                    </label>
                  </div>
                  
                  <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">
                      Container ID
                    </label>
                    <div style="display: flex; gap: 12px;">
                      <input type="text" value="GTM-WHISKY1" 
                        style="flex: 1; padding: 10px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: monospace;">
                      <button style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; hover: opacity 0.9;">
                        Test Connection
                      </button>
                    </div>
                    <p style="font-size: 13px; color: #6b7280; margin-top: 6px;">
                      Get your container ID from Google Tag Manager dashboard
                    </p>
                  </div>
                  
                  <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px;">
                    <div style="display: flex; align-items: start;">
                      <svg style="width: 20px; height: 20px; color: #3b82f6; margin-right: 10px; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div style="font-size: 14px;">
                        <p style="font-weight: 500; color: #1e40af; margin: 0 0 4px 0;">✅ Implementation Status</p>
                        <p style="color: #3b82f6; margin: 0;">
                          GTM script will be automatically injected on all pages when enabled.<br>
                          Container ID: <code style="background: #eff6ff; padding: 2px 6px; border-radius: 4px; font-family: monospace;">GTM-WHISKY1</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Google Search Console -->
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; display: flex; align-items: center;">
                      <span style="margin-right: 8px;">🔍</span> Google Search Console
                    </h3>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                      <input type="checkbox" checked style="width: 20px; height: 20px; margin-right: 8px; accent-color: #d4af37;">
                      <span style="font-size: 14px; font-weight: 500;">Enabled</span>
                    </label>
                  </div>
                  
                  <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">
                      Verification Code (HTML Tag)
                    </label>
                    <input type="text" value="a1b2c3d4e5f6g7h8i9j0k1l2m3n4" 
                      style="width: 100%; padding: 10px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: monospace;">
                    <p style="font-size: 13px; color: #6b7280; margin-top: 6px;">
                      Only the content value from the meta tag (not the full tag)
                    </p>
                  </div>
                  
                  <div style="background: #d1fae5; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                    <p style="font-size: 14px; color: #065f46; margin: 0 0 8px 0; font-weight: 500;">
                      ✅ Verification meta tag will be added:
                    </p>
                    <code style="font-size: 13px; background: #f0fdf4; padding: 10px; border-radius: 4px; display: block; overflow-x: auto; font-family: monospace;">
                      &lt;meta name="google-site-verification" content="a1b2c3d4e5f6g7h8i9j0k1l2m3n4" /&gt;
                    </code>
                  </div>
                  
                  <div style="background: #f3f4f6; border-radius: 8px; padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                      <p style="font-size: 14px; font-weight: 500; margin: 0;">Sitemap URL:</p>
                      <button style="font-size: 13px; color: #3b82f6; background: none; border: none; cursor: pointer; display: flex; align-items: center; font-weight: 500;">
                        <svg style="width: 16px; height: 16px; margin-right: 4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        Copy URL
                      </button>
                    </div>
                    <code style="font-size: 13px; background: white; padding: 10px; border-radius: 4px; display: block; font-family: monospace; border: 1px solid #e5e7eb;">
                      https://viticultwhisky.com/api/config/sitemap.xml
                    </code>
                  </div>
                </div>
                
                <!-- Google Analytics 4 -->
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-size: 20px; font-weight: 600; margin: 0; display: flex; align-items: center;">
                      <span style="margin-right: 8px;">📊</span> Google Analytics 4
                    </h3>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                      <input type="checkbox" checked style="width: 20px; height: 20px; margin-right: 8px; accent-color: #d4af37;">
                      <span style="font-size: 14px; font-weight: 500;">Enabled</span>
                    </label>
                  </div>
                  
                  <div>
                    <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">
                      Measurement ID
                    </label>
                    <input type="text" value="G-WHISKY2024" 
                      style="width: 100%; padding: 10px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-family: monospace;">
                    <p style="font-size: 13px; color: #6b7280; margin-top: 6px;">
                      Found in GA4 Admin → Data Streams → Web Stream Details
                    </p>
                  </div>
                </div>
                
                <!-- SEO Settings -->
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background: #fafafa;">
                  <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">🌐</span> SEO Settings
                  </h3>
                  
                  <div style="display: grid; gap: 20px;">
                    <div>
                      <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">
                        Default Title
                      </label>
                      <input type="text" value="ViticultWhisky - Premium Cask Investment Platform" 
                        style="width: 100%; padding: 10px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px;">
                    </div>
                    
                    <div>
                      <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">
                        robots.txt Content
                      </label>
                      <textarea rows="8" style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: monospace; font-size: 13px; resize: vertical;">User-agent: *
Disallow: /admin
Disallow: /api/
Allow: /

# Sitemaps
Sitemap: https://viticultwhisky.com/api/config/sitemap.xml</textarea>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <p style="font-size: 13px; color: #6b7280; margin: 0;">
                          Accessible at: /api/config/robots.txt
                        </p>
                        <button style="font-size: 13px; color: #3b82f6; background: none; border: none; cursor: pointer; font-weight: 500;">
                          Preview robots.txt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Save Button -->
                <div style="display: flex; justify-content: flex-end; margin-top: 32px;">
                  <button style="padding: 14px 32px; background: #d4af37; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);">
                    💾 Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    console.log('✅ Site Configuration interface loaded!');
    console.log('\n📸 Taking screenshot...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'site-config-full-demo.png', fullPage: true });
    console.log('   Screenshot saved: site-config-full-demo.png');
    
    console.log('\n🎯 Key Features Demonstrated:');
    console.log('   • Google Tag Manager with container ID validation');
    console.log('   • Google Search Console verification');
    console.log('   • Google Analytics 4 integration');
    console.log('   • SEO settings and robots.txt editor');
    console.log('   • Enable/disable toggles for each service');
    console.log('   • Clean, professional admin interface');
    
    console.log('\n⏳ Browser will remain open for 30 seconds...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Demonstration completed!');
  }
}

showSiteConfigDetailed().catch(console.error);