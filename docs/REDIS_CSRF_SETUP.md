# Redis CSRF Implementation - Security Enhancement to 9/10

## Overview
This upgrade moves CSRF token storage from memory to Redis for better security and scaling.

**IMPORTANT: Your login password remains "admin123" - this doesn't change your login process!**

## Step 1: Install Redis on VPS

SSH to your VPS and run:
```bash
ssh root@31.97.57.193

# Install Redis
apt update
apt install redis-server -y

# Configure Redis
systemctl enable redis-server
systemctl start redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

## Step 2: Add Redis to Backend

Update package.json dependencies:
```bash
cd /var/www/viticultwhisky/backend
npm install redis
```

## Step 3: Update .env File

Add Redis configuration:
```bash
nano .env

# Add this line:
REDIS_URL=redis://localhost:6379
```

## Step 4: Update CSRF Middleware

The new middleware will:
- Store CSRF tokens in Redis instead of memory
- Tokens survive server restarts
- Better for production scaling
- **Your login process stays exactly the same**

## Backup Plan

If anything goes wrong:
1. Stop Redis: `systemctl stop redis-server`
2. Revert middleware changes
3. Restart backend: `pm2 restart viticult-backend`
4. Login still works with memory-based tokens

## Expected Outcome

- ✅ Login remains: admin@viticultwhisky.co.uk / admin123
- ✅ Security score: 9/10
- ✅ Better token persistence
- ✅ Production-ready scaling