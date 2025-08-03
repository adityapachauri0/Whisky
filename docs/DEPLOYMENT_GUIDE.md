# Deployment Guide

## Overview

This comprehensive deployment guide covers setting up the ViticultWhisky backend in both development and production environments. The backend is a Node.js application with MongoDB database, JWT authentication, and comprehensive security features.

## Prerequisites

### System Requirements

**Development**:
- Node.js 18+ (LTS recommended)
- MongoDB 6.0+
- npm 9+ or yarn 1.22+
- Git 2.30+

**Production**:
- Ubuntu 22.04 LTS or CentOS 8+
- Node.js 18+ (LTS)
- MongoDB 6.0+ (Replica Set recommended)
- Nginx 1.20+
- PM2 for process management
- SSL certificate (Let's Encrypt recommended)

## Development Setup

### 1. Install Dependencies

```bash
# Install Node.js using NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Clone repository
git clone https://github.com/yourusername/whisky-backend.git
cd whisky-backend/backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create `.env` file:

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whisky_investment_dev
JWT_SECRET=your_64_char_secret_here
ADMIN_EMAIL=admin@viticult.co.uk
ADMIN_PASSWORD_HASH=$2a$12$your.bcrypt.hash.here
EMAIL_FROM=noreply@viticult.co.uk
SMTP_HOST=localhost
SMTP_PORT=1025
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```javascript
// Connect to MongoDB
mongosh

// Create database and user
use whisky_investment_dev
db.createUser({
  user: "whisky_app",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "whisky_investment_dev" }]
})
```

### 4. Start Development Server

```bash
npm run dev
# or
npm start

# Verify server
curl http://localhost:5000/api/health
```

## Production Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Install PM2
sudo npm install -g pm2

# Create application user
sudo adduser --system --group --home /opt/whisky whisky
sudo mkdir -p /opt/whisky/{app,logs,backups}
sudo chown -R whisky:whisky /opt/whisky
```

### 2. MongoDB Production Setup

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Configure MongoDB with authentication
sudo nano /etc/mongod.conf
```

MongoDB config (`/etc/mongod.conf`):
```yaml
net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
```

Create database users:
```javascript
// Connect as admin
mongosh --port 27017

// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "secure_admin_password",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
})

// Create app user
use whisky_investment
db.createUser({
  user: "whisky_app",
  pwd: "secure_app_password",
  roles: [
    { role: "readWrite", db: "whisky_investment" },
    { role: "dbAdmin", db: "whisky_investment" }
  ]
})
```

### 3. Application Deployment

```bash
# Switch to application user
sudo -u whisky -i
cd /opt/whisky/app

# Clone and setup
git clone https://github.com/yourusername/whisky-backend.git .
npm ci --only=production

# Create production environment file
nano .env
```

Production `.env`:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://whisky_app:secure_app_password@localhost:27017/whisky_investment?authSource=whisky_investment
JWT_SECRET=your_super_secure_64_char_production_secret_here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=$2a$12$your.secure.production.hash.here
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://yourdomain.com
TRUST_PROXY=true
```

### 4. PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'whisky-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_file: '/opt/whisky/logs/combined.log',
    out_file: '/opt/whisky/logs/out.log',
    error_file: '/opt/whisky/logs/error.log',
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 5. SSL and Nginx Setup

Install SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Nginx configuration (`/etc/nginx/sites-available/whisky-backend`):
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000" always;

    # API Routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin Login (More Restrictive)
    location /api/admin/login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://localhost:5000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable configuration:
```bash
sudo ln -s /etc/nginx/sites-available/whisky-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection | `mongodb://user:pass@host/db` |
| `JWT_SECRET` | JWT signing secret | `64-char-random-string` |
| `ADMIN_EMAIL` | Admin email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD_HASH` | Admin password hash | `$2a$12$...` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_EXPIRES_IN` | `24h` | JWT expiration |
| `SMTP_HOST` | - | Email server |
| `SMTP_PORT` | `587` | Email port |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL |
| `LOG_LEVEL` | `info` | Logging level |

## Monitoring and Logging

### Health Check

Create `healthcheck.js`:
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  timeout: 3000
};

const req = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.on('timeout', () => process.exit(1));
req.end();
```

### Log Rotation

Configure logrotate (`/etc/logrotate.d/whisky-backend`):
```
/opt/whisky/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 whisky whisky
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Monitoring Commands

```bash
# Check application status
pm2 status
pm2 logs whisky-backend

# Monitor system resources
htop
df -h
free -h

# Check database status
sudo systemctl status mongod
mongosh --eval "db.adminCommand('ping')"
```

## Database Backup

### Automated Backup Script

Create `scripts/db-backup.sh`:
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/whisky/backups/db"
DB_NAME="whisky_investment"

mkdir -p $BACKUP_DIR

mongodump --host localhost:27017 \
          --db $DB_NAME \
          --username whisky_app \
          --password secure_app_password \
          --authenticationDatabase $DB_NAME \
          --out $BACKUP_DIR/$DATE

tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"
```

### Setup Cron Job

```bash
# Edit crontab for whisky user
sudo -u whisky crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/whisky/app/scripts/db-backup.sh >> /opt/whisky/logs/backup.log 2>&1
```

## Security Hardening

### Firewall Setup

```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Block MongoDB from external access
sudo ufw deny 27017

# Check status
sudo ufw status
```

### Fail2ban Configuration

```bash
sudo apt install fail2ban

# Configure for nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/*error.log
maxretry = 10
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Check:**
- Environment variables: `node -e "console.log(process.env.MONGODB_URI)"`
- MongoDB status: `sudo systemctl status mongod`
- Application logs: `pm2 logs whisky-backend`
- Manual start: `node server.js`

#### 2. Database Connection Failed

**Solutions:**
- Verify MongoDB is running
- Check database credentials
- Test connection: `mongosh "$MONGODB_URI"`
- Review MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`

#### 3. High Memory Usage

**Solutions:**
- Monitor with: `pm2 monit`
- Add memory limit: `max_memory_restart: '1G'` in PM2 config
- Optimize database queries
- Check for memory leaks

#### 4. SSL Certificate Issues

**Solutions:**
- Renew certificate: `sudo certbot renew`
- Check certificate status: `sudo certbot certificates`
- Test SSL: `curl -I https://yourdomain.com`

### Emergency Procedures

#### Quick Restart
```bash
pm2 restart whisky-backend
```

#### Rollback Deployment
```bash
cd /opt/whisky/app
git reset --hard HEAD~1
pm2 reload whisky-backend
```

#### Database Recovery
```bash
mongorestore --host localhost:27017 \
             --db whisky_investment \
             --username whisky_app \
             --password secure_app_password \
             --authenticationDatabase whisky_investment \
             /path/to/backup
```

## Maintenance Tasks

### Daily
- Check application status: `pm2 status`
- Review error logs: `tail -f /opt/whisky/logs/error.log`
- Monitor disk space: `df -h`

### Weekly  
- Update system packages: `sudo apt update && sudo apt upgrade`
- Check SSL certificate: `sudo certbot certificates`
- Review access logs

### Monthly
- Update dependencies: `npm audit && npm update`  
- Performance review
- Security audit
- Clean old logs and backups

---

*Last Updated: January 2024*  
*Version: 1.0*  
*Deployment Guide for ViticultWhisky Backend*