# Analytics Setup Guide

This guide covers how to set up Google Tag Manager (GTM) and Google Search Console through the admin dashboard.

## 🎯 Overview

All analytics configurations are managed through the admin dashboard at `/admin` under the "Site Configuration" tab. This includes:
- Google Tag Manager (GTM)
- Google Search Console
- Google Analytics 4 (GA4)
- SEO Settings

## 🚀 Quick Start

### 1. Access Admin Dashboard
1. Go to `/admin/login`
2. Login with your admin credentials
3. Click on "Site Configuration" tab

### 2. Google Tag Manager Setup

#### Get Your GTM Container ID:
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account/container or use existing
3. Copy your container ID (format: `GTM-XXXXXXX`)

#### Configure in Dashboard:
1. In Site Configuration, find "Google Tag Manager" section
2. Enter your container ID
3. Click "Test" to validate format
4. Check "Enabled" checkbox
5. Click "Save Configuration"

#### What Happens:
- GTM script will be automatically injected on all pages
- No need to modify any HTML files
- Works with Content Security Policy (CSP)

### 3. Google Search Console Setup

#### Get Verification Code:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (website)
3. Choose "HTML tag" verification method
4. Copy ONLY the content value from the meta tag:
   ```html
   <meta name="google-site-verification" content="THIS_PART_ONLY" />
   ```

#### Configure in Dashboard:
1. In Site Configuration, find "Google Search Console" section
2. Paste the verification code (content value only)
3. Check "Enabled" checkbox
4. Click "Save Configuration"

#### Verify Your Site:
1. Go back to Google Search Console
2. Click "Verify"
3. Your site should be verified!

#### Submit Sitemap:
1. Copy the sitemap URL shown in dashboard: `https://yourdomain.com/api/config/sitemap.xml`
2. In Search Console, go to Sitemaps
3. Add the sitemap URL
4. Submit

### 4. Google Analytics 4 Setup

#### Get Measurement ID:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Admin → Data Streams → Your Web Stream
3. Copy Measurement ID (format: `G-XXXXXXXXXX`)

#### Configure in Dashboard:
1. Enter Measurement ID in "Google Analytics 4" section
2. Check "Enabled" checkbox
3. Save Configuration

## 📊 GTM Container Setup

Once GTM is enabled, set up these essential tags in your GTM container:

### 1. Google Analytics 4 Configuration Tag
- Tag Type: Google Analytics: GA4 Configuration
- Measurement ID: Your GA4 ID
- Trigger: All Pages

### 2. Page View Tracking
- Already configured automatically via the integration

### 3. Custom Events to Track:

#### Calculator Usage
```javascript
dataLayer.push({
  event: 'calculator_used',
  investment_amount: 50000,
  holding_period: 5,
  expected_return: 12.5
});
```

#### Form Submissions
```javascript
dataLayer.push({
  event: 'form_submit',
  form_type: 'contact', // or 'sell_whisky'
  inquiry_type: 'investment'
});
```

#### CTA Clicks
```javascript
dataLayer.push({
  event: 'cta_click',
  cta_name: 'Get Started',
  cta_location: 'Hero Section'
});
```

## 🔧 Technical Details

### API Endpoints

#### Public Configuration
```
GET /api/config/public
```
Returns enabled services configuration for frontend.

#### Admin Configuration
```
GET /api/config/admin (Protected)
PUT /api/config/admin (Protected)
```
Get/update full configuration.

#### SEO Endpoints
```
GET /api/config/robots.txt
GET /api/config/sitemap.xml
```

### Frontend Integration

The frontend automatically:
1. Fetches configuration on app load
2. Injects GTM if enabled
3. Adds Search Console verification meta tag
4. Tracks page views and events

### Security

- Admin routes are protected with JWT authentication
- CSP headers are configured to allow GTM
- No sensitive data is exposed in public endpoints

## 🧪 Testing

### Test GTM Implementation:
1. Enable GTM Preview mode in your container
2. Visit your site
3. Check if tags fire correctly

### Test Search Console:
1. Use Google's URL Inspection tool
2. Check if your pages are indexed
3. Monitor coverage reports

### Browser Console:
```javascript
// Check if GTM is loaded
console.log(window.dataLayer);

// Manually push event
window.dataLayer.push({
  event: 'test_event',
  value: 123
});
```

## 🚨 Troubleshooting

### GTM Not Loading:
- Check if enabled in configuration
- Verify container ID format
- Check browser console for errors
- Ensure CSP allows GTM domains

### Search Console Not Verifying:
- Make sure you copied only the content value
- Check if meta tag appears in page source
- Try alternative verification methods

### Events Not Tracking:
- Use GTM Preview mode
- Check if dataLayer exists
- Verify event names match triggers

## 🔐 Privacy Considerations

1. Update Privacy Policy to mention:
   - Google Analytics usage
   - Cookie usage
   - Data collection practices

2. Consider implementing:
   - Cookie consent banner
   - Opt-out mechanism
   - Data retention policies

## 📝 Configuration Schema

```typescript
{
  gtm: {
    containerId: string,    // GTM-XXXXXXX
    enabled: boolean
  },
  searchConsole: {
    verificationCode: string,
    sitemapUrl: string,
    enabled: boolean
  },
  googleAnalytics: {
    measurementId: string,  // G-XXXXXXXXXX
    enabled: boolean
  },
  seo: {
    defaultTitle: string,
    defaultDescription: string,
    defaultKeywords: string[],
    robotsTxt: string
  }
}
```

## 🎉 Next Steps

1. Set up conversion tracking for key actions
2. Create custom audiences for remarketing
3. Set up goals and e-commerce tracking
4. Configure enhanced measurement
5. Create custom reports and dashboards

---

For support or questions about analytics setup, contact your development team.