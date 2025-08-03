# 🥃 ViticultWhisky Deployment Guide

## 🚀 Quick Start

### **Single Command Deployment**
```bash
./deploy-whisky.sh deploy
```

## 📋 Available Commands

### **Fresh Deployment**
```bash
./deploy-whisky.sh deploy
```
- Complete fresh installation
- Cleans existing deployment
- Installs dependencies and builds frontend
- Sets up admin user and environment
- Configures all services

### **Update Existing Deployment**
```bash
./deploy-whisky.sh update
```
- Updates code without full reinstall
- Preserves existing configuration
- Rebuilds frontend and restarts services

### **Quick Code Update (Skip Build)**
```bash
./deploy-whisky.sh update --skip-build
```
- Fastest update method
- Only updates backend code
- Skips frontend rebuild

### **Diagnose Issues**
```bash
./deploy-whisky.sh diagnose
```
- Comprehensive system health check
- Identifies configuration issues
- Tests all services and API endpoints

### **Fix Common Issues**
```bash
./deploy-whisky.sh fix
```
- Automatically fixes admin login issues
- Repairs environment configuration
- Restarts services with correct settings

### **Test Deployment Health**
```bash
./deploy-whisky.sh test
```
- Quick health verification
- Tests API endpoints and authentication
- Confirms public accessibility

## 🎯 Common Use Cases

### **First Time Deployment**
```bash
./deploy-whisky.sh deploy
```

### **Code Changes (Full)**
```bash
./deploy-whisky.sh update
```

### **Backend-Only Changes**
```bash
./deploy-whisky.sh update --skip-build
```

### **Troubleshooting Login Issues**
```bash
./deploy-whisky.sh diagnose
./deploy-whisky.sh fix
```

### **Verify Everything Works**
```bash
./deploy-whisky.sh test
```

## 🔧 What Each Mode Does

### **Deploy Mode**
1. ✅ Cleans existing deployment
2. ✅ Uploads all project files
3. ✅ Installs Node.js dependencies
4. ✅ Builds React frontend
5. ✅ Creates production environment
6. ✅ Sets up admin user in MongoDB
7. ✅ Configures PM2 backend service
8. ✅ Updates Nginx configuration
9. ✅ Runs health verification tests

### **Diagnose Mode**
1. 🔍 Checks project directory structure
2. 🔍 Verifies all services are running
3. 🔍 Validates configuration files
4. 🔍 Tests API endpoints
5. 🔍 Performs admin login test
6. 🔍 Reports issues with solutions

### **Fix Mode**
1. 🔧 Repairs environment configuration
2. 🔧 Recreates admin user if needed
3. 🔧 Restarts PM2 with correct settings
4. 🔧 Updates Nginx proxy configuration
5. 🔧 Verifies fixes with login test

## 📊 System Requirements

### **VPS Configuration**
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- MongoDB installed and running
- Nginx installed and configured
- PM2 installed globally
- SSH key authentication set up

### **Domain & SSL**
- Domain: `viticultwhisky.co.uk`
- SSL certificates in: `/etc/letsencrypt/live/viticultwhisky.co.uk/`

## 🔑 Default Credentials

**Admin Login:**
- Email: `admin@viticultwhisky.co.uk`
- Password: `admin123`

**Admin Panel:** https://viticultwhisky.co.uk/admin

⚠️ **Change default password after first login!**

## 🚨 Troubleshooting

### **Connection Issues**
```bash
# Test VPS connectivity
ssh root@173.249.4.116 "echo 'Connected successfully'"

# Check SSH key setup
```

### **Admin Login Failing**
```bash
# Run diagnostics first
./deploy-whisky.sh diagnose

# Apply automatic fixes
./deploy-whisky.sh fix

# Verify fix worked
./deploy-whisky.sh test
```

### **Services Not Running**
```bash
# Check service status on VPS
ssh root@173.249.4.116 "pm2 list && systemctl status nginx mongod"

# Restart services
./deploy-whisky.sh fix
```

### **Frontend Not Loading**
```bash
# Rebuild frontend
./deploy-whisky.sh update

# Check Nginx configuration
ssh root@173.249.4.116 "nginx -t && systemctl status nginx"
```

## 📂 Project Structure

```
/var/www/whisky/
├── backend/                 # Node.js API server
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── scripts/
│       └── setup-admin.js  # Admin user creation
├── frontend/               # React application
│   └── build/              # Production build
└── deploy-whisky.sh        # This deployment script
```

## 🎉 Success Indicators

### **Deployment Successful When:**
- ✅ All health checks pass
- ✅ Admin login test succeeds
- ✅ Website loads at https://viticultwhisky.co.uk
- ✅ Admin panel accessible
- ✅ PM2 shows backend running
- ✅ No errors in diagnostics

## 📞 Support

If you encounter issues:

1. **Run diagnostics:** `./deploy-whisky.sh diagnose`
2. **Apply fixes:** `./deploy-whisky.sh fix`
3. **Verify health:** `./deploy-whisky.sh test`
4. **Check logs:** `ssh root@173.249.4.116 "pm2 logs whisky-backend"`

---

*This deployment system combines all previous scripts into one organized, comprehensive solution.*