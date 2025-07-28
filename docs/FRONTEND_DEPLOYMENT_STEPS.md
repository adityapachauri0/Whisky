# Frontend Deployment Steps for Production

## Problem
- Frontend is making requests to `/api/api/admin/login` (wrong - double API)
- Backend expects `/api/auth/admin/login` (correct)
- Frontend build has been fixed locally but not deployed

## Manual Deployment Steps

### 1. Create deployment package locally
```bash
cd /Users/adityapachauri/Desktop/Whisky
tar -czf frontend-build.tar.gz -C frontend build
```

### 2. Upload to server
```bash
scp frontend-build.tar.gz root@31.97.57.193:/tmp/
# Enter password when prompted
```

### 3. SSH to server and deploy
```bash
ssh root@31.97.57.193
# Enter password when prompted

# Once connected:
cd /var/www/viticultwhisky/frontend
rm -rf build.backup
mv build build.backup
tar -xzf /tmp/frontend-build.tar.gz
rm /tmp/frontend-build.tar.gz

# Verify
ls -la build/
exit
```

### 4. Test the fix
Run: `node test-production-quick.js`

## Alternative: Direct File Fix on Server

If you can't deploy the full build, you can fix just the Login component:

```bash
ssh root@31.97.57.193
cd /var/www/viticultwhisky/frontend

# Find and fix the Login.js file in the build
find build -name "*.js" -exec grep -l "api/auth/admin/login" {} \;

# The file will be minified, but you can search and replace:
# Find: "/api/auth/admin/login"
# Replace with: "/auth/admin/login"
# (Since API_URL already includes /api)
```

## What Was Fixed
- Changed `${baseUrl}/api/auth/admin/login` to `${API_URL}/auth/admin/login`
- This prevents the double `/api/api/` in the request URL
- Backend is already working correctly and returns success

## Verification
After deployment, the login should work because:
1. Backend returns: `{"success":true,"data":{"user":{"email":"admin@viticultwhisky.co.uk","role":"admin"}}}`
2. Frontend will correctly call: `https://viticultwhisky.co.uk/api/auth/admin/login`
3. Cookie will be set with authToken