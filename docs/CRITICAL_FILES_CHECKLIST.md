# Critical Files Checklist for VPS Sync

## 🔴 Files That MUST Match Between Local and VPS

### 1. Backend Configuration Files

#### `backend/.env.production` ⚠️ MOST CRITICAL
Must contain:
- ✅ `NODE_ENV=production`
- ✅ `ADMIN_EMAIL=admin@viticultwhisky.co.uk`
- ✅ `ADMIN_PASSWORD_HASH=$2a$12$nHEvg7P5feBnifT4.1D9X.9aGE6rHuXQIO/2r7ljZ82leEQOUHEFu`
- ✅ `ALLOWED_ORIGINS=https://viticultwhisky.co.uk,https://www.viticultwhisky.co.uk`
- ✅ `JWT_SECRET=` (secure 64-char hex string)
- ✅ `MONGODB_URI=mongodb://localhost:27017/viticultwhisky`

**Common Issues:**
- ❌ Base64 hash instead of bcrypt (e.g., `ZTBfd+i0SKZIESqTlF/s8w==`)
- ❌ Missing NODE_ENV=production
- ❌ Wrong domain in ALLOWED_ORIGINS

#### `backend/.env` (Development only)
- Should NOT exist on VPS
- Only for local development

### 2. Frontend Configuration Files

#### `frontend/.env.production`
Must contain:
- ✅ `REACT_APP_API_URL=https://viticultwhisky.co.uk/api`
- ✅ `REACT_APP_ENVIRONMENT=production`

**Common Issues:**
- ❌ Using localhost URL (e.g., `http://localhost:5001/api`)
- ❌ Missing /api suffix

#### `frontend/.env` (Development only)
- Should NOT exist on VPS
- Only for local development

### 3. Nginx Configuration

#### `/etc/nginx/sites-available/viticultwhisky`
Critical sections:
```nginx
# API proxy - MUST have these headers
location /api {
    proxy_pass http://localhost:5001;
    proxy_set_header Cookie $http_cookie;
    proxy_pass_header Set-Cookie;
    proxy_cookie_domain localhost viticultwhisky.co.uk;
}
```

### 4. Files That Should NOT Exist

These files in the root directory will cause conflicts:
- ❌ `/.env`
- ❌ `/.env.production`
- ❌ `/.env.production.example`
- ❌ `/env.production`

## 📋 Quick Check Commands

Run these on your VPS to verify:

```bash
# Check password hash format
grep ADMIN_PASSWORD_HASH backend/.env.production

# Should show: ADMIN_PASSWORD_HASH=$2a$12$...
# NOT: ADMIN_PASSWORD_HASH=ZTBfd+i0SK...

# Check for duplicate files
ls -la .env* | grep -v backend | grep -v frontend

# Should return nothing (no root-level .env files)

# Check NODE_ENV
grep NODE_ENV backend/.env.production

# Should show: NODE_ENV=production

# Check API URL
grep REACT_APP_API_URL frontend/.env.production

# Should show: REACT_APP_API_URL=https://viticultwhisky.co.uk/api
```

## 🚨 The 15-Hour Login Issue Was Caused By:

1. **Wrong Password Hash Format**
   - VPS had: `ZTBfd+i0SKZIESqTlF/s8w==` (Base64)
   - Needed: `$2a$12$...` (bcrypt)

2. **Duplicate .env Files**
   - Root-level `.env.production` overriding backend config
   - Multiple conflicting configurations

3. **Missing CORS Origins**
   - Frontend couldn't communicate with backend
   - API calls blocked by CORS

4. **Wrong API URL**
   - Frontend looking at localhost instead of production

## ✅ Verification Steps

1. **Before Deployment:**
   ```bash
   ./compare-vps-files.sh
   ```

2. **After Deployment:**
   ```bash
   ./vps-sync-check.sh [user] [host] [path]
   ```

3. **Quick Fix if Needed:**
   ```bash
   ./vps-quick-fix.sh
   ```

## 🔄 Sync Process

1. Always backup VPS files first:
   ```bash
   ssh user@vps "cd /path/to/whisky && tar -czf backup-$(date +%s).tar.gz backend/.env* frontend/.env*"
   ```

2. Compare files:
   ```bash
   ./compare-vps-files.sh
   ```

3. Apply fixes if differences found:
   ```bash
   ./deploy-fix.sh
   ```

4. Verify services are running:
   ```bash
   ssh user@vps "pm2 list && pm2 logs backend --lines 20"
   ```

Remember: The password is `admin123`, NOT the hash!