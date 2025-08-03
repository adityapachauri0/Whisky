# 🚀 ViticultWhisky VPS Deployment Checklist

## ✅ Pre-Deployment Security Fixes Completed

### 1. **Code Security**
- [x] Removed hardcoded admin credentials from Login.tsx
- [x] Added .env to .gitignore
- [x] Fixed visibility issues in UI components
- [x] Authentication uses environment variables
- [x] Password validation strengthened (8+ chars, complexity requirements)

### 2. **Environment Configuration**
- [x] Created .env.example templates for frontend and backend
- [x] JWT secret generation script created (`scripts/generate-secrets.js`)
- [x] Security headers configured in backend (Helmet.js)
- [x] CORS properly configured with allowed origins

### 3. **Infrastructure Security**
- [x] Nginx security configuration created with:
  - SSL/TLS best practices
  - Security headers (CSP, HSTS, etc.)
  - Rate limiting zones
  - DDoS protection
- [x] Deployment script created (`scripts/deploy-vps.sh`)
- [x] Security monitoring script created (`scripts/security-monitor.sh`)

### 4. **Dependency Security**
- [x] NPM vulnerabilities reduced from 11 to 9
- [x] Non-breaking security updates applied
- [ ] Note: Remaining vulnerabilities require React 18 downgrade or react-scripts update

## 📋 Deployment Steps

### Step 1: Prepare Your VPS
```bash
# Update your VPS
sudo apt update && sudo apt upgrade -y

# Create a non-root user if needed
adduser deploy
usermod -aG sudo deploy
```

### Step 2: Generate Secrets Locally
```bash
cd /path/to/project
node scripts/generate-secrets.js
# Save the generated secrets securely
```

### Step 3: Prepare Environment Files
Create these files on your VPS (DO NOT commit to git):

**Backend .env:**
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb://viticultUser:YOUR_PASSWORD@localhost:27017/viticult-whisky?authSource=viticult-whisky
JWT_SECRET=[Generated JWT Secret]
SESSION_SECRET=[Generated Session Secret]
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=[Generated Password Hash]
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
CORS_ORIGIN=https://yourdomain.com
```

**Frontend .env:**
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-actual-key
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your-key
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Step 4: Deploy to VPS
```bash
# Copy deployment script to VPS
scp scripts/deploy-vps.sh user@your-vps:/tmp/

# SSH to VPS and run deployment
ssh user@your-vps
sudo bash /tmp/deploy-vps.sh
```

### Step 5: Post-Deployment Security

1. **Update Nginx Config:**
   - Replace `yourdomain.com` with your actual domain
   - Update SSL paths after Let's Encrypt setup

2. **MongoDB Security:**
   ```javascript
   // Create database users
   use admin
   db.createUser({
     user: "viticultAdmin",
     pwd: "strong-password-here",
     roles: [{role: "root", db: "admin"}]
   })
   
   use viticult-whisky
   db.createUser({
     user: "viticultUser", 
     pwd: "another-strong-password",
     roles: [{role: "readWrite", db: "viticult-whisky"}]
   })
   ```

3. **Configure PM2:**
   ```bash
   pm2 start backend/server.js --name viticult-api
   pm2 save
   pm2 startup
   ```

### Step 6: Security Verification

Run these commands to verify security:

```bash
# Check SSL configuration
curl -I https://yourdomain.com

# Test security headers
curl -H "X-Test: test" https://yourdomain.com/api/test

# Check firewall
sudo ufw status

# Monitor logs
pm2 logs
tail -f /var/log/nginx/viticult-access.log
```

## 🔒 Security Best Practices

### Daily Tasks
- [ ] Check logs for suspicious activity
- [ ] Monitor disk space
- [ ] Verify backups completed

### Weekly Tasks
- [ ] Run security monitoring script
- [ ] Update system packages
- [ ] Review user access logs
- [ ] Check SSL certificate expiry

### Monthly Tasks
- [ ] Rotate JWT secrets
- [ ] Update admin password
- [ ] Full security audit
- [ ] Test backup restoration

## 🚨 Emergency Procedures

### If Compromised:
1. Immediately change all passwords
2. Regenerate all secrets
3. Review access logs
4. Disable compromised accounts
5. Notify users if needed

### Important Commands:
```bash
# Stop all services
pm2 stop all
sudo systemctl stop nginx

# View recent logins
last -50

# Check for unauthorized access
grep "Failed password" /var/log/auth.log

# Emergency firewall block
sudo ufw deny from SUSPICIOUS_IP
```

## 📞 Support Contacts

- VPS Provider: [Your provider support]
- Domain Registrar: [Your registrar support]
- SSL Issues: Let's Encrypt Community
- MongoDB Support: MongoDB Community Forums

## ✅ Final Checklist Before Going Live

- [ ] All environment variables set correctly
- [ ] SSL certificate installed and working
- [ ] Firewall configured and enabled
- [ ] MongoDB authentication enabled
- [ ] Admin password changed from default
- [ ] Backup system tested
- [ ] Monitoring alerts configured
- [ ] Error tracking enabled (Sentry/similar)
- [ ] Load testing completed
- [ ] Security headers verified

---

**Remember:** Security is an ongoing process. Regular updates and monitoring are essential!