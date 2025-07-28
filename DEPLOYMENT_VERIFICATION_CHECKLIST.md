# 🚀 Deployment Verification Checklist

## Pre-Deployment Verification (Local)

### Code Quality Checks
- [ ] **Hero Image Fix Applied**
  - [ ] Hero.tsx uses URL-safe filename: `resized_winery_Viticult-7513835-1`
  - [ ] Home.tsx preload references updated
  - [ ] public/index.html preload reference updated
  - [ ] All responsive image files exist in `frontend/public/whisky/hero/optimized/`

- [ ] **Frontend Build Success**
  ```bash
  cd frontend && npm run build
  # Should complete without errors
  ```

- [ ] **Built Assets Verification**
  ```bash
  # Check built HTML contains correct image filename
  grep "resized_winery_Viticult-7513835-1" frontend/build/index.html
  
  # Verify images exist in build output
  ls frontend/build/whisky/hero/optimized/resized_winery_Viticult-7513835-1-*
  ```

- [ ] **Local Development Test**
  ```bash
  # Start dev server
  npm start
  
  # Test hero image loads at: http://localhost:3001
  curl -I http://localhost:3001/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp
  # Should return 200 OK
  ```

### Deployment Script Readiness
- [ ] **deploy-whisky.sh Enhanced**
  - [ ] `copy_images_to_webroot()` function added
  - [ ] `verify_hero_images()` function added
  - [ ] Functions integrated into deployment workflow
  - [ ] Image copying added to fresh deployment
  - [ ] Image copying added to update deployment

- [ ] **Git Status Clean**
  ```bash
  git status
  # Should show all changes staged for commit
  ```

## VPS Deployment Process

### Phase 1: Upload and Build
- [ ] **Code Upload Successful**
  ```bash
  ./deploy-whisky.sh deploy
  # OR
  ./deploy-whisky.sh update
  ```

- [ ] **Build Process Verification**
  - [ ] Backend dependencies installed
  - [ ] Frontend built successfully
  - [ ] Images copied to web root (new step)
  - [ ] Services restarted

### Phase 2: Image Deployment Verification
- [ ] **Image Directory Structure**
  ```bash
  # On VPS - verify directory exists
  ls -la /var/www/whisky/whisky/hero/optimized/
  
  # Should contain resized_winery_Viticult-7513835-1-* files
  ```

- [ ] **Hero Image Files Present**
  ```bash
  # Check all responsive variants exist
  ls /var/www/whisky/whisky/hero/optimized/resized_winery_Viticult-7513835-1-*
  # Should show: 640w, 768w, 1280w, 1920w variants
  ```

- [ ] **File Permissions Correct**
  ```bash
  # Files should be owned by www-data
  ls -la /var/www/whisky/whisky/hero/optimized/ | grep "winery_Viticult-7513835-1"
  # Should show www-data:www-data ownership
  ```

### Phase 3: Functionality Testing

#### Hero Image Loading Test
- [ ] **Direct Image Access**
  ```bash
  curl -I https://viticultwhisky.co.uk/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp
  # Should return: HTTP/1.1 200 OK
  ```

- [ ] **All Hero Images Accessible**
  ```bash
  # Test each responsive variant
  curl -I https://viticultwhisky.co.uk/whisky/hero/optimized/resized_winery_Viticult-7513835-1-640w.webp
  curl -I https://viticultwhisky.co.uk/whisky/hero/optimized/resized_winery_Viticult-7513835-1-768w.webp
  curl -I https://viticultwhisky.co.uk/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp
  curl -I https://viticultwhisky.co.uk/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1920w.webp
  # All should return 200 OK
  ```

#### Website Functionality Test
- [ ] **Homepage Loading**
  - [ ] Visit https://viticultwhisky.co.uk
  - [ ] Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
  - [ ] First hero image should load without blank/loading state
  - [ ] Hero carousel should function (play/pause, indicators)

- [ ] **Browser Developer Tools Check**
  - [ ] Open Network tab and refresh
  - [ ] No 404 errors for hero images
  - [ ] Hero image loads with correct filename (no spaces/parentheses)

#### Admin System Test
- [ ] **Admin Login**
  ```bash
  curl -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'
  # Should return: {"success":true}
  ```

- [ ] **Admin Panel Access**
  - [ ] Visit https://viticultwhisky.co.uk/admin
  - [ ] Login should work with default credentials
  - [ ] Dashboard should load without errors

## Post-Deployment Verification

### Automated Health Checks
- [ ] **Run Deployment Test Script**
  ```bash
  ./deploy-whisky.sh test
  # Should pass all health checks
  ```

- [ ] **Hero Image Verification Script**
  ```bash
  # On VPS, run the verification function
  ssh root@173.249.4.116 "cd /var/www/whisky && bash -c 'source deploy-whisky.sh && verify_hero_images'"
  # Should show ✅ for all hero images
  ```

### Performance and SEO Checks
- [ ] **Page Load Speed**
  - [ ] Homepage loads within 3 seconds
  - [ ] Hero images load progressively (responsive images working)
  - [ ] No layout shift when images load

- [ ] **SEO Validation**
  - [ ] Check robots.txt: https://viticultwhisky.co.uk/robots.txt
  - [ ] Check sitemap: https://viticultwhisky.co.uk/sitemap.xml
  - [ ] Meta tags present in page source

### Monitoring Setup
- [ ] **Error Monitoring Active**
  - [ ] Check logs for any errors: `pm2 logs whisky-backend`
  - [ ] No critical errors in server logs
  - [ ] Image 404 errors resolved

- [ ] **Backup Verification**
  - [ ] Database backup accessible
  - [ ] Configuration files backed up
  - [ ] Image assets backed up

## Rollback Plan (If Issues Found)

### Emergency Image Fix
```bash
# If hero images not loading, emergency copy:
ssh root@173.249.4.116
cd /var/www/whisky
cp -r frontend/build/whisky/* whisky/
chown -R www-data:www-data whisky/
```

### Quick Rollback
```bash
# If deployment breaks functionality:
ssh root@173.249.4.116
cd /var/www/whisky
git checkout HEAD~1  # Rollback to previous commit
./deploy-whisky.sh fix  # Apply fixes to previous version
```

## Success Criteria

### ✅ Deployment Successful When:
- [ ] All hero images load correctly without 404 errors
- [ ] First hero image specifically loads (resized_winery_Viticult-7513835-1)
- [ ] Homepage loads completely within 3 seconds
- [ ] Admin login functions properly
- [ ] No console errors in browser developer tools
- [ ] All responsive image variants accessible
- [ ] Hero carousel functions (play/pause, navigation)

### 📊 Performance Metrics:
- [ ] Hero image file sizes optimized (< 250KB for 1280w variant)
- [ ] Page load time < 3 seconds on 3G connection
- [ ] Core Web Vitals passing (LCP, FID, CLS)

### 🔒 Security Verification:
- [ ] Admin authentication working
- [ ] No sensitive data exposed in image URLs
- [ ] HTTPS working for all image requests
- [ ] File permissions secure (www-data ownership)

## Documentation Updates
- [ ] MASTER_TROUBLESHOOTING_GUIDE.md updated with hero image section
- [ ] Deploy script documented with new functions
- [ ] Git commit includes all changes with descriptive message
- [ ] README updated if necessary

---

**Last Updated**: July 28, 2025  
**Purpose**: Ensure hero image deployment fix is properly applied and verified  
**Critical Issues Prevented**: URL encoding problems, missing images in web root, recurring deployment gaps