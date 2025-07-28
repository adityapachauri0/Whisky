# VPS Admin Login - Complete Solution Guide

## 🎯 Problem Summary
Admin login works locally but fails on VPS with "Invalid credentials" error despite using correct credentials (admin@viticultwhisky.co.uk / admin123).

## 🔍 Root Causes Identified

### 1. **API Path Mismatch**
- **Issue**: Frontend calls `/api/api/admin/login` (double "api")
- **Expected**: Backend expects `/api/admin/login`
- **Why**: Frontend has a bug where it adds an extra `/api` prefix

### 2. **Nginx Port Configuration**
- **Issue**: Nginx configured to proxy to port 3006
- **Reality**: Backend runs on port 5001
- **Location**: `/etc/nginx/sites-available/viticultwhisky`

### 3. **Environment Variable Loading**
- **Issue**: PM2 not loading `.env.production` file
- **Solution**: Copy `.env.production` to `.env`
- **Critical Variables Required**:
  ```
  NODE_ENV=production
  ADMIN_EMAIL=admin@viticultwhisky.co.uk
  ADMIN_PASSWORD_HASH=$2a$10$... (bcrypt format)
  JWT_SECRET
  COOKIE_SECRET
  SESSION_SECRET
  ENCRYPTION_KEY (32 chars)
  CSRF_SECRET
  MONGODB_URI
  PORT=5001
  FRONTEND_URL
  ALLOWED_ORIGINS
  ```

### 4. **Password Hash Format**
- **Correct**: Bcrypt format starting with `$2a$` or `$2b$`
- **Wrong**: Base64 format (e.g., `ZTBfd+i0SKZIESqTlF/s8w==`)

## ✅ Complete Fix Process

### Step 1: Navigate to Backend
```bash
cd /var/www/viticultwhisky/backend
```

### Step 2: Generate Correct Password Hash
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log('Hash:', hash));"
```

### Step 3: Update Environment File
```bash
# Copy production env to regular env (PM2 loads this)
cp .env.production .env

# Update password hash
grep -v "^ADMIN_PASSWORD_HASH=" .env > .env.tmp && mv .env.tmp .env
echo 'ADMIN_PASSWORD_HASH=$2a$10$KZFABF.GN6MHKD311mr8ReVZU5XfIrzLOmfAhZsTxZz6sIJLE7GTC' >> .env

# Update encryption key if needed
grep -v "^ENCRYPTION_KEY=" .env > .env.tmp && mv .env.tmp .env
echo 'ENCRYPTION_KEY=5c360cd4c26fa06c9077c253445536b9' >> .env
```

### Step 4: Fix Nginx Configuration
```bash
# Update proxy port
sed -i 's/proxy_pass http:\/\/localhost:3006/proxy_pass http:\/\/localhost:5001/' /etc/nginx/sites-available/viticultwhisky

# Reload nginx
nginx -s reload
```

### Step 5: Fix Frontend Double API Path
Add this before route definitions in server.js (around line 188):
```bash
sed -i '188i\// Fix for frontend double API path\napp.post("/api/api/admin/login", (req, res, next) => {\n  req.url = "/api/admin/login";\n  next();\n});\n' server.js
```

### Step 6: Restart Backend
```bash
pm2 restart viticult-backend
```

## 🧪 Verification Commands

### Test Backend Directly
```bash
# Should return: {"success":true,"data":{"user":{"email":"admin@viticultwhisky.co.uk","role":"admin"}}}
curl -X POST http://localhost:5001/api/admin/login -H "Content-Type: application/json" -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'
```

### Check PM2 Status
```bash
pm2 list
pm2 logs viticult-backend --lines 20
```

### Verify Environment
```bash
node -e "require('dotenv').config(); console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD_HASH)"
```

### Test Password Hash
```bash
echo "const bcrypt = require('bcryptjs');" > test-hash.js
echo "const hash = '\$2a\$10\$KZFABF.GN6MHKD311mr8ReVZU5XfIrzLOmfAhZsTxZz6sIJLE7GTC';" >> test-hash.js
echo "bcrypt.compare('admin123', hash).then(r => console.log('Match:', r));" >> test-hash.js
node test-hash.js
# Should output: Match: true
```

## 🚨 Common Pitfalls

1. **Terminal Breaking Commands**: Long commands break across lines. Use shorter versions or create scripts
2. **Multiple .env Files**: Ensure only ONE .env file in backend folder
3. **PM2 Caching**: Always use `pm2 restart --update-env`
4. **CORS Issues**: Ensure ALLOWED_ORIGINS includes your domain

## 📋 Quick Checklist

- [ ] Backend running on port 5001
- [ ] Nginx proxying to port 5001
- [ ] Password hash in bcrypt format ($2a$...)
- [ ] All required env variables present
- [ ] .env file exists (not just .env.production)
- [ ] Frontend double API path handled
- [ ] PM2 process running without errors

## 🎉 Success Indicators

- Admin login page loads without errors
- Login redirects to /admin/dashboard
- Dashboard shows contact inquiries
- No 401/402/502 errors in console

## 📝 Notes

- The frontend bug (double API path) should ideally be fixed in the frontend code
- This workaround handles it at the backend level
- The 15-hour struggle was due to multiple issues compounding together
- Always check ALL layers: nginx → PM2 → Node.js → Environment → API routes

---
*Last Updated: 2025-07-22*
*Tested and Working on VPS: 31.97.57.193*