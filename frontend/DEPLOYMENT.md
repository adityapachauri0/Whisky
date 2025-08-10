# Deployment Guide - ViticultWhisky

## Quick Deploy

To deploy to production, simply run:

```bash
npm run deploy
```

or

```bash
./deploy.sh
```

## What the deployment script does:

1. **Builds the React app** - Creates optimized production build
2. **Cleans Mac metadata** - Removes ._* files that cause issues on Linux
3. **Creates archive** - Packages build for transfer
4. **Transfers build** - Uploads to production server
5. **Deploys on server** - Extracts and sets up the build
6. **Transfers public assets** - Ensures hero images and other public files are copied
7. **Sets permissions** - Configures correct ownership for nginx
8. **Reloads nginx** - Applies the new deployment
9. **Verifies deployment** - Checks that files exist and site responds

## Important Notes

### Hero Images
The hero carousel images in `/public/whisky/hero/optimized/` are NOT included in the React build by default. The deployment script handles this by:
- Using rsync to transfer hero images separately after the build
- Ensuring all image sizes (640w, 768w, 1280w, 1920w) are transferred

### Public Assets
Other public assets like PDFs, favicons, and robots.txt are also transferred separately.

## Manual Deployment (if script fails)

If the automated script fails, you can deploy manually:

### 1. Build locally
```bash
cd /Users/adityapachauri/Desktop/Whisky/frontend
npm run build
```

### 2. Transfer build
```bash
rsync -avz --progress build/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/
```

### 3. Transfer hero images (CRITICAL!)
```bash
rsync -avz --progress public/whisky/hero/optimized/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/whisky/hero/optimized/
```

### 4. Set permissions on server
```bash
ssh root@31.97.57.193
cd /var/www/viticultwhisky/frontend
chown -R www-data:www-data build
chmod -R 755 build
nginx -s reload
```

## Troubleshooting

### Hero images not showing
- Check if images exist: `ls -la /var/www/viticultwhisky/frontend/build/whisky/hero/optimized/`
- If empty, run: `rsync -avz public/whisky/hero/optimized/ root@31.97.57.193:/var/www/viticultwhisky/frontend/build/whisky/hero/optimized/`

### Site showing old version
- Clear browser cache
- Check nginx is reloaded: `nginx -s reload`
- Verify new files: `ls -la /var/www/viticultwhisky/frontend/build/static/js/`

### Permission errors
- Run: `chown -R www-data:www-data /var/www/viticultwhisky/frontend/build`

## Server Details

- **Server IP**: 31.97.57.193
- **Web Root**: /var/www/viticultwhisky/frontend/build
- **Backend**: Port 5001 (PM2 process: whisky-backend)
- **Frontend**: Served by nginx on ports 80/443

## Pre-deployment Checklist

Before deploying, ensure:
- [ ] All changes are committed to git
- [ ] Tests pass locally
- [ ] Build completes without errors
- [ ] Hero images are optimized and in place

## Post-deployment Verification

After deploying, verify:
- [ ] Homepage loads at https://viticultwhisky.co.uk
- [ ] Hero carousel shows images (no broken icons)
- [ ] Contact form submits successfully
- [ ] Admin dashboard accessible at /admin
- [ ] Auto-capture working on forms
- [ ] Check browser console for errors

## Rollback Procedure

If deployment fails, the script creates a backup:

```bash
ssh root@31.97.57.193
cd /var/www/viticultwhisky/frontend
rm -rf build
mv build.backup build
chown -R www-data:www-data build
nginx -s reload
```

---

*Last updated: August 9, 2025*