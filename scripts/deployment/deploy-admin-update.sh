#!/bin/bash

# Admin Credentials Deployment Script for ViticultWhisky
# This script safely updates admin credentials on production server

set -e  # Exit on error

echo "🚀 ViticultWhisky Admin Deployment"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as appropriate user
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Don't run this script as root${NC}"
   exit 1
fi

# Function to backup current config
backup_config() {
    local backup_dir="backups/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"
    
    if [ -f ".env" ]; then
        cp .env "$backup_dir/.env.backup"
        echo -e "${GREEN}✅ Current config backed up to $backup_dir${NC}"
    fi
}

# Function to test configuration
test_config() {
    echo "🧪 Testing configuration..."
    
    # Check if all required vars are set
    local required_vars=("NODE_ENV" "ADMIN_EMAIL" "ADMIN_PASSWORD_HASH" "JWT_SECRET" "MONGODB_URI")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env 2>/dev/null; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo -e "${RED}❌ Missing required variables: ${missing_vars[*]}${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Configuration test passed${NC}"
    return 0
}

# Function to restart services
restart_services() {
    echo "🔄 Restarting services..."
    
    # Check service manager
    if command -v systemctl &> /dev/null; then
        # SystemD
        sudo systemctl restart viticultwhisky || echo -e "${YELLOW}⚠️  Failed to restart via systemctl${NC}"
    elif command -v pm2 &> /dev/null; then
        # PM2
        pm2 restart all || echo -e "${YELLOW}⚠️  Failed to restart via pm2${NC}"
    else
        # Manual restart
        echo -e "${YELLOW}⚠️  Please restart your application manually${NC}"
    fi
}

# Main deployment process
echo "📋 Pre-deployment checklist:"
echo "□ Backup current configuration"
echo "□ Update environment variables"
echo "□ Test new configuration"
echo "□ Restart application"
echo "□ Verify admin access"
echo ""

read -p "Continue with deployment? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Step 1: Backup
echo ""
echo "📦 Step 1: Backing up current configuration..."
backup_config

# Step 2: Check for deployment file
echo ""
echo "📄 Step 2: Looking for deployment file..."

DEPLOY_FILE=$(ls deploy-env-*.sh 2>/dev/null | head -n 1)
if [ -z "$DEPLOY_FILE" ]; then
    echo -e "${RED}❌ No deployment file found${NC}"
    echo "Run ./setup-admin-production.sh first to generate deployment file"
    exit 1
fi

echo "Found: $DEPLOY_FILE"

# Step 3: Apply configuration
echo ""
echo "⚙️  Step 3: Applying new configuration..."

# Create temporary env file
cp .env .env.tmp 2>/dev/null || touch .env.tmp

# Source and apply deployment file
source "$DEPLOY_FILE"

# Test configuration
if ! test_config; then
    echo -e "${RED}❌ Configuration test failed${NC}"
    echo "Rolling back..."
    mv .env.tmp .env
    exit 1
fi

# Remove temporary file
rm -f .env.tmp

echo -e "${GREEN}✅ Configuration applied successfully${NC}"

# Step 4: Restart services
echo ""
echo "🔄 Step 4: Restarting application..."
restart_services

# Step 5: Verify
echo ""
echo "✅ Step 5: Verification"
echo ""

# Wait for service to start
echo "Waiting for service to start..."
sleep 5

# Check if service is running
if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/health || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Backend service is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend returned status: $HTTP_STATUS${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Install curl to verify service status${NC}"
fi

# Step 6: Clean up
echo ""
echo "🧹 Step 6: Cleaning up..."

# Archive deployment file
mkdir -p deployed
mv "$DEPLOY_FILE" "deployed/$(basename $DEPLOY_FILE).deployed"
echo "Deployment file archived"

# Final summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE${NC}"
echo "=========================================="
echo ""
echo "📋 Post-deployment checklist:"
echo "□ Test admin login at https://yourdomain.com/admin/login"
echo "□ Check application logs for errors"
echo "□ Monitor server resources"
echo "□ Update documentation"
echo ""
echo "🔐 Security reminders:"
echo "- Delete any plain text passwords"
echo "- Check file permissions (should be 600 for .env)"
echo "- Enable monitoring/alerts"
echo "- Schedule next password rotation"
echo ""

# Set correct permissions
chmod 600 .env
echo -e "${GREEN}✅ File permissions updated${NC}"

# Create verification script
cat > verify-admin-access.sh <<'EOF'
#!/bin/bash
# Quick admin access verification

echo "🔍 Verifying admin access..."

# Get domain from .env
DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
ADMIN_EMAIL=$(grep "^ADMIN_EMAIL=" .env | cut -d'=' -f2)

if [ -z "$DOMAIN" ]; then
    echo "Enter your domain:"
    read DOMAIN
fi

echo ""
echo "Testing admin login endpoint..."
echo "URL: https://$DOMAIN/api/admin/login"
echo "Email: $ADMIN_EMAIL"
echo ""

# Test the endpoint
curl -X POST "https://$DOMAIN/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$ADMIN_EMAIL'","password":"test"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "If you see 401, the endpoint is working (wrong password is expected)"
echo "If you see 200, login succeeded"
echo "Any other response indicates an issue"
EOF

chmod +x verify-admin-access.sh

echo ""
echo "🎯 Quick verification script created: ./verify-admin-access.sh"
echo ""
echo "Deployment completed at $(date)"