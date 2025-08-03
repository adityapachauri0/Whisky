# Permanent & Secure Admin Login Solution

## 🔒 Security Improvements

### 1. **Strong Password Policy**
```bash
# Generate strong password
openssl rand -base64 32
# Example: 7Kj9$mN#pQ2@xR5&wL8*aF3^bG6!dH4

# Update password hash
cd /var/www/viticultwhisky/backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_STRONG_PASSWORD', 12).then(hash => console.log(hash));"
```

### 2. **Dedicated Service User**
```bash
# Create limited user for node apps
sudo useradd -r -s /bin/false nodeapp
sudo chown -R nodeapp:nodeapp /var/www/viticultwhisky

# Update PM2 to run as nodeapp
pm2 delete all
sudo -u nodeapp pm2 start ecosystem.config.js
sudo -u nodeapp pm2 save
sudo -u nodeapp pm2 startup
```

### 3. **Fix Environment Loading**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'viticult-backend',
    script: './server.js',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    // Load .env.production automatically
    node_args: '-r dotenv/config',
    env_file: '.env.production'
  }]
};
```

### 4. **Implement 2FA**
```javascript
// Install packages
npm install speakeasy qrcode

// Add to User model
twoFactorSecret: { type: String },
twoFactorEnabled: { type: Boolean, default: false }

// Add 2FA routes
router.post('/admin/enable-2fa', authenticate, adminController.enableTwoFactor);
router.post('/admin/verify-2fa', adminController.verifyTwoFactor);
```

## 🏗️ Permanent Fixes

### 1. **Fix Frontend API Call**
```javascript
// In frontend services/api.js or similar
// Change from:
const API_URL = '/api/api';

// To:
const API_URL = '/api';

// Or fix the specific login call:
const login = async (credentials) => {
  const response = await fetch('/api/admin/login', {  // Not /api/api/admin/login
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};
```

### 2. **Deployment Script**
```bash
#!/bin/bash
# deploy-backend.sh

# Ensure environment variables
if [ ! -f ".env.production" ]; then
  echo "Error: .env.production not found"
  exit 1
fi

# Validate required variables
required_vars="NODE_ENV ADMIN_EMAIL ADMIN_PASSWORD_HASH JWT_SECRET"
for var in $required_vars; do
  if ! grep -q "^$var=" .env.production; then
    echo "Error: $var not found in .env.production"
    exit 1
  fi
done

# Deploy
git pull origin main
npm install --production
npm run build

# Restart with correct environment
pm2 restart ecosystem.config.js --update-env
```

### 3. **Nginx Security Headers**
```nginx
# Add to nginx config
server {
    # ... existing config ...
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # Hide server version
    server_tokens off;
}
```

### 4. **Rate Limiting Enhancement**
```javascript
// Enhanced rate limiting for admin routes
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.'
    });
  }
});

// Apply to all admin auth routes
app.use('/api/admin/login', adminLoginLimiter);
app.use('/api/auth/admin/login', adminLoginLimiter);
```

## 🔐 Security Checklist

### Immediate Actions
- [ ] Change admin password from 'admin123' to strong password
- [ ] Remove the `/api/api` workaround after fixing frontend
- [ ] Set up PM2 to run as non-root user
- [ ] Configure PM2 to use .env.production directly

### Short Term (1 week)
- [ ] Implement 2FA for admin accounts
- [ ] Add security headers in nginx
- [ ] Set up fail2ban for brute force protection
- [ ] Implement session management with expiry

### Long Term (1 month)
- [ ] Add audit logging for all admin actions
- [ ] Implement IP whitelisting for admin panel
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Automated deployment pipeline

## 🚀 Monitoring & Alerts

### 1. **Login Monitoring**
```javascript
// Log all login attempts
const logLoginAttempt = (email, success, ip, reason = null) => {
  const log = {
    timestamp: new Date(),
    email,
    success,
    ip,
    reason,
    userAgent: req.get('user-agent')
  };
  
  // Save to database or logging service
  logger.info('Login attempt:', log);
  
  // Alert on suspicious activity
  if (!success) {
    checkSuspiciousActivity(ip, email);
  }
};
```

### 2. **Fail2Ban Configuration**
```bash
# /etc/fail2ban/jail.local
[nodejs-admin]
enabled = true
port = https,http
filter = nodejs-admin
logpath = /var/www/viticultwhisky/backend/logs/access.log
maxretry = 5
bantime = 3600
```

## 📋 Final Security Score

Current Implementation: **3/10** ⚠️
- Basic auth works ✓
- HTTPS enabled ✓
- Password hashing ✓
- Weak password ✗
- No 2FA ✗
- Running as root ✗
- Frontend bug workaround ✗

Target Implementation: **9/10** ✅
- Strong passwords ✓
- 2FA enabled ✓
- Non-root user ✓
- Proper frontend fix ✓
- Rate limiting ✓
- Security headers ✓
- Monitoring ✓
- IP whitelisting ✓
- Audit logging ✓

---
*Remember: Security is not a one-time fix but an ongoing process*