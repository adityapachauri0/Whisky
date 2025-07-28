# Quick VPS Deployment Guide - 10 Minutes Setup

> **Goal**: Get ViticultWhisky running on VPS in under 10 minutes after git clone

## 📋 Prerequisites (One-time VPS Setup)

**Before cloning, ensure your VPS has:**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install -g pm2

# Start MongoDB
sudo systemctl start mongod && sudo systemctl enable mongod
```

## 🚀 10-Minute Deployment Steps

### Step 1: Clone and Setup (2 minutes)
```bash
# Clone your repository
git clone https://github.com/yourusername/viticultwhisky.git
cd viticultwhisky

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && cd ..
```

### Step 2: Environment Configuration (2 minutes)
```bash
# Create backend environment file
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/viticultwhisky

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-key-change-this-immediately
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your-secure-cookie-secret-change-this

# Email Configuration (Gmail example)
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password

# CORS
CORS_ORIGIN=https://yourdomain.com
EOF

# Create frontend environment file
cat > frontend/.env.production << 'EOF'
REACT_APP_API_URL=https://yourdomain.com/api
GENERATE_SOURCEMAP=false
EOF
```

### Step 3: Build Frontend (2 minutes)
```bash
cd frontend
npm run build
cd ..
```

### Step 4: Create Admin User (1 minute)
```bash
cd backend
node scripts/setup-admin.js
cd ..
```

### Step 5: Nginx Configuration (2 minutes)
```bash
# Create Nginx config
sudo tee /etc/nginx/sites-available/viticultwhisky << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend static files
    root /home/ubuntu/viticultwhisky/frontend/build;
    index index.html;
    
    # API routes
    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/viticultwhisky /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Step 6: Start Application (1 minute)
```bash
# Start backend with PM2
cd backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Follow the PM2 startup command it shows
cd ..
```

## ✅ Verification

**Check if everything is running:**
```bash
# Check backend
curl http://localhost:5001/api/health

# Check frontend
curl http://localhost:80

# Check PM2 status
pm2 status

# Check MongoDB
sudo systemctl status mongod

# Check Nginx
sudo systemctl status nginx
```

## 🔧 Quick Customization

### Update Domain Name
```bash
# Replace 'yourdomain.com' in these files:
# 1. backend/.env (CORS_ORIGIN)
# 2. frontend/.env.production (REACT_APP_API_URL)
# 3. /etc/nginx/sites-available/viticultwhisky (server_name)

# Then restart services:
sudo systemctl reload nginx
pm2 restart all
```

### SSL Setup (Optional - 5 minutes)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📱 Access Your Application

- **Website**: http://yourdomain.com
- **Admin Panel**: http://yourdomain.com/admin/login
- **Admin Credentials**: admin@yourdomain.com / secure-admin-password

## 🚨 Post-Deployment Checklist

### Immediate (Required)
- [ ] Change JWT_SECRET and COOKIE_SECRET to unique values
- [ ] Update admin password via admin panel
- [ ] Configure email settings with your SMTP
- [ ] Test contact form and sell-whisky form
- [ ] Test admin login and dashboard

### Optional Enhancements
- [ ] Setup SSL certificate
- [ ] Configure domain DNS
- [ ] Setup database backups
- [ ] Configure monitoring

## 🔄 Updates and Maintenance

### Deploy Code Updates
```bash
cd viticultwhisky
git pull origin main

# If backend changes
cd backend && npm install && pm2 restart all

# If frontend changes
cd frontend && npm install && npm run build

# If both
cd backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart all
```

### Common Commands
```bash
# View logs
pm2 logs

# Restart application
pm2 restart all

# Stop application
pm2 stop all

# Check system resources
htop
df -h
```

## 🆘 Quick Troubleshooting

### Application Not Loading
```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod

# Check logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### Database Issues
```bash
# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Form Submissions Not Working
```bash
# Check backend logs
pm2 logs viticultwhisky-backend

# Test API directly
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

---

**🎯 Result**: Professional whisky investment platform running in under 10 minutes!

**📞 Support**: Check docs/MASTER_TROUBLESHOOTING_GUIDE.md for detailed solutions