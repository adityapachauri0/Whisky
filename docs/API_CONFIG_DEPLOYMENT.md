# API Configuration Deployment Guide

## Overview
This guide documents the changes made to permanently fix the admin login issues and how to deploy them to the VPS.

## Changes Made

### 1. New File Created
- **`frontend/src/config/api.config.js`** - Smart API configuration that auto-detects environment

### 2. Files Modified
- **`frontend/src/services/api.ts`** - Updated to use new API config
- **`frontend/src/pages/Admin/Login.tsx`** - Uses buildApiEndpoint() for login
- **`frontend/src/pages/Admin/Dashboard.tsx`** - All API calls updated to use buildApiEndpoint()
- **`frontend/src/pages/SellWhisky.tsx`** - Updated to use new API config
- **`frontend/src/pages/Home.tsx`** - Removed hardcoded API preconnect

## Pre-Deployment Steps

### 1. Build Production Frontend
```bash
cd frontend
npm run build
```

### 2. Create Deployment Package
```bash
# From project root
tar -czf frontend-api-config-update.tar.gz \
  frontend/build \
  frontend/src/config/api.config.js
```

## VPS Deployment Steps

### 1. Transfer to VPS
```bash
scp frontend-api-config-update.tar.gz root@31.97.57.193:/tmp/
```

### 2. On VPS - Backup Current Build
```bash
ssh root@31.97.57.193
cd /var/www/viticultwhisky
mv frontend/build frontend/build.backup-$(date +%Y%m%d-%H%M%S)
```

### 3. Extract New Build
```bash
cd /var/www/viticultwhisky
tar -xzf /tmp/frontend-api-config-update.tar.gz
rm /tmp/frontend-api-config-update.tar.gz
```

### 4. Set Permissions
```bash
chown -R nodeapp:nodeapp frontend/build
chmod -R 755 frontend/build
```

### 5. Clear Browser Cache (Important!)
After deployment, clear browser cache or test in incognito mode to ensure the new code is loaded.

## Testing on Production

### 1. Verify API Configuration
Open browser console on https://viticultwhisky.co.uk and check:
- Should see: `API Configuration: {hostname: "viticultwhisky.co.uk", apiUrl: "https://viticultwhisky.co.uk/api"}`

### 2. Test Admin Login
- Navigate to https://viticultwhisky.co.uk/admin/login
- Login with admin@viticultwhisky.co.uk / admin123
- Should redirect to dashboard without any API errors

### 3. Check Network Tab
- Open browser DevTools → Network tab
- Login should call: `https://viticultwhisky.co.uk/api/auth/admin/login`
- NOT: `https://viticultwhisky.co.uk/api/api/auth/admin/login` (double /api)

## Rollback Plan

If issues occur:
```bash
cd /var/www/viticultwhisky
rm -rf frontend/build
mv frontend/build.backup-[timestamp] frontend/build
```

## Benefits of This Update

1. **No More .env Issues** - API URL is determined by hostname, not environment variables
2. **Automatic Environment Detection** - Works on localhost and production without configuration
3. **No Double /api Path** - buildApiEndpoint() prevents the double /api issue
4. **Permanent Fix** - Frontend changes won't break API connections anymore
5. **Security Maintained** - No hardcoded secrets, maintains 9/10 security score

## Important Notes

- The backend doesn't need any changes
- This only affects the frontend build
- Always test in incognito/private browsing first
- Clear CDN cache if using one

## Quick Deployment Script

Save this as `deploy-api-config.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying API Configuration Update..."

# Build frontend
cd frontend
echo "📦 Building production frontend..."
npm run build

# Create package
cd ..
echo "📦 Creating deployment package..."
tar -czf frontend-api-config-update.tar.gz frontend/build

# Transfer to VPS
echo "📤 Transferring to VPS..."
scp frontend-api-config-update.tar.gz root@31.97.57.193:/tmp/

# Deploy on VPS
echo "🔧 Deploying on VPS..."
ssh root@31.97.57.193 << 'EOF'
cd /var/www/viticultwhisky
mv frontend/build frontend/build.backup-$(date +%Y%m%d-%H%M%S)
tar -xzf /tmp/frontend-api-config-update.tar.gz
rm /tmp/frontend-api-config-update.tar.gz
chown -R nodeapp:nodeapp frontend/build
chmod -R 755 frontend/build
echo "✅ Deployment complete!"
EOF

echo "🎉 API Configuration deployed successfully!"
echo "⚠️  Remember to clear browser cache before testing!"
```

Make it executable: `chmod +x deploy-api-config.sh`