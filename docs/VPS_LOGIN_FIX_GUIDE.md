# VPS Admin Login Fix Guide

## 🚨 Root Causes of VPS Login Failure

### 1. **Wrong Password Hash Format**
Your `.env.production` has:
```
ADMIN_PASSWORD_HASH=ZTBfd+i0SKZIESqTlF/s8w==
```
This is **Base64**, NOT bcrypt! The app expects bcrypt format:
```
$2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. **Multiple Conflicting .env Files**
```
./.env.production          <- Root level (WRONG location)
./backend/.env             <- Development
./backend/.env.production  <- Production (CORRECT location)
./frontend/.env.production <- Frontend only
```

### 3. **NODE_ENV Not Set**
Without `NODE_ENV=production`, the server uses development config!

## 🔧 Complete VPS Fix

### Step 1: SSH to VPS
```bash
ssh user@your-vps-ip
cd /path/to/whisky
```

### Step 2: Clean Up Duplicate Files
```bash
# Remove root-level env file (it's in wrong location)
rm -f .env.production

# Ensure we're using backend folder
cd backend
```

### Step 3: Generate Correct Password Hash
```bash
# Create a simple hash generator
cat > generate-hash.js << 'EOF'
const bcrypt = require('bcryptjs');
const password = process.argv[2] || 'admin123';
bcrypt.hash(password, 12).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
});
EOF

# Generate hash for your password
node generate-hash.js "admin123"
```

### Step 4: Update Production Config
```bash
# Edit the CORRECT file
nano backend/.env.production

# Update these values:
NODE_ENV=production
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=$2a$12$xxxxx  # Use hash from step 3
```

### Step 5: Set Environment & Restart
```bash
# Export NODE_ENV
export NODE_ENV=production

# If using PM2
pm2 restart all --update-env

# If using systemd
sudo systemctl restart whisky-backend

# If manual
pkill -f node
NODE_ENV=production node server.js
```

### Step 6: Verify Correct Config is Loaded
```bash
# Check which config is being used
NODE_ENV=production node -e "console.log(require('./config'))"

# Test the endpoint
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'
```

## 🎯 Quick Debug Commands

### Check What's Running
```bash
# See environment
ps aux | grep node
cat /proc/$(pgrep -f "node.*server")/environ | tr '\0' '\n' | grep NODE_ENV

# Check loaded config
tail -f backend.log | grep -E "environment|config|admin"
```

### Test Password Hash
```bash
# Create test script
cat > test-login.js << 'EOF'
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.production' });

const testPassword = 'admin123';
const hash = process.env.ADMIN_PASSWORD_HASH;

console.log('Email:', process.env.ADMIN_EMAIL);
console.log('Hash format:', hash.substring(0, 7));
console.log('Hash length:', hash.length);

if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
  bcrypt.compare(testPassword, hash).then(match => {
    console.log('Password matches:', match);
  });
} else {
  console.log('ERROR: Not a valid bcrypt hash!');
}
EOF

NODE_ENV=production node test-login.js
```

## ⚡ One-Command Fix

```bash
# Run this on VPS to fix everything
curl -sL https://raw.githubusercontent.com/your-repo/fix-vps-login.sh | bash
```

Or manually:
```bash
#!/bin/bash
cd /path/to/whisky/backend

# Backup current config
cp .env.production .env.production.backup

# Generate new hash
HASH=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 12).then(h => console.log(h));
")

# Update production env
cat > .env.production << EOF
NODE_ENV=production
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=$HASH
JWT_SECRET=$(openssl rand -hex 32)
MONGODB_URI=mongodb://localhost:27017/viticultwhisky
PORT=5001
EOF

# Restart with correct environment
export NODE_ENV=production
pm2 restart backend --update-env
```

## 🔍 Why It Failed Before

1. **Base64 vs Bcrypt**: The hash format was completely wrong
2. **Wrong .env location**: Root-level .env.production wasn't being read
3. **Missing NODE_ENV**: Server defaulted to development mode
4. **No restart after changes**: PM2/Node cached old values
5. **Multiple .env conflicts**: Different files had different values

## ✅ Verification Checklist

- [ ] Only ONE .env.production in backend/ folder
- [ ] Password hash starts with `$2a$` or `$2b$`
- [ ] NODE_ENV=production is set
- [ ] Server restarted with --update-env
- [ ] No .env files in root directory
- [ ] Backend logs show "production" mode

## 🚀 Prevent Future Issues

1. **Use our scripts**:
   - `./setup-admin-production.sh` - Generates correct format
   - `./deploy-admin-update.sh` - Deploys properly

2. **Always verify**:
   ```bash
   grep ADMIN_PASSWORD_HASH backend/.env.production
   # Must show: $2a$... or $2b$... format
   ```

3. **Set NODE_ENV permanently**:
   ```bash
   # Add to ~/.bashrc or /etc/environment
   export NODE_ENV=production
   ```

The 15-hour struggle was likely due to the wrong hash format (Base64 instead of bcrypt) combined with multiple conflicting .env files!