# 🛡️ DEPLOYMENT PREVENTION CHECKLIST

## MANDATORY STEPS - NEVER SKIP THESE

### ⚠️ BEFORE ANY DEPLOYMENT

1. **Run Validation Script**
   ```bash
   cd /var/www/viticultwhisky/backend
   ./scripts/deployment/validate-env-production.sh
   ```

2. **Backup Current Working State**
   ```bash
   # Create backup with timestamp
   BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
   tar -czf "/tmp/$BACKUP_NAME.tar.gz" /var/www/viticultwhisky/
   echo "✅ Backup created: $BACKUP_NAME"
   ```

3. **Test Current Admin Login**
   ```bash
   curl -s -X POST http://localhost:5001/api/auth/admin/login \
     -H "Content-Type: application/json" \
     -H "Origin: https://viticultwhisky.co.uk" \
     -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' | grep -q "success.*true"
   
   if [ $? -eq 0 ]; then
     echo "✅ Admin login working before deployment"
   else
     echo "❌ STOP - Admin login broken BEFORE deployment"
     exit 1
   fi
   ```

### 🚀 DURING DEPLOYMENT

4. **Use Staged Deployment**
   ```bash
   # Extract to temporary location first
   cd /tmp
   tar -xzf new-deployment.tar.gz
   
   # Validate extracted files
   if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
     echo "❌ Invalid deployment package"
     exit 1
   fi
   ```

5. **Preserve Critical Files**
   ```bash
   # Always preserve these files
   cp /var/www/viticultwhisky/backend/.env.production /tmp/env-backup
   cp -r /var/www/viticultwhisky/frontend/public/whisky /tmp/whisky-backup
   cp -r /var/www/viticultwhisky/frontend/public/videos /tmp/videos-backup
   ```

### ✅ AFTER DEPLOYMENT

6. **Run Auto-Fix Script**
   ```bash
   cd /var/www/viticultwhisky/backend
   ./scripts/deployment/auto-fix-deployment.sh
   ```

7. **Run Full System Test**
   ```bash
   cd /Users/adityapachauri/Desktop/Whisky/playwright-tests
   node test-live-admin-working.js
   ```

## 🚨 CRITICAL FAILURE PATTERNS TO PREVENT

| Issue | Prevention | Auto-Fix |
|-------|-----------|----------|
| ENCRYPTION_KEY length | validate-env-production.sh | auto-fix-deployment.sh |
| Missing localhost CORS | validate-env-production.sh | auto-fix-deployment.sh |
| Wrong nginx proxy port | Manual check required | Document in troubleshooting |
| Missing image directories | Backup/restore procedure | Copy from backup |
| NODE_ENV not production | validate-env-production.sh | auto-fix-deployment.sh |

## 🔄 ROLLBACK PROCEDURE

If deployment fails:

```bash
# 1. Stop services
pm2 stop viticult-backend

# 2. Restore from backup
LATEST_BACKUP=$(ls -t /tmp/backup-*.tar.gz | head -1)
cd /
tar -xzf "$LATEST_BACKUP"

# 3. Restart services
pm2 start viticult-backend

# 4. Verify
curl -s http://localhost:5001/api/health
```

## 📋 DEPLOYMENT LOG TEMPLATE

```
DEPLOYMENT: $(date)
===================
□ Validation script passed
□ Backup created: backup-YYYYMMDD-HHMMSS
□ Admin login tested (before)
□ Files extracted to staging
□ Critical files preserved
□ Deployment copied
□ Auto-fix script run
□ Admin login tested (after)
□ Full system test passed
□ Performance check passed

RESULT: SUCCESS/FAILED
ISSUES: None/List any issues
ROLLBACK: N/A/Backup used
```