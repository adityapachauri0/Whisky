# VPS Deployment Instructions

## Current Status
✅ All recent changes have been successfully built locally
✅ Build package ready: `frontend-build.tar.gz` (contains all latest changes)

## Changes Included in This Deployment
1. **Currency Conversion**: All USD values converted to GBP in "Global Growth Trends" section
2. **Admin Panel Fix**: Removed form display limit - now shows ALL submitted forms
3. **SEO Optimizations**: Complete meta tags, structured data, sitemap
4. **Favicon Fix**: Added cache-busting parameters to prevent caching issues
5. **Thank You Message**: Updated sell form thank you message

## Manual Deployment Steps

### Step 1: Connect to VPS
```bash
ssh root@31.97.57.193
```

### Step 2: Transfer Build Files
From your local machine:
```bash
scp frontend-build.tar.gz root@31.97.57.193:/tmp/
```

### Step 3: Extract and Deploy on VPS
```bash
# Navigate to web directory
cd /var/www/html

# Backup current deployment
sudo cp -r * /backup/whisky-backup-$(date +%Y%m%d-%H%M%S)/

# Extract new build
cd /tmp
tar -xzf frontend-build.tar.gz

# Copy to web directory
sudo cp -r build/* /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### Step 4: Restart Services
```bash
# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### Step 5: Test Deployment
1. Visit: https://viticultwhisky.co.uk
2. Check favicon appears correctly
3. Verify "Global Growth Trends" shows GBP values
4. Test admin panel at: https://viticultwhisky.co.uk/admin/login
5. Submit test forms and verify admin shows all submissions

## Verification Checklist
- [ ] Website loads correctly
- [ ] Favicon visible (animated whisky cask)
- [ ] GBP currency displayed in market growth section
- [ ] Admin panel shows more than 2 forms when available
- [ ] SEO meta tags present (view page source)
- [ ] Forms submission works

## Troubleshooting
If issues occur, restore from backup:
```bash
sudo cp -r /backup/whisky-backup-[timestamp]/* /var/www/html/
sudo systemctl restart nginx
```

## Files Ready for Transfer
- `frontend-build.tar.gz` - Complete build package
- All changes tested and verified locally