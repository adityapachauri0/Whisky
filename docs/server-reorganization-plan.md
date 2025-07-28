# Whisky Project Server Reorganization Plan

## Current Problems
1. Multiple file transfers over 15 days
2. Duplicate files in different locations
3. Unclear which files are actually being used
4. Potential version conflicts
5. SSH access issues making management difficult

## Proposed Solution

### Step 1: Audit Current State
Run the audit script to identify:
- All whisky-related directories
- Duplicate files
- Which backend PM2 is actually using
- Actual nginx configuration

### Step 2: Create Clean Structure
```
/var/www/viticultwhisky/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── node_modules/
├── frontend/
│   ├── build/
│   └── (other frontend files)
└── logs/
```

### Step 3: Cleanup Commands
```bash
# 1. Stop PM2
pm2 stop whisky-backend

# 2. Backup current working directory
tar -czf /root/whisky-backup-$(date +%Y%m%d).tar.gz /var/www/viticultwhisky

# 3. Remove duplicates (after identifying them)
# Example: rm -rf /home/nodeapp/whisky-old
# Example: rm -rf /root/test-whisky

# 4. Ensure single source of truth
cd /var/www/viticultwhisky/backend
npm ci  # Clean install dependencies

# 5. Update PM2 to use correct path
pm2 delete whisky-backend
pm2 start server.js --name whisky-backend --cwd /var/www/viticultwhisky/backend
pm2 save
pm2 startup

# 6. Set correct permissions
chown -R nodeapp:nodeapp /var/www/viticultwhisky
```

### Step 4: Create Deployment Standards
1. Always deploy to `/var/www/viticultwhisky`
2. Use version tags for backups
3. Document any path changes
4. Keep a deployment log

### Step 5: Alternative Access Methods
Since SSH is blocked:

1. **GitHub Deployment**
   - Push files to a private repo
   - Pull from server using deploy keys

2. **Web-based File Manager**
   - Use VPS control panel file manager
   - Upload files directly

3. **Temporary Upload API**
   - Create secure upload endpoint
   - Use it for emergency deployments
   - Remove after use

## Immediate Actions

1. **Run audit script** (via web terminal or control panel)
2. **Identify the ACTUAL running backend path**
3. **Clean up duplicates**
4. **Standardize on single location**
5. **Document the final structure**

## File Transfer via GitHub (Since SSH is blocked)

```bash
# On local machine:
cd /Users/adityapachauri/Desktop/Whisky
git init
git add backend/utils/getClientIp.js backend/controllers/contact.controller.js
git commit -m "IP address fix"
git remote add origin https://github.com/yourusername/whisky-deploy.git
git push origin main

# On server (via web terminal):
cd /tmp
git clone https://github.com/yourusername/whisky-deploy.git
cp whisky-deploy/backend/utils/getClientIp.js /var/www/viticultwhisky/backend/utils/
cp whisky-deploy/backend/controllers/contact.controller.js /var/www/viticultwhisky/backend/controllers/
cd /var/www/viticultwhisky/backend
pm2 restart whisky-backend
```

This approach will:
1. Give you a clean, organized server
2. Eliminate confusion from duplicates
3. Establish clear deployment procedures
4. Work around SSH limitations