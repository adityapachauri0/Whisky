# Master Troubleshooting Guide - ViticultWhisky

## Table of Contents
1. [Site Down - MIME Type & Build Issues](#site-down---mime-type--build-issues)
2. [Auto-Capture Not Working](#auto-capture-not-working)
3. [IP Address Not Recording](#ip-address-not-recording)
4. [Dashboard API Endpoint Issues](#dashboard-api-endpoint-issues)
5. [Build Deployment Issues](#build-deployment-issues)

---

## Site Down - MIME Type & Build Issues

### Problem
Site completely down showing blank page with "Unexpected token '<'" error. JavaScript and CSS files returning HTML content instead of actual files.

### Root Causes
1. **MIME Type Misconfiguration**: Nginx serving all files as text/html
2. **Missing Build Files**: React build folder missing critical files (index.html, static folder)
3. **Corrupted File Transfer**: Large tar files getting corrupted during SCP transfer

### Solution

#### 1. Fix Nginx Configuration
```nginx
# /etc/nginx/sites-available/viticultwhisky
server {
    listen 443 ssl http2;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;
    
    root /var/www/viticultwhisky/frontend/build;
    index index.html;
    
    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # React app - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 2. Rebuild Frontend Locally
```bash
cd /Users/adityapachauri/Desktop/Whisky/frontend
npm run build
```

#### 3. Deploy Using Rsync (Not SCP for large files)
```bash
# Use rsync instead of scp for reliable transfer
rsync -avz --progress build/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/

# Or transfer static files separately if main transfer fails
rsync -avz --progress build/static/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/static/
```

#### 4. Fix Permissions on Server
```bash
ssh root@31.97.57.193
cd /var/www/viticultwhisky/frontend
chown -R www-data:www-data build
chmod -R 755 build
nginx -s reload
```

### Verification
```bash
# Check if JS files are served correctly
curl -I https://viticultwhisky.co.uk/static/js/main.*.js
# Should return: Content-Type: application/javascript
```

---

## Auto-Capture Not Working

### Problem
Form data not being captured as users type in form fields.

### Root Cause
Auto-capture functionality was missing or not properly implemented in the frontend tracking code.

### Solution

#### 1. Implement Auto-Capture in Frontend
```javascript
// src/hooks/useFormTracking.ts
const captureFormField = useCallback(
  debounce((fieldName: string, value: string) => {
    axios.post('/api/tracking/capture', {
      visitorId: getVisitorId(),
      fieldName,
      value,
      timestamp: new Date().toISOString()
    });
  }, 500),
  []
);
```

#### 2. Backend Endpoint for Capture
```javascript
// backend/routes/tracking.js
router.post('/api/tracking/capture', async (req, res) => {
  const { visitorId, fieldName, value } = req.body;
  const ipAddress = getClientIp(req);
  
  await Visitor.findOneAndUpdate(
    { visitorId },
    { 
      $set: { 
        [`formData.${fieldName}`]: value,
        ipAddress,
        lastVisit: new Date()
      }
    },
    { upsert: true }
  );
});
```

### Verification
```javascript
// Test with Playwright
await page.type('[name="name"]', 'Test User');
// Check console for: "✅ Auto-saved name: Test User"
```

---

## IP Address Not Recording

### Problem
IP addresses showing as "Not recorded" in dashboard for captured visitors.

### Root Cause
Express app behind Nginx reverse proxy couldn't read real client IP from headers.

### Solution

#### 1. Create IP Extraction Utility
```javascript
// backend/utils/getClientIp.js
function getClientIp(req) {
  // Check nginx forwarded headers first
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Check x-real-ip header from nginx
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }
  
  // Fallback to direct connection
  return req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'Not recorded';
}
module.exports = getClientIp;
```

#### 2. Configure Express Trust Proxy
```javascript
// backend/server.js
app.set('trust proxy', true);
```

#### 3. Update Nginx Headers
```nginx
location /api {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Verification
```bash
# Check backend logs
pm2 logs whisky-backend
# Should show: "Captured email for visitor with IP: 124.123.34.84"
```

---

## Dashboard API Endpoint Issues

### Problem
Dashboard showing 0 visitors because it was fetching from `http://localhost:5001` instead of production API.

### Root Cause
Hardcoded localhost URL in Dashboard.tsx instead of using dynamic API configuration.

### Solution

#### 1. Fix Dashboard.tsx
```javascript
// src/pages/Admin/Dashboard.tsx
// WRONG:
const visitorResponse = await fetch('http://localhost:5001/api/tracking/captured-data');

// CORRECT:
import { buildApiEndpoint } from '../../config/api.config';
const apiEndpoint = buildApiEndpoint('tracking/captured-data');
const visitorResponse = await fetch(apiEndpoint);
```

#### 2. Smart API Configuration
```javascript
// src/config/api.config.js
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001/api';
  }
  
  if (hostname === 'viticultwhisky.co.uk' || hostname === 'www.viticultwhisky.co.uk') {
    return 'https://viticultwhisky.co.uk/api';
  }
  
  return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
};

export const API_URL = getApiUrl();
export const buildApiEndpoint = (endpoint) => {
  endpoint = endpoint.replace(/^\//, '').replace(/^api\//, '');
  return `${API_URL}/${endpoint}`;
};
```

### Verification
```javascript
// Check console in dashboard
console.log('Making API request to:', apiEndpoint);
// Should show: "https://viticultwhisky.co.uk/api/tracking/captured-data"
```

---

## Build Deployment Issues

### Problem
Build files not transferring properly to server, causing site to break.

### Root Causes
1. Large tar files (193MB) getting corrupted during SCP transfer
2. Mac metadata files (._*) interfering with Linux server
3. SSH connection timeouts during large transfers

### Solution

#### 1. Clean Build Before Transfer
```bash
# Remove Mac metadata files
find build -name "._*" -delete
```

#### 2. Use Rsync Instead of SCP
```bash
# Rsync handles large files better and can resume on failure
rsync -avz --progress build/ root@SERVER_IP:/var/www/viticultwhisky/frontend/build/

# For problematic transfers, sync static folder separately
rsync -avz --progress build/static/ root@SERVER_IP:/var/www/viticultwhisky/frontend/build/static/
```

#### 3. Alternative: Build on Server (if transfer fails)
```bash
ssh root@SERVER_IP
cd /var/www/viticultwhisky/frontend
git pull
npm run build
chown -R www-data:www-data build
chmod -R 755 build
```

#### 4. Complete Deployment Script
```bash
#!/bin/bash
# deploy-final.sh

echo "Building frontend..."
cd /Users/adityapachauri/Desktop/Whisky/frontend
npm run build

echo "Cleaning Mac files..."
find build -name "._*" -delete

echo "Deploying with rsync..."
rsync -avz --progress build/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/

echo "Fixing permissions..."
ssh root@31.97.57.193 << 'EOF'
cd /var/www/viticultwhisky/frontend
chown -R www-data:www-data build
chmod -R 755 build
nginx -s reload
echo "✅ Deployment complete"
EOF
```

---

## Quick Diagnostics Checklist

### When Site is Down
1. ✅ Check if static files exist: `ls -la /var/www/viticultwhisky/frontend/build/static/`
2. ✅ Test JS file response: `curl -I https://viticultwhisky.co.uk/static/js/main.*.js`
3. ✅ Check nginx error logs: `tail -f /var/log/nginx/error.log`
4. ✅ Verify backend is running: `pm2 status`

### When Auto-Capture Not Working
1. ✅ Check browser console for auto-save messages
2. ✅ Verify API endpoint: `curl https://viticultwhisky.co.uk/api/tracking/capture`
3. ✅ Check backend logs: `pm2 logs whisky-backend`

### When Dashboard Shows No Data
1. ✅ Check API response: `curl https://viticultwhisky.co.uk/api/tracking/captured-data`
2. ✅ Verify dashboard console for API endpoint being used
3. ✅ Check browser network tab for API calls

---

## Server Access

```bash
# SSH Access
ssh root@31.97.57.193
# Password: w(7rjMOF4'nzhIOuOdPF

# Important Paths
/var/www/viticultwhisky/frontend/build  # Frontend build
/var/www/viticultwhisky/backend         # Backend server
/etc/nginx/sites-available/viticultwhisky  # Nginx config

# PM2 Commands
pm2 status
pm2 logs whisky-backend
pm2 restart whisky-backend
```

---

## Testing with Playwright

```javascript
// Complete test for auto-capture and IP tracking
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test form auto-capture
  await page.goto('https://viticultwhisky.co.uk/contact');
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  
  // Check console for auto-save
  page.on('console', msg => {
    if (msg.text().includes('Auto-saved')) {
      console.log('✅', msg.text());
    }
  });
  
  // Test admin dashboard
  await page.goto('https://viticultwhisky.co.uk/admin/login');
  await page.fill('[name="email"]', 'admin@viticultwhisky.co.uk');
  await page.fill('[name="password"]', 'admin123');
  await page.click('button:has-text("Sign in")');
  
  // Check captured visitors tab
  await page.click('button:has-text("Captured Visitors")');
  const visitorCount = await page.textContent('.visitor-count');
  console.log('Captured visitors:', visitorCount);
  
  await browser.close();
})();
```

---

## Key Lessons Learned

1. **Always use rsync for large file transfers** - SCP often corrupts large tar files
2. **Remove Mac metadata files before deployment** - They cause issues on Linux
3. **Use dynamic API configuration** - Never hardcode localhost in production code
4. **Trust proxy in Express** - Essential for getting real IPs behind reverse proxy
5. **Test with actual production URL** - localhost testing doesn't catch all issues
6. **Keep build process simple** - Complex build scripts often fail on servers
7. **Monitor console logs** - They provide immediate feedback on what's working

---

## Hero Section Images Not Loading

### Problem
First image in hero section carousel showing broken image icon. Other carousel images also failing to load with 404 errors.

### Root Cause
Hero images folder (`/whisky/hero/optimized/`) was empty on production server after deployment. Images weren't transferred during the build deployment process.

### Solution

#### Transfer Hero Images to Server
```bash
# Use rsync with expect to handle password authentication
expect -c "
spawn rsync -avz --progress /Users/adityapachauri/Desktop/Whisky/frontend/public/whisky/hero/optimized/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/whisky/hero/optimized/
expect \"password:\"
send \"w(7rjMOF4'nzhIOuOdPF\r\"
expect eof
"
```

### Verification
1. Check images exist on server:
```bash
ssh root@31.97.57.193
ls -la /var/www/viticultwhisky/frontend/build/whisky/hero/optimized/
# Should show all image files including 1920w versions
```

2. Test in browser:
- Navigate to https://viticultwhisky.co.uk
- Hero carousel should display images without broken icons
- Check console for any "Failed to load image" errors

### Prevention
- Always include public folder assets when deploying
- Verify static assets after deployment
- Consider adding hero images to build process

---

*Last Updated: August 9, 2025*
*Issue Resolution Time: Site down → Full functionality in ~30 minutes with proper approach*