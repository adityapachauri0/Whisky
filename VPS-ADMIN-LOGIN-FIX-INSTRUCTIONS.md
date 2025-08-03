# 🚨 CRITICAL: VPS Admin Login Fix Instructions

## The Problem
Admin login fails on production VPS. According to master troubleshooting guide, this is caused by **4 critical issues** that compound together.

## The Solution
Run these commands **in this exact order** on the VPS:

### Step 1: SSH to VPS
```bash
ssh root@31.97.57.193  # or your VPS IP
cd /var/www/viticultwhisky
```

### Step 2: Run Comprehensive Fix
```bash
# Download and run the fix script
wget -O admin-fix.sh https://raw.githubusercontent.com/your-repo/main/scripts/vps-admin-login-fix.sh
chmod +x admin-fix.sh
./admin-fix.sh
```

**OR manually apply these critical fixes:**

### Manual Fix Option:

#### Fix 1: ENCRYPTION_KEY Length (CRITICAL)
```bash
cd /var/www/viticultwhisky/backend

# Check current length
echo -n "$(grep ENCRYPTION_KEY .env.production | cut -d= -f2)" | wc -c

# If not 32, generate new key
NEW_KEY=$(openssl rand -hex 16)
sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$NEW_KEY/" .env.production

# Verify it's exactly 32 characters
echo -n "$(grep ENCRYPTION_KEY .env.production | cut -d= -f2)" | wc -c
```

#### Fix 2: CORS Configuration (CRITICAL)
```bash
# Add localhost to ALLOWED_ORIGINS for internal API calls
sed -i 's/ALLOWED_ORIGINS=.*/ALLOWED_ORIGINS=https:\/\/viticultwhisky.co.uk,https:\/\/www.viticultwhisky.co.uk,http:\/\/localhost:5001,http:\/\/127.0.0.1:5001/' .env.production
```

#### Fix 3: Nginx Proxy Port (CRITICAL)
```bash
# Fix proxy port from 5000 to 5001
sed -i 's/proxy_pass http:\/\/localhost:5000;/proxy_pass http:\/\/localhost:5001;/' /etc/nginx/sites-available/viticultwhisky.co.uk

# Add HTTPS forwarding headers
sed -i '/location \/api {/,/}/c\      location /api {\
          proxy_pass http://localhost:5001;\
          proxy_http_version 1.1;\
          proxy_set_header Upgrade $http_upgrade;\
          proxy_set_header Connection '\''upgrade'\'';\
          proxy_set_header Host $host;\
          proxy_set_header X-Real-IP $remote_addr;\
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
          proxy_set_header X-Forwarded-Proto $scheme;\
          proxy_set_header X-Forwarded-Host $host;\
          proxy_cache_bypass $http_upgrade;\
      }' /etc/nginx/sites-available/viticultwhisky.co.uk

# Reload nginx
nginx -t && systemctl reload nginx
```

#### Fix 4: Restart Backend (CRITICAL)
```bash
# Set environment and restart
export NODE_ENV=production
pm2 restart viticult-backend --update-env
```

### Step 3: Test the Fix
```bash
# Test API directly
curl -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'

# Should return: {"success":true,"data":{"user":{...}}}
```

### Step 4: Test in Browser
1. Open: https://viticultwhisky.co.uk/admin/login
2. Login with: **admin@viticultwhisky.co.uk** / **admin123**
3. Should redirect to dashboard

## What These Fixes Do

1. **ENCRYPTION_KEY Fix**: Generates exactly 32-character encryption key (was truncated to 31)
2. **CORS Fix**: Adds localhost to ALLOWED_ORIGINS for server-to-server API calls
3. **Nginx Fix**: Corrects proxy port from 5000→5001 and adds HTTPS headers
4. **Environment Fix**: Ensures NODE_ENV=production and proper restart

## Success Indicators

- ✅ curl returns: `{"success":true,"data":{"user":{...}}}`
- ✅ Browser redirects from /admin/login to /admin/dashboard
- ✅ No CORS errors in browser console
- ✅ PM2 shows backend as "online"

## If Still Failing

Check logs:
```bash
pm2 logs viticult-backend --lines 20
tail -f /var/log/nginx/error.log
```

Run diagnosis:
```bash
./scripts/quick-admin-diagnosis.sh
```

## Emergency Backup Plan

If something breaks, restore from backup:
```bash
# Restore previous config
cp .env.production.backup .env.production
cp /etc/nginx/sites-available/viticultwhisky.co.uk.backup /etc/nginx/sites-available/viticultwhisky.co.uk
systemctl reload nginx
pm2 restart viticult-backend
```

---

**This fix addresses the exact issues from your 15-hour struggle:**
- Environment validation errors → Fixed by 32-char ENCRYPTION_KEY
- 502 Bad Gateway → Fixed by correct nginx proxy port
- CORS blocking requests → Fixed by adding localhost to ALLOWED_ORIGINS
- "HTTPS is required" → Fixed by X-Forwarded-Proto header

**These 4 critical fixes working together will resolve the admin login issues permanently.**