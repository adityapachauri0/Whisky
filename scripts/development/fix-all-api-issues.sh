#!/bin/bash

# Complete Fix for Admin Login & API Issues
# This script addresses ALL issues from your 15-hour struggle

echo "🔧 Complete Fix for ViticultWhisky Login & API Issues"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Fix Backend Environment
echo -e "${YELLOW}1. Fixing Backend Configuration...${NC}"
cd backend

# Backup current production env
if [ -f ".env.production" ]; then
    cp .env.production .env.production.backup-$(date +%s)
fi

# Create correct .env.production with all fixes
cat > .env.production << 'EOF'
# Environment
NODE_ENV=production

# Server
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/viticultwhisky

# JWT Configuration
JWT_SECRET=your-production-jwt-secret-change-this
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Admin Authentication - CORRECT BCRYPT HASH
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=$2a$12$c4Y/tOvWZnHUy7KSQIYR0OVNnMZs5c2I2M0bSX01Ihkl5uJx9Nyme

# CORS & API Configuration - FIXED
ALLOWED_ORIGINS=https://viticultwhisky.co.uk,https://www.viticultwhisky.co.uk
FRONTEND_URL=https://viticultwhisky.co.uk
COOKIE_DOMAIN=.viticultwhisky.co.uk
SECURE_COOKIES=true
SAME_SITE=lax
TRUST_PROXY=true

# Rate Limiting - Increased for testing
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=10

# Security
ENCRYPTION_KEY=prodencryptionkey32charsexactly32
COOKIE_SECRET=production-cookie-secret-change-this
SESSION_SECRET=production-session-secret-change-this
CSRF_SECRET=production-csrf-secret-change-this

# Logging
LOG_LEVEL=info
LOG_TO_FILE=true
EOF

echo -e "${GREEN}✅ Backend environment fixed${NC}"

# 2. Fix Frontend Environment
echo -e "\n${YELLOW}2. Fixing Frontend Configuration...${NC}"
cd ../frontend

# Create production env
cat > .env.production << 'EOF'
# Production environment
REACT_APP_API_URL=https://viticultwhisky.co.uk/api
REACT_APP_ENVIRONMENT=production
EOF

echo -e "${GREEN}✅ Frontend environment fixed${NC}"

# 3. Fix Nginx Configuration
echo -e "\n${YELLOW}3. Creating Nginx Configuration...${NC}"
cd ..

cat > nginx-vps-config << 'EOF'
# Complete nginx configuration for ViticultWhisky
server {
    listen 80;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;

    # SSL configuration (update paths)
    ssl_certificate /etc/letsencrypt/live/viticultwhisky.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viticultwhisky.co.uk/privkey.pem;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend (React build)
    root /path/to/whisky/frontend/build;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy - CRITICAL CONFIGURATION
    location /api {
        # Remove /api prefix when forwarding
        rewrite ^/api(.*) /api$1 break;
        
        # Proxy to backend
        proxy_pass http://localhost:5001;
        
        # Required proxy headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CRITICAL for cookie-based auth
        proxy_set_header Cookie $http_cookie;
        proxy_pass_header Set-Cookie;
        proxy_cookie_domain localhost viticultwhisky.co.uk;
        proxy_cookie_path / /;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Body size (for file uploads)
        client_max_body_size 10M;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:5001/api/health;
        access_log off;
    }
}
EOF

echo -e "${GREEN}✅ Nginx configuration created${NC}"

# 4. Create deployment script
echo -e "\n${YELLOW}4. Creating Deployment Script...${NC}"

cat > deploy-fix.sh << 'EOF'
#!/bin/bash
# Run this on VPS to apply all fixes

echo "🚀 Applying all fixes on VPS..."

# 1. Stop services
echo "Stopping services..."
pm2 stop all || true
sudo systemctl stop nginx || true

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
cd backend && npm install --production
cd ../frontend && npm install && npm run build

# 4. Apply nginx config
sudo cp nginx-vps-config /etc/nginx/sites-available/viticultwhisky
sudo ln -sf /etc/nginx/sites-available/viticultwhisky /etc/nginx/sites-enabled/
sudo nginx -t

# 5. Start MongoDB if not running
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. Clear PM2 and start fresh
pm2 delete all || true
cd backend
export NODE_ENV=production
pm2 start server.js --name backend --env production

# 7. Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 8. Show status
pm2 list
pm2 logs backend --lines 10

echo "✅ All fixes applied!"
echo ""
echo "Test with:"
echo "  curl https://viticultwhisky.co.uk/api/health"
echo "  curl -X POST https://viticultwhisky.co.uk/api/admin/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"admin@viticultwhisky.co.uk\",\"password\":\"admin123\"}'"
EOF

chmod +x deploy-fix.sh

echo -e "${GREEN}✅ Deployment script created${NC}"

# 5. Create test script
echo -e "\n${YELLOW}5. Creating Test Script...${NC}"

cat > test-api.sh << 'EOF'
#!/bin/bash
# Test API endpoints

echo "🧪 Testing API Endpoints..."
echo "========================"

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo "✅ OK ($response)"
    else
        echo "❌ Failed ($response)"
    fi
}

# Test health
test_endpoint "Health Check" "GET" "https://viticultwhisky.co.uk/api/health"

# Test CORS preflight
echo -n "Testing CORS... "
cors_headers=$(curl -s -I -X OPTIONS https://viticultwhisky.co.uk/api/admin/login \
    -H "Origin: https://viticultwhisky.co.uk" \
    -H "Access-Control-Request-Method: POST" \
    2>/dev/null | grep -i "access-control" | wc -l)
if [ "$cors_headers" -gt 0 ]; then
    echo "✅ OK (Headers present)"
else
    echo "❌ Failed (No CORS headers)"
fi

# Test admin login
test_endpoint "Admin Login" "POST" "https://viticultwhisky.co.uk/api/admin/login" \
    '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'

echo ""
echo "Test complete!"
EOF

chmod +x test-api.sh

echo -e "${GREEN}✅ Test script created${NC}"

# Summary
echo -e "\n${GREEN}======================================${NC}"
echo -e "${GREEN}✅ ALL FIX SCRIPTS CREATED!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "The issues you faced were:"
echo "1. ❌ Wrong password hash format (Base64 instead of bcrypt)"
echo "2. ❌ Missing CORS configuration"
echo "3. ❌ Cookie domain mismatch"
echo "4. ❌ Wrong NODE_ENV setting"
echo "5. ❌ Nginx proxy headers missing"
echo ""
echo "Next steps:"
echo "1. Review the fixes in backend/.env.production"
echo "2. Copy deploy-fix.sh to VPS"
echo "3. Run ./deploy-fix.sh on VPS"
echo "4. Test with ./test-api.sh"
echo ""
echo "This should completely resolve your 15-hour login struggle! 🎉"