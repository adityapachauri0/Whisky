#!/bin/bash

# ViticultWhisky VPS Deployment Script
# Run this script on your VPS after initial setup

set -e  # Exit on error

echo "=== ViticultWhisky VPS Deployment Script ==="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 completed successfully${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Update system
echo "1. Updating system packages..."
apt update && apt upgrade -y
check_status "System update"

# Install required packages
echo "2. Installing required packages..."
apt install -y nginx mongodb-org nodejs npm git ufw fail2ban certbot python3-certbot-nginx
check_status "Package installation"

# Configure firewall
echo "3. Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
check_status "Firewall configuration"

# Configure fail2ban
echo "4. Configuring fail2ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable fail2ban
systemctl start fail2ban
check_status "Fail2ban configuration"

# Create application directory
echo "5. Creating application directory..."
mkdir -p /var/www/viticult-whisky
chown -R $SUDO_USER:$SUDO_USER /var/www/viticult-whisky
check_status "Directory creation"

# Clone repository (replace with your repo URL)
echo "6. Cloning repository..."
cd /var/www/viticult-whisky
sudo -u $SUDO_USER git clone https://github.com/yourusername/viticult-whisky.git .
check_status "Repository clone"

# Install backend dependencies
echo "7. Installing backend dependencies..."
cd /var/www/viticult-whisky/backend
sudo -u $SUDO_USER npm install --production
check_status "Backend dependencies"

# Install frontend dependencies and build
echo "8. Building frontend..."
cd /var/www/viticult-whisky/frontend
sudo -u $SUDO_USER npm install
sudo -u $SUDO_USER npm run build
check_status "Frontend build"

# Install PM2
echo "9. Installing PM2..."
npm install -g pm2
check_status "PM2 installation"

# Configure MongoDB
echo "10. Configuring MongoDB..."
systemctl enable mongod
systemctl start mongod

# Create MongoDB user (you'll need to run mongo commands manually)
echo -e "${YELLOW}MongoDB is running. Please create a database user manually:${NC}"
echo "mongo"
echo "> use admin"
echo "> db.createUser({user: 'viticultAdmin', pwd: 'YOUR_PASSWORD', roles: [{role: 'root', db: 'admin'}]})"
echo "> use viticult-whisky"
echo "> db.createUser({user: 'viticultUser', pwd: 'YOUR_PASSWORD', roles: [{role: 'readWrite', db: 'viticult-whisky'}]})"
echo
read -p "Press enter when MongoDB user is created..."

# Configure Nginx
echo "11. Configuring Nginx..."
cp /var/www/viticult-whisky/nginx/viticult-whisky.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/viticult-whisky.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
check_status "Nginx configuration"

# Setup environment variables
echo "12. Setting up environment variables..."
echo -e "${YELLOW}Please create .env files:${NC}"
echo "Backend: /var/www/viticult-whisky/backend/.env"
echo "Frontend: /var/www/viticult-whisky/frontend/.env"
echo "Use the .env.example files as templates"
read -p "Press enter when .env files are created..."

# Start backend with PM2
echo "13. Starting backend with PM2..."
cd /var/www/viticult-whisky/backend
sudo -u $SUDO_USER pm2 start server.js --name viticult-api
sudo -u $SUDO_USER pm2 save
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
check_status "Backend startup"

# Setup SSL with Let's Encrypt
echo "14. Setting up SSL..."
echo -e "${YELLOW}Enter your domain name (e.g., yourdomain.com):${NC}"
read DOMAIN
certbot --nginx -d $DOMAIN -d www.$DOMAIN
check_status "SSL setup"

# Setup log rotation
echo "15. Setting up log rotation..."
cat > /etc/logrotate.d/viticult-whisky << EOF
/var/www/viticult-whisky/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 $SUDO_USER $SUDO_USER
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
check_status "Log rotation setup"

# Create backup script
echo "16. Creating backup script..."
cat > /usr/local/bin/backup-viticult.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/viticult-whisky"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --out $BACKUP_DIR/mongo_$DATE

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/viticult-whisky/backend/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
EOF
chmod +x /usr/local/bin/backup-viticult.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-viticult.sh") | crontab -
check_status "Backup setup"

# Security headers test
echo "17. Testing security headers..."
curl -I https://$DOMAIN

echo
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo
echo "Next steps:"
echo "1. Update DNS records to point to this server"
echo "2. Test all functionality"
echo "3. Monitor logs: pm2 logs"
echo "4. Check Nginx logs: /var/log/nginx/"
echo "5. Set up monitoring (e.g., Datadog, New Relic)"
echo
echo -e "${YELLOW}Security Reminders:${NC}"
echo "- Change default passwords"
echo "- Enable 2FA for admin accounts"
echo "- Regularly update packages"
echo "- Monitor access logs"
echo "- Set up automated backups"
echo
echo -e "${GREEN}Happy deploying!${NC}"