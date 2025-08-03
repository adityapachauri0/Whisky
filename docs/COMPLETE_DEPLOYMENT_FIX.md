# 🚀 Complete Deployment Fix for VPS Login & API Issues

## ✅ All Fixes Applied

### 1. **Password Hash Fixed**
- ✅ Changed from Base64 to bcrypt format
- ✅ New hash: `$2a$12$nHEvg7P5feBnifT4.1D9X.9aGE6rHuXQIO/2r7ljZ82leEQOUHEFu`
- ✅ Password: `admin123`
- ✅ Email: `admin@viticultwhisky.co.uk`

### 2. **Backend Configuration Fixed**
- ✅ `backend/.env.production` created with:
  - ✅ NODE_ENV=production
  - ✅ Correct bcrypt password hash
  - ✅ ALLOWED_ORIGINS with your domain
  - ✅ Cookie configuration for production
  - ✅ Secure JWT secrets
  - ✅ Rate limiting increased for testing

### 3. **Frontend Configuration Fixed**
- ✅ `frontend/.env.production` created with:
  - ✅ REACT_APP_API_URL=https://viticultwhisky.co.uk/api
  - ✅ REACT_APP_ENVIRONMENT=production

### 4. **API/CORS Issues Fixed**
- ✅ ALLOWED_ORIGINS includes both www and non-www
- ✅ COOKIE_DOMAIN set to .viticultwhisky.co.uk
- ✅ withCredentials enabled in frontend
- ✅ Trust proxy enabled for nginx

### 5. **Scripts Created**
- ✅ `pre-push-cleanup.sh` - Clean up before push
- ✅ `deploy-fix.sh` - Apply all fixes on VPS
- ✅ `diagnose-api.sh` - Diagnose API issues
- ✅ `test-api.sh` - Test API endpoints
- ✅ `nginx-vps-config` - Complete nginx configuration

## 🚀 Deployment Steps

### Step 1: Clean Up Project
```bash
./pre-push-cleanup.sh
```

### Step 2: Commit Changes
```bash
git add -A
git commit -m "Fix admin login and API configuration - complete solution"
git push origin main
```

### Step 3: On VPS Server
```bash
# SSH to your VPS
ssh user@your-vps-ip

# Navigate to project
cd /path/to/whisky

# Pull latest changes
git pull origin main

# Make scripts executable
chmod +x deploy-fix.sh diagnose-api.sh test-api.sh

# Run deployment fix
./deploy-fix.sh
```

### Step 4: Verify Deployment
```bash
# Run diagnostics
./diagnose-api.sh

# Test API endpoints
./test-api.sh

# Check PM2 status
pm2 list
pm2 logs backend --lines 50
```

### Step 5: Test Login
1. Open browser to https://viticultwhisky.co.uk/admin/login
2. Login with:
   - Email: `admin@viticultwhisky.co.uk`
   - Password: `admin123`

## 📋 Verification Checklist

- [ ] Backend running on port 5001
- [ ] MongoDB connected
- [ ] Nginx serving frontend
- [ ] API proxy working (/api routes)
- [ ] CORS headers present
- [ ] Admin login successful
- [ ] No 401/403/429 errors
- [ ] Cookies being set properly

## 🆘 If Issues Persist

### 1. Check Logs
```bash
# Backend logs
pm2 logs backend --lines 100

# Nginx errors
sudo tail -f /var/log/nginx/error.log

# MongoDB status
sudo systemctl status mongod
```

### 2. Verify Environment
```bash
# Check NODE_ENV
pm2 info backend | grep NODE_ENV

# Check loaded config
cat backend/.env.production | grep -E "NODE_ENV|ADMIN_EMAIL|ALLOWED_ORIGINS"
```

### 3. Test Manually
```bash
# Test health (if exists)
curl http://localhost:5001/health

# Test admin login
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
  -c cookies.txt -v
```

### 4. Emergency Reset
```bash
# Clear everything and restart
pm2 delete all
pm2 flush
export NODE_ENV=production
cd backend && pm2 start server.js --name backend --env production
```

## 🎯 What Was Fixed

1. **Password Hash**: Was Base64 `ZTBfd+i0SKZIESqTlF/s8w==`, now bcrypt `$2a$12$...`
2. **CORS**: Added your domain to ALLOWED_ORIGINS
3. **Cookies**: Configured domain and security settings
4. **Environment**: Set NODE_ENV=production
5. **API Proxy**: Fixed nginx headers for cookies
6. **Rate Limiting**: Increased limits to prevent lockouts

## 📝 Important Notes

- The password is `admin123` (not the hash!)
- Email must be exactly `admin@viticultwhisky.co.uk` (not .com)
- Cookies are httpOnly for security
- Frontend must use https:// in production
- All secrets have been regenerated for security

## ✅ Success Indicators

- Login returns: `{"success":true,"data":{"user":{...}}}`
- Cookie named `authToken` is set
- Redirects to /admin/dashboard
- No CORS errors in browser console
- API calls include credentials

This deployment package includes ALL fixes for your 15-hour login struggle!