# VPS Deployment Guide for Whisky Investment Website

## Recommended Stack: MERN

Your project uses:
- MongoDB (Database)
- Express.js (Backend Framework)
- React (Frontend)
- Node.js (Runtime)

## VPS Requirements

### Minimum Specifications:
- 2 GB RAM
- 2 CPU cores
- 40 GB SSD storage
- Ubuntu 22.04 LTS

### Recommended Specifications:
- 4 GB RAM
- 2-4 CPU cores
- 80 GB SSD storage
- Ubuntu 22.04 LTS

## Deployment Options

### Option 1: Direct Deployment (Recommended)

**Pros:**
- Maximum control
- Best performance
- Lower cost
- Industry standard

**Stack Components:**
```
- OS: Ubuntu 22.04 LTS
- Web Server: Nginx (reverse proxy)
- Process Manager: PM2
- Database: MongoDB
- SSL: Let's Encrypt (Certbot)
- Node.js: v18 or v20 LTS
```

### Option 2: Docker Deployment with CapRover

**Pros:**
- Easy deployment
- Built-in SSL
- Web UI for management
- One-click apps

**Installation:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install CapRover
npm install -g caprover
caprover serversetup
```

### Option 3: Traditional Control Panel

**CyberPanel** (if you need a GUI):
- Free and open source
- OpenLiteSpeed (fast)
- Built-in Node.js support
- Email server included

## Step-by-Step Deployment (Direct Method)

### 1. Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl git build-essential nginx
```

### 2. Install Node.js
```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install MongoDB
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Install PM2
```bash
sudo npm install -g pm2
```

### 5. Setup Your Application
```bash
# Clone your repository
cd /var/www
sudo git clone [your-repo-url] whisky

# Setup backend
cd /var/www/whisky/backend
npm install
cp .env.example .env  # Configure your environment variables

# Setup frontend
cd /var/www/whisky/frontend
npm install
npm run build
```

### 6. Configure PM2
Create `/var/www/whisky/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'whisky-backend',
      script: './backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

### 7. Configure Nginx
Create `/etc/nginx/sites-available/whisky`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/whisky/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8. Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/whisky /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 10. Start Your Application
```bash
cd /var/www/whisky
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Environment Variables

Create `.env` file in backend:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whisky
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Security Checklist

- [ ] Configure firewall (ufw)
- [ ] Setup fail2ban
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Keep system updated
- [ ] Configure MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Set secure headers with Helmet.js

## Monitoring

1. **PM2 Monitoring:**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **System Monitoring:**
   - Install htop: `sudo apt install htop`
   - Install netdata for web-based monitoring

3. **Application Monitoring:**
   - Consider using PM2 Plus (paid)
   - Or setup Grafana + Prometheus

## Backup Strategy

1. **Database Backup:**
   ```bash
   # Create backup script
   mongodump --out /backup/mongodb/$(date +%Y%m%d)
   ```

2. **Application Backup:**
   - Use Git for code
   - Backup uploaded files separately
   - Backup environment variables

## Scaling Considerations

1. **Vertical Scaling:** Upgrade VPS resources
2. **Horizontal Scaling:** 
   - Use load balancer
   - Multiple app servers
   - MongoDB replica set
3. **CDN:** Use Cloudflare for static assets

## Cost Optimization

1. **VPS Providers (Recommended):**
   - DigitalOcean: $6-12/month
   - Linode: $5-10/month
   - Vultr: $6-12/month
   - Hetzner: €4-8/month (best value)

2. **Free Tier Options:**
   - Oracle Cloud: Always Free tier
   - Google Cloud: 90-day trial
   - AWS: 12-month free tier

## Summary

For your Whisky project, I recommend:
1. **Stack:** MERN (which you already have)
2. **Deployment:** Direct deployment with Nginx + PM2
3. **Control Panel:** None needed (use SSH + PM2 web UI)
4. **VPS:** Start with 2GB RAM, scale as needed
5. **Provider:** Hetzner or DigitalOcean

This setup provides the best balance of performance, cost, and maintainability for a production MERN application.