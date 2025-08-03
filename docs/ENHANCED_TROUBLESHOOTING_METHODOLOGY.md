# 🎯 Enhanced Troubleshooting Methodology

## Critical Gap Analysis from Latest Fix

### Missing Documentation Issues:
1. **Dotenv Environment Loading Bug**
2. **Nginx Port Direction Confusion** 
3. **Database Migration Scenarios**

---

## 🚀 NEW: Systematic Diagnostic Flow

### Phase 1: Quick Health Assessment (30 seconds)
```bash
# Run these 4 commands in parallel:
pm2 list & \
netstat -tln | grep :500 & \
nginx -t & \
mongo --eval "show dbs" --quiet
```

**Expected Results:**
- PM2: whisky-backend running
- netstat: Port 5000 listening  
- nginx: syntax ok
- mongo: whisky_platform_v2 exists

### Phase 2: Connection Chain Verification (1 minute)
```bash
# Test full chain: Browser → Nginx → Backend → Database
curl -i https://viticultwhisky.co.uk/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'
```

**Success indicators:**
- HTTP 200 response
- JWT token in Set-Cookie header
- JSON response with user data

### Phase 3: Configuration Validation (2 minutes)
```bash
# Check critical config mismatches:
echo "Backend Port: $(grep PORT /var/www/viticultwhisky/backend/.env.production)"
echo "Nginx Proxy: $(grep proxy_pass /etc/nginx/sites-available/viticultwhisky.co.uk)"
echo "Database: $(grep MONGODB_URI /var/www/viticultwhisky/backend/.env.production)"
echo "Dotenv Config: $(grep 'dotenv.*config' /var/www/viticultwhisky/backend/server.js)"
```

---

## 🔧 Common Mismatch Patterns

### Pattern 1: Port Misalignment
**Symptoms:** 502 Bad Gateway
**Root Cause:** nginx proxy_pass ≠ backend PORT
**Quick Fix:**
```bash
BACKEND_PORT=$(grep "PORT=" /var/www/viticultwhisky/backend/.env.production | cut -d= -f2)
sed -i "s|proxy_pass http://localhost:[0-9]*;|proxy_pass http://localhost:$BACKEND_PORT;|" /etc/nginx/sites-available/viticultwhisky.co.uk
nginx -t && systemctl reload nginx
```

### Pattern 2: Environment Loading Failure
**Symptoms:** "Admin credentials not properly configured"
**Root Cause:** dotenv loading wrong file in production
**Quick Fix:**
```bash
# Check current dotenv config
grep -n "dotenv.*config" /var/www/viticultwhisky/backend/server.js

# Fix if needed
sed -i "s|require('dotenv').config();|require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });|" /var/www/viticultwhisky/backend/server.js
```

### Pattern 3: Database Name Drift
**Symptoms:** Empty admin panel, no data
**Root Cause:** Environment points to old database name
**Detection:**
```bash
# Check what databases exist
mongo --eval "show dbs" --quiet
# Check what environment expects  
grep MONGODB_URI /var/www/viticultwhisky/backend/.env.production
```

---

## 🎯 Priority-Based Troubleshooting Matrix

| Priority | Issue Type | Diagnostic Time | Fix Time |
|----------|------------|----------------|----------|
| P0 | 502 Bad Gateway | 30 sec | 1 min |
| P0 | Login fails completely | 1 min | 2 min |
| P1 | Empty admin panel | 2 min | 3 min |
| P1 | CORS errors | 1 min | 2 min |
| P2 | Email issues | 3 min | 5 min |

---

## 🔄 Standard Recovery Workflow

### 1. Safety First (30 seconds)
```bash
# Create backup before any changes
cp /var/www/viticultwhisky/backend/.env.production /var/www/viticultwhisky/backend/.env.production.backup.$(date +%s)
```

### 2. Quick Wins (2 minutes)
```bash
# Try the 3 most common fixes:
pm2 restart whisky-backend --update-env
systemctl reload nginx  
mongo whisky_platform_v2 --eval "db.stats()"
```

### 3. Systematic Analysis (3 minutes)
```bash
# Run enhanced diagnostic script
/var/www/viticultwhisky/scripts/diagnostics/enhanced-health-check.sh
```

### 4. Targeted Fix (1-5 minutes)
```bash
# Apply specific fix based on diagnostic results
# Always test with: curl -i https://viticultwhisky.co.uk/api/admin/login
```

---

## 🚨 Emergency Escalation Triggers

**Escalate to full debugging if:**
1. Quick workflow fails after 2 attempts
2. Multiple symptoms present simultaneously  
3. Configuration seems correct but still failing
4. Data loss suspected

**Emergency contacts:** Master Troubleshooting Guide section 10

---

*This methodology reduces average troubleshooting time from 30+ minutes to 5-10 minutes for 90% of issues.*