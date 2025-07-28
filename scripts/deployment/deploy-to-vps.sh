#!/bin/bash

# VPS Deployment Script for Whisky Investment Platform
# This script prepares and deploys the application to VPS

echo "🚀 Starting VPS Deployment Process..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Building Frontend for Production${NC}"
cd frontend

# Create production .env if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "REACT_APP_API_URL=https://viticultwhisky.co.uk/api" > .env.production
fi

# Build frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"

cd ..

echo -e "${YELLOW}Step 2: Preparing Backend${NC}"
cd backend

# Check if production .env exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Warning: .env.production not found!${NC}"
    echo "Please create backend/.env.production with production values"
    exit 1
fi

cd ..

echo -e "${YELLOW}Step 3: Creating Deployment Package${NC}"
# Create deployment directory
rm -rf deployment-package
mkdir -p deployment-package

# Copy necessary files
cp -r backend deployment-package/
cp -r frontend/build deployment-package/frontend-build
cp SECURITY.md deployment-package/

# Clean up development files
cd deployment-package/backend
rm -rf node_modules
rm -f .env .env.development .env.backup
rm -rf logs/*
cd ../..

echo -e "${GREEN}✅ Deployment package created${NC}"

echo -e "${YELLOW}Step 4: Deployment Instructions${NC}"
echo "
📋 MANUAL STEPS REQUIRED ON VPS:

1. Upload deployment package to VPS:
   ${YELLOW}scp -r deployment-package/* root@viticultwhisky.co.uk:/var/www/viticultwhisky/${NC}

2. SSH into VPS:
   ${YELLOW}ssh root@viticultwhisky.co.uk${NC}

3. Navigate to project:
   ${YELLOW}cd /var/www/viticultwhisky${NC}

4. Copy production environment:
   ${YELLOW}cp backend/.env.production backend/.env${NC}

5. Update .env with production values:
   - Generate JWT_SECRET: ${YELLOW}openssl rand -hex 32${NC}
   - Generate other secrets: ${YELLOW}openssl rand -hex 16${NC}
   - Update MongoDB URI with authentication
   - Remove test email credentials

6. Install backend dependencies:
   ${YELLOW}cd backend && npm install --production${NC}

7. Copy frontend build:
   ${YELLOW}rm -rf /var/www/viticultwhisky/frontend/build${NC}
   ${YELLOW}cp -r frontend-build/* /var/www/viticultwhisky/frontend/build/${NC}

8. Set permissions:
   ${YELLOW}chown -R www-data:www-data /var/www/viticultwhisky${NC}
   ${YELLOW}chmod -R 755 /var/www/viticultwhisky${NC}

9. Start backend with PM2:
   ${YELLOW}cd backend${NC}
   ${YELLOW}pm2 delete whisky-backend 2>/dev/null${NC}
   ${YELLOW}pm2 start ecosystem.config.js${NC}
   ${YELLOW}pm2 save${NC}

10. Test the deployment:
    ${YELLOW}curl https://viticultwhisky.co.uk/api/admin/csrf-token${NC}

11. Verify admin login works:
    - Admin credentials must be set via environment variables
    - Do NOT use default passwords in production

🔐 SECURITY CHECKLIST:
□ SSL certificate is active
□ All environment secrets are updated
□ MongoDB has authentication enabled
□ Firewall rules are configured
□ Backup strategy is in place
"

echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${YELLOW}Follow the manual steps above to complete deployment.${NC}"