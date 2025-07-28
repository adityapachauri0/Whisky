#!/bin/bash

# 🛡️ Safe Deployment Script
# This script implements the full prevention checklist to avoid recurring issues

set -e  # Exit on any error

echo "🛡️ SAFE DEPLOYMENT SCRIPT"
echo "========================="
echo "This script will deploy your changes safely with full validation"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if deployment file provided
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Usage: $0 <deployment-file.tar.gz>${NC}"
    echo "Example: $0 /tmp/COMPLETE-ALL-CHANGES.tar.gz"
    exit 1
fi

DEPLOYMENT_FILE="$1"
if [ ! -f "$DEPLOYMENT_FILE" ]; then
    echo -e "${RED}❌ Deployment file not found: $DEPLOYMENT_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Deployment file: $DEPLOYMENT_FILE${NC}"
echo ""

# Step 1: Pre-deployment validation
echo "🔍 Step 1: Pre-deployment validation"
echo "===================================="

cd /var/www/viticultwhisky/backend

if [ -f "./scripts/deployment/validate-env-production.sh" ]; then
    echo "Running environment validation..."
    ./scripts/deployment/validate-env-production.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Environment validation failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️ Validation script not found, skipping...${NC}"
fi

# Step 2: Create backup
echo ""
echo "💾 Step 2: Creating backup"
echo "=========================="

BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
BACKUP_PATH="/tmp/$BACKUP_NAME.tar.gz"

echo "Creating backup: $BACKUP_NAME"
cd /
tar -czf "$BACKUP_PATH" var/www/viticultwhisky/ 2>/dev/null
echo -e "${GREEN}✅ Backup created: $BACKUP_PATH${NC}"

# Step 3: Test current admin login
echo ""
echo "🔐 Step 3: Testing current admin login"
echo "======================================"

ADMIN_TEST=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}')

if echo "$ADMIN_TEST" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Admin login working before deployment${NC}"
else
    echo -e "${RED}❌ CRITICAL: Admin login broken BEFORE deployment${NC}"
    echo "Response: $ADMIN_TEST"
    echo "Cannot proceed with deployment while admin is broken"
    exit 1
fi

# Step 4: Stage deployment
echo ""
echo "📂 Step 4: Staging deployment"
echo "============================="

STAGING_DIR="/tmp/deployment-staging-$(date +%s)"
mkdir -p "$STAGING_DIR"
cd "$STAGING_DIR"

echo "Extracting to staging: $STAGING_DIR"
tar -xzf "$DEPLOYMENT_FILE"

# Validate extracted files
if [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Invalid deployment package - no frontend or backend found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment files extracted and validated${NC}"

# Step 5: Preserve critical files
echo ""
echo "🔒 Step 5: Preserving critical files"
echo "===================================="

mkdir -p /tmp/critical-backup

# Preserve environment file
if [ -f "/var/www/viticultwhisky/backend/.env.production" ]; then
    cp /var/www/viticultwhisky/backend/.env.production /tmp/critical-backup/
    echo "✅ Preserved .env.production"
fi

# Preserve image directories
if [ -d "/var/www/viticultwhisky/frontend/public/whisky" ]; then
    cp -r /var/www/viticultwhisky/frontend/public/whisky /tmp/critical-backup/
    echo "✅ Preserved whisky images"
fi

if [ -d "/var/www/viticultwhisky/frontend/public/videos" ]; then
    cp -r /var/www/viticultwhisky/frontend/public/videos /tmp/critical-backup/
    echo "✅ Preserved videos"
fi

# Step 6: Deploy files
echo ""
echo "🚀 Step 6: Deploying files"
echo "=========================="

cd /var/www/viticultwhisky

# Stop backend
echo "Stopping backend..."
pm2 stop viticult-backend || true

# Copy new files
if [ -d "$STAGING_DIR/frontend" ]; then
    echo "Copying frontend files..."
    cp -r "$STAGING_DIR/frontend"/* ./frontend/
fi

if [ -d "$STAGING_DIR/backend" ]; then
    echo "Copying backend files..."
    cp -r "$STAGING_DIR/backend"/* ./backend/
fi

# Restore critical files
echo "Restoring critical files..."
if [ -f "/tmp/critical-backup/.env.production" ]; then
    cp /tmp/critical-backup/.env.production ./backend/
    echo "✅ Restored .env.production"
fi

if [ -d "/tmp/critical-backup/whisky" ]; then
    cp -r /tmp/critical-backup/whisky ./frontend/public/
    echo "✅ Restored whisky images"
fi

if [ -d "/tmp/critical-backup/videos" ]; then
    cp -r /tmp/critical-backup/videos ./frontend/public/
    echo "✅ Restored videos"
fi

echo -e "${GREEN}✅ Files deployed successfully${NC}"

# Step 7: Run auto-fix
echo ""
echo "🔧 Step 7: Running auto-fix script"
echo "=================================="

cd /var/www/viticultwhisky/backend

if [ -f "./scripts/deployment/auto-fix-deployment.sh" ]; then
    ./scripts/deployment/auto-fix-deployment.sh
else
    echo -e "${YELLOW}⚠️ Auto-fix script not found, manual fixes may be needed${NC}"
    
    # Basic manual fixes
    export NODE_ENV=production
    pm2 restart viticult-backend --update-env
    sleep 3
fi

# Step 8: Test admin login after deployment
echo ""
echo "🔐 Step 8: Testing admin login after deployment"
echo "=============================================="

sleep 5  # Give backend time to start

ADMIN_TEST_AFTER=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}')

if echo "$ADMIN_TEST_AFTER" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Admin login working after deployment${NC}"
else
    echo -e "${RED}❌ CRITICAL: Admin login broken AFTER deployment${NC}"
    echo "Response: $ADMIN_TEST_AFTER"
    
    # Offer rollback
    echo ""
    echo -e "${YELLOW}🔄 ROLLBACK RECOMMENDED${NC}"
    echo "Would you like to rollback to the backup? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Rolling back..."
        pm2 stop viticult-backend || true
        cd /
        tar -xzf "$BACKUP_PATH"
        pm2 start viticult-backend
        echo -e "${GREEN}✅ Rollback completed${NC}"
        exit 1
    fi
fi

# Step 9: Final validation
echo ""
echo "✅ Step 9: Final validation"
echo "=========================="

# Test website is accessible
WEBSITE_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://viticultwhisky.co.uk)
if [ "$WEBSITE_TEST" = "200" ]; then
    echo "✅ Website accessible (HTTP $WEBSITE_TEST)"
else
    echo -e "${YELLOW}⚠️ Website returned HTTP $WEBSITE_TEST${NC}"
fi

# Cleanup staging
rm -rf "$STAGING_DIR"
rm -rf /tmp/critical-backup

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY${NC}"
echo "===================================="
echo "Backup available at: $BACKUP_PATH"
echo "Website: https://viticultwhisky.co.uk"
echo "Admin: https://viticultwhisky.co.uk/admin/login"
echo ""
echo "✅ Remember to run a full test with Playwright to verify everything works"
echo ""