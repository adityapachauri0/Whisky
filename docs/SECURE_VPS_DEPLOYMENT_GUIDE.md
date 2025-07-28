# 🔒 Secure VPS Deployment Guide - Step by Step

## 📍 STEP 1: Find Existing Project

**Run this on your VPS:**

```bash
# Option 1: Quick search
find / -name "package.json" -type f 2>/dev/null | xargs grep -l "viticult\|whisky" 2>/dev/null

# Option 2: Use our script
wget https://raw.githubusercontent.com/yourusername/whisky/main/scripts/find-project-vps.sh
bash find-project-vps.sh
```

**Common locations to check:**
- `/var/www/`
- `/home/username/`
- `/opt/`
- `/srv/`

**Once found, set the project directory:**
```bash
export PROJECT_DIR="/path/to/your/project"
cd $PROJECT_DIR
```

---

## 📦 STEP 2: Backup Current State

**IMPORTANT: Always backup before making changes!**

```bash
# Create backup directory
sudo mkdir -p /backup/whisky-deployment
cd /backup/whisky-deployment

# Backup current project
sudo tar -czf project-backup-$(date +%Y%m%d-%H%M%S).tar.gz $PROJECT_DIR

# Backup nginx config if exists
sudo cp -r /etc/nginx/sites-available/* ./nginx-backup/ 2>/dev/null

# Backup PM2 processes
pm2 save
pm2 dump > pm2-backup.json

# Backup environment files if they exist
cp $PROJECT_DIR/backend/.env ./backend-env-backup 2>/dev/null
cp $PROJECT_DIR/frontend/.env ./frontend-env-backup 2>/dev/null

echo "✅ Backup completed at: /backup/whisky-deployment"
```

---

## 🔄 STEP 3: Update Project with Security Fixes

**Pull latest changes WITHOUT overwriting your config:**

```bash
cd $PROJECT_DIR

# Stash any local changes
git stash save "Local configuration before security update"

# Check current branch
git branch

# Pull latest changes
git pull origin main

# Check if you need to restore any local configs
git stash list
```

**Apply our security fixes manually (if not in git):**

```bash
# 1. Update frontend/.gitignore
echo ".env" >> frontend/.gitignore

# 2. Remove hardcoded credentials from Login component
sed -i '/<p className="text-sm text-gray-400">/,/<\/p>/d' frontend/src/pages/Admin/Login.tsx

# 3. Copy new security files
# You'll need to transfer these from your local machine
```

---

## 🔐 STEP 4: Generate Secure Secrets

**Create a secure secrets generation script on VPS:**

```bash
cat > /tmp/generate-secrets.js << 'EOF'
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

console.log('=== Generating Secure Secrets ===\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Generate Session Secret  
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET=' + sessionSecret);

// Generate admin password
const adminPassword = crypto.randomBytes(16).toString('hex');
console.log('\nGenerated Admin Password: ' + adminPassword);
console.log('(Save this securely - you won\'t see it again!)\n');

// Hash the password
bcrypt.hash(adminPassword, 12).then(hash => {
  console.log('ADMIN_PASSWORD_HASH=' + hash);
});
EOF

# Run it
cd $PROJECT_DIR/backend
node /tmp/generate-secrets.js > ~/secrets.txt
echo "✅ Secrets saved to ~/secrets.txt"
```

---

## 🗄️ STEP 5: Configure MongoDB Security

**Enable MongoDB authentication:**

```bash
# 1. Connect to MongoDB
mongo

# 2. Switch to admin database
use admin

# 3. Create admin user
db.createUser({
  user: "mongoAdmin",
  pwd: "GENERATE_STRONG_PASSWORD_HERE",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

# 4. Create application database and user
use viticult-whisky
db.createUser({
  user: "viticultApp",
  pwd: "ANOTHER_STRONG_PASSWORD_HERE",
  roles: [ { role: "readWrite", db: "viticult-whisky" } ]
})

# 5. Exit mongo
exit

# 6. Enable authentication in MongoDB
sudo nano /etc/mongod.conf
```

**Add to mongod.conf:**
```yaml
security:
  authorization: enabled
```

**Restart MongoDB:**
```bash
sudo systemctl restart mongod
```

---

## 🔧 STEP 6: Configure Environment Variables

**Backend .env setup:**

```bash
cd $PROJECT_DIR/backend

# Backup existing .env if present
cp .env .env.backup 2>/dev/null

# Create new secure .env
cat > .env << 'EOF'
# Server
PORT=5001
NODE_ENV=production

# Database (update with your MongoDB credentials)
MONGODB_URI=mongodb://viticultApp:YOUR_MONGO_PASSWORD@localhost:27017/viticult-whisky?authSource=viticult-whisky

# Secrets (from ~/secrets.txt)
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
SESSION_SECRET=YOUR_GENERATED_SESSION_SECRET

# Admin (from ~/secrets.txt)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=YOUR_GENERATED_HASH

# Email
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# CORS
CORS_ORIGIN=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security
BCRYPT_ROUNDS=12
TOKEN_EXPIRY=24h
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Set permissions
chmod 600 .env
```

**Frontend .env setup:**

```bash
cd $PROJECT_DIR/frontend

# Create production .env
cat > .env << 'EOF'
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-actual-key
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your-key
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_ENV=production
EOF

chmod 600 .env
```

---

## 🏗️ STEP 7: Build and Install

**Install dependencies and build:**

```bash
# Backend
cd $PROJECT_DIR/backend
npm ci --production
npm audit fix

# Frontend  
cd $PROJECT_DIR/frontend
npm ci
npm run build

echo "✅ Build completed"
```

---

## 🌐 STEP 8: Configure Nginx

**Create secure Nginx configuration:**

```bash
# Backup existing config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Create new config
sudo nano /etc/nginx/sites-available/viticult-whisky
```

**Add this configuration (replace yourdomain.com):**

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL (will be configured by certbot)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Root directory
    root PROJECT_DIR/frontend/build;
    index index.html;

    # API proxy
    location /api {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React app
    location / {
        limit_req zone=general burst=20 nodelay;
        try_files $uri $uri/ /index.html;
    }
}
```

**Enable the site:**
```bash
# Replace PROJECT_DIR in nginx config
sudo sed -i "s|PROJECT_DIR|$PROJECT_DIR|g" /etc/nginx/sites-available/viticult-whisky

# Enable site
sudo ln -sf /etc/nginx/sites-available/viticult-whisky /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 🚀 STEP 9: Setup PM2 Process Manager

```bash
# Install PM2 globally if not installed
sudo npm install -g pm2

# Start backend
cd $PROJECT_DIR/backend
pm2 delete viticult-api 2>/dev/null
pm2 start server.js --name viticult-api --env production

# Save PM2 configuration
pm2 save
pm2 startup systemd -u $USER --hp $HOME
# Run the command that PM2 outputs

echo "✅ PM2 configured"
```

---

## 🔒 STEP 10: Configure SSL Certificate

```bash
# Install certbot if not installed
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ STEP 11: Security Verification

**Run security checks:**

```bash
# 1. Check MongoDB authentication
mongo -u viticultApp -p YOUR_PASSWORD --authenticationDatabase viticult-whisky

# 2. Test API endpoint
curl -I https://yourdomain.com/api/health

# 3. Check security headers
curl -I https://yourdomain.com

# 4. Verify firewall
sudo ufw status

# 5. Check PM2 status
pm2 status

# 6. Test admin login (should fail with wrong credentials)
curl -X POST https://yourdomain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrongpass"}'
```

---

## 🛡️ STEP 12: Final Security Hardening

```bash
# 1. Set up firewall if not already done
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 2. Install fail2ban
sudo apt-get install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 3. Configure unattended upgrades
sudo apt-get install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

# 4. Set up monitoring script
cat > /home/$USER/security-check.sh << 'EOF'
#!/bin/bash
echo "=== Security Status ==="
echo "1. Failed SSH attempts:"
sudo grep "Failed password" /var/log/auth.log | tail -5
echo -e "\n2. API errors:"
pm2 logs viticult-api --err --lines 10
echo -e "\n3. Disk usage:"
df -h
echo -e "\n4. Memory:"
free -h
EOF

chmod +x /home/$USER/security-check.sh

# 5. Set up daily backup
sudo crontab -e
# Add: 0 2 * * * mongodump --uri="mongodb://viticultApp:PASSWORD@localhost:27017/viticult-whisky?authSource=viticult-whisky" --out=/backup/mongo-$(date +\%Y\%m\%d)
```

---

## 🎉 Deployment Complete!

**Test everything:**
1. Visit https://yourdomain.com
2. Try logging into admin panel
3. Submit a contact form
4. Check all pages load correctly

**Monitor logs:**
```bash
# Watch PM2 logs
pm2 logs

# Watch Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Remember to:**
- ✅ Delete ~/secrets.txt after saving passwords
- ✅ Set up regular backups
- ✅ Monitor logs daily
- ✅ Keep system updated
- ✅ Change admin password regularly

---

## 🆘 Troubleshooting

**If frontend shows errors:**
```bash
cd $PROJECT_DIR/frontend
npm run build
sudo systemctl reload nginx
```

**If API not responding:**
```bash
pm2 restart viticult-api
pm2 logs viticult-api
```

**If MongoDB connection fails:**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check credentials
mongo -u viticultApp -p YOUR_PASSWORD --authenticationDatabase viticult-whisky
```