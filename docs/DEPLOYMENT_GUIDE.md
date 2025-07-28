# Deployment Guide

## Overview

This guide covers the complete deployment process for the ViticultWhisky platform, including development, staging, and production environments. The platform consists of a React frontend and Express.js backend with MongoDB database.

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Node.js       │    │   MongoDB       │
│   (Web Server)  │◄──►│   (Backend API) │◄──►│   (Database)    │
│   Port: 80/443  │    │   Port: 5001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   PM2 Process   │    │   Auth/Indexes  │
│   (React Build) │    │   Manager       │    │   (Optimized)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **CPU**: Minimum 2 cores, Recommended 4+ cores
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 20GB SSD
- **Network**: Static IP address
- **Domain**: Configured DNS pointing to server

### Software Dependencies
- Node.js v16 or higher
- npm v8 or higher
- MongoDB v5.0 or higher
- Nginx v1.18 or higher
- PM2 for process management
- SSL certificate (Let's Encrypt recommended)

## Environment Setup

### 1. Server Preparation

#### Update System
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### Install Node.js
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Install MongoDB
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Install Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Install PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 2. User and Directory Setup

#### Create Application User
```bash
# Create dedicated user for the application
sudo useradd -m -s /bin/bash viticult
sudo usermod -aG sudo viticult

# Switch to application user
sudo su - viticult
```

#### Create Application Directories
```bash
# Create application directories
mkdir -p /home/viticult/apps/viticultwhisky
mkdir -p /home/viticult/logs
mkdir -p /home/viticult/backups

# Set permissions
chmod 755 /home/viticult/apps
chmod 755 /home/viticult/logs
chmod 755 /home/viticult/backups
```

## Database Configuration

### 1. MongoDB Setup

#### Enable Authentication
```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "secure-admin-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})

# Create application database and user
use viticultwhisky
db.createUser({
  user: "viticultuser",
  pwd: "secure-app-password",
  roles: ["readWrite"]
})

exit
```

#### Configure MongoDB Authentication
```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf

# Add security section
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

#### Test Database Connection
```bash
# Test connection with authentication
mongosh "mongodb://viticultuser:secure-app-password@localhost:27017/viticultwhisky"
```

### 2. Database Indexes

#### Create Performance Indexes
```javascript
// Connect to database
mongosh "mongodb://viticultuser:secure-app-password@localhost:27017/viticultwhisky"

// Create indexes for better performance
db.contacts.createIndex({ "email": 1 })
db.contacts.createIndex({ "submittedAt": -1 })
db.contacts.createIndex({ "status": 1 })
db.sellwhiskies.createIndex({ "personalInfo.email": 1 })
db.sellwhiskies.createIndex({ "submittedAt": -1 })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
```

## Application Deployment

### 1. Code Deployment

#### Download Application Code
```bash
# Navigate to application directory
cd /home/viticult/apps

# Option 1: Git clone (if using Git repository)
git clone https://github.com/your-org/viticultwhisky.git
cd viticultwhisky

# Option 2: Upload files via SCP/SFTP
# scp -r ./viticultwhisky viticult@your-server:/home/viticult/apps/
```

#### Set File Permissions
```bash
# Set appropriate permissions
chmod -R 755 /home/viticult/apps/viticultwhisky
chown -R viticult:viticult /home/viticult/apps/viticultwhisky
```

### 2. Backend Configuration

#### Environment Variables
```bash
# Create production environment file
cd /home/viticult/apps/viticultwhisky/backend
nano .env
```

**Production .env file:**
```bash
# Environment
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb://viticultuser:secure-app-password@localhost:27017/viticultwhisky

# JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your-secure-cookie-secret-for-production

# Email Configuration
EMAIL_FROM=noreply@viticultwhisky.co.uk
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@viticultwhisky.co.uk
EMAIL_PASS=your-email-app-password

# CORS
CORS_ORIGIN=https://viticultwhisky.co.uk

# Admin User
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD=secure-admin-password-change-immediately

# Security
SESSION_SECRET=another-secure-session-secret-for-production

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
GTM_ID=your-gtm-id
```

#### Install Backend Dependencies
```bash
cd /home/viticult/apps/viticultwhisky/backend

# Install production dependencies
npm ci --only=production

# Or install all dependencies if you need dev tools
npm install
```

#### Create Admin User
```bash
# Run admin setup script
npm run setup-admin

# Or create manually
node scripts/setup-admin.js
```

### 3. Frontend Configuration

#### Environment Variables
```bash
# Create production environment file
cd /home/viticult/apps/viticultwhisky/frontend
nano .env.production
```

**Production .env.production file:**
```bash
# API Configuration
REACT_APP_API_URL=https://viticultwhisky.co.uk/api

# Analytics
REACT_APP_GTM_ID=your-gtm-id
REACT_APP_GA_ID=your-ga-id

# Environment
REACT_APP_ENV=production

# Build optimization
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

#### Install Frontend Dependencies and Build
```bash
cd /home/viticult/apps/viticultwhisky/frontend

# Install dependencies
npm ci

# Create production build
npm run build

# Verify build created
ls -la build/
```

## Web Server Configuration

### 1. Nginx Configuration

#### Create Nginx Configuration File
```bash
sudo nano /etc/nginx/sites-available/viticultwhisky
```

**Nginx Configuration:**
```nginx
# Upstream backend server
upstream viticultwhisky_backend {
    server 127.0.0.1:5001;
    keepalive 32;
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;
    return 301 https://viticultwhisky.co.uk$request_uri;
}

# HTTPS server configuration
server {
    listen 443 ssl http2;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/viticultwhisky.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viticultwhisky.co.uk/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Root directory for static files
    root /home/viticult/apps/viticultwhisky/frontend/build;
    index index.html;

    # Client IP forwarding
    real_ip_header X-Forwarded-For;
    set_real_ip_from 0.0.0.0/0;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API routes
    location /api {
        proxy_pass http://viticultwhisky_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Frontend routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache control for HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ /(package\.json|package-lock\.json|\.env) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### Enable Nginx Configuration
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/viticultwhisky /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 2. SSL Certificate Setup

#### Install Certbot
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate
```bash
# Get SSL certificate
sudo certbot --nginx -d viticultwhisky.co.uk -d www.viticultwhisky.co.uk

# Test automatic renewal
sudo certbot renew --dry-run
```

#### Setup Auto-renewal
```bash
# Create cron job for auto-renewal
sudo crontab -e

# Add this line to run renewal check twice daily
0 12 * * * /usr/bin/certbot renew --quiet
```

## Process Management

### 1. PM2 Configuration

#### Create PM2 Ecosystem File
```bash
cd /home/viticult/apps/viticultwhisky
nano ecosystem.config.js
```

**PM2 Configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'viticultwhisky-backend',
    script: './backend/server.js',
    cwd: '/home/viticult/apps/viticultwhisky',
    instances: 2, // or 'max' for all CPU cores
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: '/home/viticult/logs/pm2-error.log',
    out_file: '/home/viticult/logs/pm2-out.log',
    log_file: '/home/viticult/logs/pm2.log',
    pid_file: '/home/viticult/logs/pm2.pid',
    merge_logs: true,
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

#### Start Application with PM2
```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Show status
pm2 status

# View logs
pm2 logs

# Monitor
pm2 monit
```

### 2. System Service Configuration

#### Create Systemd Service (Alternative to PM2)
```bash
sudo nano /etc/systemd/system/viticultwhisky.service
```

**Systemd Service File:**
```ini
[Unit]
Description=ViticultWhisky Backend
After=network.target mongodb.service

[Service]
Type=simple
User=viticult
WorkingDirectory=/home/viticult/apps/viticultwhisky/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5001
StandardOutput=file:/home/viticult/logs/viticultwhisky.log
StandardError=file:/home/viticult/logs/viticultwhisky-error.log

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable viticultwhisky

# Start service
sudo systemctl start viticultwhisky

# Check status
sudo systemctl status viticultwhisky
```

## Monitoring and Logging

### 1. Log Configuration

#### Create Log Rotation
```bash
sudo nano /etc/logrotate.d/viticultwhisky
```

**Log Rotation Configuration:**
```
/home/viticult/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    copytruncate
    notifempty
    create 644 viticult viticult
}
```

#### Setup Log Monitoring
```bash
# Create log monitoring script
nano /home/viticult/scripts/log-monitor.sh
```

**Log Monitoring Script:**
```bash
#!/bin/bash

LOG_FILE="/home/viticult/logs/viticultwhisky-error.log"
ALERT_EMAIL="admin@viticultwhisky.co.uk"

# Check for errors in the last 5 minutes
if tail -n 100 $LOG_FILE | grep -q "ERROR\|FATAL"; then
    echo "Error detected in application logs" | mail -s "ViticultWhisky Alert" $ALERT_EMAIL
fi
```

### 2. Health Monitoring

#### Create Health Check Script
```bash
nano /home/viticult/scripts/health-check.sh
```

**Health Check Script:**
```bash
#!/bin/bash

# Check if backend is responding
if ! curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "Backend health check failed"
    # Restart the service
    pm2 restart viticultwhisky-backend
    # Send alert
    echo "Backend service restarted due to health check failure" | mail -s "Service Alert" admin@viticultwhisky.co.uk
fi

# Check MongoDB connection
if ! mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "MongoDB health check failed"
    sudo systemctl restart mongod
fi

# Check Nginx status
if ! systemctl is-active --quiet nginx; then
    echo "Nginx is not running"
    sudo systemctl restart nginx
fi
```

#### Setup Cron Jobs for Monitoring
```bash
# Edit crontab
crontab -e

# Add health checks
*/5 * * * * /home/viticult/scripts/health-check.sh
0 */6 * * * /home/viticult/scripts/log-monitor.sh
```

## Security Configuration

### 1. Firewall Setup

#### Configure UFW (Ubuntu Firewall)
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny direct access to backend port
sudo ufw deny 5001/tcp

# Deny direct access to MongoDB
sudo ufw deny 27017/tcp

# Check status
sudo ufw status
```

### 2. Fail2Ban Configuration

#### Install and Configure Fail2Ban
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Create custom configuration
sudo nano /etc/fail2ban/jail.local
```

**Fail2Ban Configuration:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
```

### 3. System Hardening

#### Disable Root SSH
```bash
sudo nano /etc/ssh/sshd_config

# Set these values
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no

# Restart SSH
sudo systemctl restart sshd
```

#### Install Security Updates
```bash
# Enable automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

## Backup Strategy

### 1. Database Backup

#### Create Backup Script
```bash
nano /home/viticult/scripts/backup-database.sh
```

**Database Backup Script:**
```bash
#!/bin/bash

BACKUP_DIR="/home/viticult/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="viticultwhisky_backup_$DATE.gz"

# Create MongoDB backup
mongodump --uri="mongodb://viticultuser:secure-app-password@localhost:27017/viticultwhisky" --gzip --archive="$BACKUP_DIR/$BACKUP_FILE"

# Remove backups older than 30 days
find $BACKUP_DIR -name "viticultwhisky_backup_*.gz" -type f -mtime +30 -delete

echo "Database backup completed: $BACKUP_FILE"
```

#### Schedule Database Backups
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /home/viticult/scripts/backup-database.sh
```

### 2. Application Backup

#### Create Application Backup Script
```bash
nano /home/viticult/scripts/backup-application.sh
```

**Application Backup Script:**
```bash
#!/bin/bash

BACKUP_DIR="/home/viticult/backups"
APP_DIR="/home/viticult/apps/viticultwhisky"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="app_backup_$DATE.tar.gz"

# Create application backup (excluding node_modules and build files)
tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
    --exclude="node_modules" \
    --exclude="build" \
    --exclude="*.log" \
    --exclude=".git" \
    -C /home/viticult/apps viticultwhisky

# Remove old backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -type f -mtime +7 -delete

echo "Application backup completed: $BACKUP_FILE"
```

## Deployment Verification

### 1. Functional Testing

#### Backend API Testing
```bash
# Test health endpoint
curl -f https://viticultwhisky.co.uk/api/health

# Test contact form (with test data)
curl -X POST https://viticultwhisky.co.uk/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+44 20 7946 0958",
    "message": "Test message",
    "preferredContactMethod": "email"
  }'
```

#### Frontend Testing
```bash
# Test main website
curl -f https://viticultwhisky.co.uk/

# Test admin login page
curl -f https://viticultwhisky.co.uk/admin/login

# Test contact page
curl -f https://viticultwhisky.co.uk/contact
```

### 2. Performance Testing

#### Load Testing with Apache Bench
```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Test homepage performance
ab -n 100 -c 10 https://viticultwhisky.co.uk/

# Test API performance
ab -n 50 -c 5 -H "Content-Type: application/json" https://viticultwhisky.co.uk/api/health
```

### 3. Security Testing

#### SSL Configuration Test
```bash
# Test SSL configuration
curl -I https://viticultwhisky.co.uk/

# Check SSL certificate
openssl s_client -connect viticultwhisky.co.uk:443 -servername viticultwhisky.co.uk
```

## Maintenance Procedures

### 1. Regular Updates

#### System Updates
```bash
# Monthly system updates
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

#### Application Updates
```bash
# Update Node.js dependencies
cd /home/viticult/apps/viticultwhisky/backend
npm update

cd /home/viticult/apps/viticultwhisky/frontend
npm update
npm run build

# Restart application
pm2 restart viticultwhisky-backend
```

### 2. Performance Monitoring

#### System Resource Monitoring
```bash
# Check system resources
htop
df -h
free -m

# Check application performance
pm2 monit
```

#### Database Monitoring
```bash
# MongoDB statistics
mongosh --eval "db.serverStatus()"
mongosh --eval "db.stats()"
```

## Troubleshooting

### 1. Common Issues

#### Application Not Starting
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs viticultwhisky-backend

# Check system logs
sudo journalctl -u viticultwhisky -f
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongosh "mongodb://viticultuser:secure-app-password@localhost:27017/viticultwhisky"

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### 2. Recovery Procedures

#### Database Recovery
```bash
# Restore from backup
mongorestore --uri="mongodb://viticultuser:secure-app-password@localhost:27017/viticultwhisky" --gzip --archive="/home/viticult/backups/viticultwhisky_backup_YYYYMMDD_HHMMSS.gz"
```

#### Application Recovery
```bash
# Restore application from backup
cd /home/viticult/apps
tar -xzf /home/viticult/backups/app_backup_YYYYMMDD_HHMMSS.tar.gz

# Reinstall dependencies
cd viticultwhisky/backend && npm install
cd ../frontend && npm install && npm run build

# Restart services
pm2 restart viticultwhisky-backend
```

## Scaling Considerations

### 1. Horizontal Scaling

#### Load Balancer Configuration
```nginx
# Multiple backend servers
upstream viticultwhisky_backend {
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
    server 127.0.0.1:5003;
    keepalive 32;
}
```

#### Database Clustering
```bash
# MongoDB replica set configuration
# (Requires multiple servers)
```

### 2. Vertical Scaling

#### Resource Optimization
```bash
# Increase PM2 instances based on CPU cores
pm2 scale viticultwhisky-backend +2

# Optimize MongoDB
# Add more RAM for caching
# Use SSD storage for better I/O
```

---

*Deployment Guide Version: 1.0.0*
*Last Updated: January 2025*
*For deployment support, contact: devops@viticultwhisky.co.uk*