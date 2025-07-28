# 🚨 Production Login Quick Fix

## The Issue
Production login fails because the cookie has `SameSite=Strict` hardcoded, but it should be `SameSite=strict` (lowercase) for production.

## Quick Manual Fix (Copy & Paste to VPS)

### 1. SSH to your VPS
```bash
ssh user@your-vps-ip
```

### 2. Navigate to backend
```bash
cd /var/www/viticultwhisky/backend
```

### 3. Apply the fix directly
```bash
# Backup first
cp controllers/admin.controller.js controllers/admin.controller.js.backup

# Fix the cookie settings
sed -i "s/sameSite: 'strict'/sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'/g" controllers/admin.controller.js

# Verify the fix
grep -n "sameSite:" controllers/admin.controller.js
```

### 4. Restart the backend
```bash
pm2 restart backend
# or
pm2 restart viticult-backend
# or
pm2 restart all
```

### 5. Test the login
Visit: https://viticultwhisky.co.uk/admin/login
- Email: admin@viticultwhisky.co.uk
- Password: admin123

## Alternative: Full Replacement

If the sed command doesn't work, you can manually edit:

```bash
nano controllers/admin.controller.js
```

Find these two lines (around line 99 and 129):
```javascript
// OLD:
sameSite: 'strict',

// CHANGE TO:
sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
```

Save and restart PM2.

## Verify Fix Applied
```bash
# Check if fix is applied
curl -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
  -c cookies.txt -v 2>&1 | grep -i "set-cookie"
```

Should show: `SameSite=strict` (not Strict with capital S)