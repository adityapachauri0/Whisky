#!/bin/bash

# Production Deployment Script for Whisky Investment Platform
# This script ensures secure deployment with all production settings

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Production Deployment Script${NC}"
echo "=================================="

# Configuration
DOMAIN="viticultwhisky.co.uk"
VPS_USER="your-vps-user"
VPS_IP="your-vps-ip"
DEPLOY_PATH="/var/www/whisky"

# Pre-deployment checks
echo -e "\n${YELLOW}Running pre-deployment checks...${NC}"

# Check if .env.production exists
if [ ! -f "backend/.env.production" ]; then
    echo -e "${RED}❌ ERROR: backend/.env.production not found!${NC}"
    echo "Please create it from .env.production.secure template"
    exit 1
fi

# Check if .env files are in .gitignore
if ! grep -q "^\.env$" backend/.gitignore 2>/dev/null; then
    echo -e "${RED}❌ ERROR: .env files not in .gitignore!${NC}"
    echo "This is a security risk!"
    exit 1
fi

# Verify no sensitive data in tracked files
echo "Checking for exposed secrets..."
if grep -r "JWT_SECRET\|COOKIE_SECRET\|SESSION_SECRET" --include="*.js" --include="*.ts" --exclude-dir=node_modules . | grep -v "process.env"; then
    echo -e "${RED}❌ ERROR: Hardcoded secrets found in code!${NC}"
    exit 1
fi

# Build frontend for production
echo -e "\n${YELLOW}Building frontend for production...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
cd ..

# Create deployment archive
echo -e "\n${YELLOW}Creating deployment archive...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="whisky-deploy-${TIMESTAMP}.tar.gz"

# Create temporary deployment directory
mkdir -p deploy_temp
cp -r backend deploy_temp/
cp -r frontend/build deploy_temp/frontend-build
cp deploy-on-vps.sh deploy_temp/
cp nginx.conf deploy_temp/
cp systemd.service deploy_temp/

# Remove development files
rm -rf deploy_temp/backend/node_modules
rm -f deploy_temp/backend/.env
rm -f deploy_temp/backend/.env.development
rm -rf deploy_temp/backend/logs/*
rm -rf deploy_temp/backend/coverage
rm -rf deploy_temp/backend/.nyc_output

# Create archive
tar -czf $ARCHIVE_NAME deploy_temp/
rm -rf deploy_temp

echo -e "${GREEN}✓ Archive created: $ARCHIVE_NAME${NC}"

# Deploy to VPS
echo -e "\n${YELLOW}Deploying to VPS...${NC}"
echo "Uploading files to $VPS_USER@$VPS_IP..."

# Upload archive
scp $ARCHIVE_NAME $VPS_USER@$VPS_IP:/tmp/

# Execute deployment on VPS
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

# Extract archive
cd /tmp
tar -xzf whisky-deploy-*.tar.gz

# Backup current deployment
if [ -d "/var/www/whisky" ]; then
    sudo cp -r /var/www/whisky /var/www/whisky.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create deployment directory
sudo mkdir -p /var/www/whisky
sudo chown $USER:$USER /var/www/whisky

# Deploy backend
cp -r deploy_temp/backend /var/www/whisky/
cd /var/www/whisky/backend

# Install production dependencies only
npm ci --production

# Set proper permissions
sudo chown -R www-data:www-data /var/www/whisky/backend
sudo chmod 750 /var/www/whisky/backend
sudo chmod 640 /var/www/whisky/backend/.env.production

# Deploy frontend
sudo rm -rf /var/www/whisky/frontend
sudo cp -r /tmp/deploy_temp/frontend-build /var/www/whisky/frontend
sudo chown -R www-data:www-data /var/www/whisky/frontend

# Update Nginx configuration
sudo cp /tmp/deploy_temp/nginx.conf /etc/nginx/sites-available/whisky
sudo nginx -t
sudo systemctl reload nginx

# Update systemd service
sudo cp /tmp/deploy_temp/systemd.service /etc/systemd/system/whisky-backend.service
sudo systemctl daemon-reload
sudo systemctl restart whisky-backend

# Clean up
rm -rf /tmp/deploy_temp
rm -f /tmp/whisky-deploy-*.tar.gz

echo "Deployment completed!"
ENDSSH

# Post-deployment checks
echo -e "\n${YELLOW}Running post-deployment checks...${NC}"

# Check if site is accessible
echo "Checking site availability..."
if curl -sf https://$DOMAIN > /dev/null; then
    echo -e "${GREEN}✓ Site is accessible${NC}"
else
    echo -e "${RED}❌ Site is not accessible${NC}"
fi

# Check API health
echo "Checking API health..."
if curl -sf https://$DOMAIN/api/health > /dev/null; then
    echo -e "${GREEN}✓ API is healthy${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
fi

# Security reminders
echo -e "\n${YELLOW}📋 Post-Deployment Security Checklist:${NC}"
echo "□ Change the admin password immediately"
echo "□ Verify SSL certificate is valid"
echo "□ Check that MongoDB has authentication enabled"
echo "□ Monitor application logs for errors"
echo "□ Set up automated backups"
echo "□ Configure monitoring and alerts"
echo "□ Test all critical functionality"
echo "□ Enable firewall rules"
echo "□ Set up log rotation"
echo "□ Configure fail2ban for SSH"

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
echo "Frontend: https://$DOMAIN"
echo "API: https://$DOMAIN/api"
echo "Admin: https://$DOMAIN/admin"

# Clean up local archive
rm -f $ARCHIVE_NAME

echo -e "\n${YELLOW}⚠️  IMPORTANT: Remember to:${NC}"
echo "1. Set environment variables on VPS"
echo "2. Configure MongoDB with authentication"
echo "3. Update email service credentials"
echo "4. Change admin password from default"