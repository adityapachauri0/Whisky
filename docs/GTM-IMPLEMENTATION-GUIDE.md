# Google Tag Manager Implementation Guide

## 1. Where GTM Scripts Are Added

The GTM scripts have been added to `/frontend/public/index.html`:

1. **Head Script** - Right before `</head>` tag
2. **Body Script (noscript)** - Right after `<body>` tag

## 2. Setup Steps

### Step 1: Get Your GTM Container ID
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create new account/container for your website
3. Copy your container ID (format: GTM-XXXXXXX)

### Step 2: Replace the Placeholder
In `/frontend/public/index.html`, replace `GTM-XXXXXXX` with your actual container ID in both locations:
- Line 40 (JavaScript code)
- Line 45 (noscript iframe)

### Step 3: Use GTM Events in Your Components

Import and use the GTM helper functions from `/frontend/src/utils/gtm.js`:

```javascript
import { GTMEvents } from '../utils/gtm';

// Example: Track calculator usage
const handleCalculate = () => {
  GTMEvents.calculatorUsed(investmentAmount, holdingPeriod, expectedReturn);
};

// Example: Track form submission
const handleFormSubmit = (formData) => {
  GTMEvents.contactFormSubmit(formData);
  // ... rest of form submission logic
};

// Example: Track CTA clicks
const handleCTAClick = () => {
  GTMEvents.ctaClick('Get Started', 'Hero Section');
  // ... navigation logic
};
```

## 3. Common Events to Track

### Investment Calculator
```javascript
// In InvestmentCalculator.tsx
useEffect(() => {
  if (investmentAmount && holdingPeriod && expectedReturn) {
    GTMEvents.calculatorUsed(investmentAmount, holdingPeriod, expectedReturn);
  }
}, [investmentAmount, holdingPeriod, expectedReturn]);
```

### Contact Form
```javascript
// In Contact component
const handleSubmit = async (e) => {
  e.preventDefault();
  GTMEvents.contactFormSubmit({
    inquiryType: formData.inquiryType,
    // Don't send PII to GTM
  });
  // ... submit logic
};
```

### Navigation Tracking
```javascript
// In Header component
const handleNavClick = (item) => {
  GTMEvents.navigationClick(item.name, item.path);
};
```

## 4. GTM Container Configuration

In your GTM container, create these tags:

### Google Analytics 4 Configuration
1. Create GA4 Configuration tag
2. Add your GA4 Measurement ID
3. Trigger on All Pages

### Conversion Tracking
1. **Calculator Usage**: Track when users interact with ROI calculator
2. **Form Submissions**: Track contact and sell whisky forms
3. **CTA Clicks**: Track "Get Started", "Learn More" buttons

### Custom Events
Set up triggers for:
- `calculator_used`
- `form_submit`
- `contact_form_submit`
- `sell_whisky_submit`
- `cta_click`

## 5. Testing Your Implementation

1. **GTM Preview Mode**:
   - Click "Preview" in GTM
   - Navigate your site
   - Verify events fire correctly

2. **Browser Console**:
   ```javascript
   // Check if dataLayer exists
   console.log(window.dataLayer);
   ```

3. **Google Tag Assistant**:
   - Install Chrome extension
   - Verify tags fire correctly

## 6. Privacy Considerations

1. **Cookie Consent**: Implement cookie consent banner
2. **Privacy Policy**: Update to mention GTM/GA usage
3. **Data Minimization**: Don't send PII to GTM

## 7. Environment-Specific Configuration

For different environments, you can use environment variables:

```bash
# .env.production
REACT_APP_GTM_ID=GTM-PROD123

# .env.development
REACT_APP_GTM_ID=GTM-DEV456
```

Then dynamically load GTM:
```javascript
// In App.tsx
import { initGTM } from './utils/gtm';

useEffect(() => {
  if (process.env.NODE_ENV === 'production') {
    initGTM();
  }
}, []);
```

## 8. Common GTM Variables to Create

1. **Click Text**: For tracking button/link text
2. **Click Classes**: For identifying specific elements
3. **Page Path**: For page-based triggers
4. **Scroll Depth**: For engagement tracking
5. **Form ID**: For form-specific tracking

## 9. Recommended Tags

1. **Page View** - GA4
2. **Scroll Tracking** - 25%, 50%, 75%, 100%
3. **Time on Page** - Engagement metrics
4. **Outbound Link Clicks** - External links
5. **File Downloads** - PDF brochures, etc.

## 10. Debug Tips

- Use `dataLayer.push({'event': 'test'})` in console
- Check Network tab for gtm.js requests
- Verify in GA4 Real-time reports
- Use GTM Preview & Debug mode