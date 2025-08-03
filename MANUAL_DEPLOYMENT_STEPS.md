# Manual Deployment Steps for Thank You Page

## What's Ready:
✅ Thank you page created: `/src/pages/ThankYou.tsx`
✅ Route added to App.tsx: `/thank-you`
✅ Build completed successfully
✅ Files ready in `/build` folder

## Manual Deployment Steps:

### Step 1: Connect to Your Server
```bash
ssh root@31.97.57.193
# Enter password: --w(7rjMOF4'nzhIOuOdPF
```

### Step 2: Navigate to Website Directory
```bash
cd /var/www/viticultwhisky.co.uk
```

### Step 3: Backup Current Site
```bash
cp -r html html-backup-$(date +%Y%m%d-%H%M%S)
```

### Step 4: Upload New Build Files
You can either:

**Option A: Use your local build folder**
- Copy contents of `/Users/adityapachauri/Desktop/Whisky/frontend/build/` 
- Upload to server's `/var/www/viticultwhisky.co.uk/html/` directory

**Option B: Rebuild on server (if you have the code there)**
```bash
cd /path/to/your/whisky/frontend
npm run build
cp -r build/* /var/www/viticultwhisky.co.uk/html/
```

### Step 5: Set Permissions
```bash
cd /var/www/viticultwhisky.co.uk/html
chown -R www-data:www-data .
chmod -R 755 .
```

### Step 6: Reload Web Server
```bash
systemctl reload nginx
# or
systemctl reload apache2
```

## Test the Thank You Page:

Visit these URLs to test:
- `https://viticultwhisky.co.uk/thank-you`
- `https://viticultwhisky.co.uk/thank-you?type=contact&name=John`
- `https://viticultwhisky.co.uk/thank-you?type=sell&name=Jane`

## Integration with Forms:

To redirect from your contact/sell forms, update the success handlers to redirect to:
- Contact form: `window.location.href = '/thank-you?type=contact&name=' + formData.name`
- Sell form: `window.location.href = '/thank-you?type=sell&name=' + formData.name`

The page will automatically show appropriate content based on the type parameter.