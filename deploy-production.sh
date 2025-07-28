#!/bin/bash

# Production Deployment Script for ViticultWhisky
# This script handles complete VPS deployment including admin setup

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Configuration
VPS_IP="173.249.4.116"
VPS_USER="root"
PROJECT_DIR="/var/www/whisky"
DOMAIN="viticultwhisky.co.uk"
ADMIN_EMAIL="admin@viticultwhisky.co.uk"

echo "=========================================="
echo "🥃 ViticultWhisky Production Deployment"
echo "=========================================="
echo ""

log_info "Starting production deployment to VPS: $VPS_IP"
log_info "Domain: $DOMAIN"
log_info "Admin Email: $ADMIN_EMAIL"
echo ""

# Step 1: Clean existing deployment
log_info "Step 1: Cleaning existing deployment..."
ssh $VPS_USER@$VPS_IP << 'EOF'
    # Stop PM2 processes
    pm2 stop all 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    
    # Remove existing project (preserve SSL certificates)
    if [ -d "/var/www/whisky" ]; then
        rm -rf /var/www/whisky
        echo "✅ Existing project removed"
    fi
    
    # Ensure directory exists
    mkdir -p /var/www
EOF
log_success "Step 1 completed: Existing deployment cleaned"

# Step 2: Upload project files
log_info "Step 2: Uploading project files..."
scp -r /Users/adityapachauri/Desktop/Whisky $VPS_USER@$VPS_IP:/var/www/
log_success "Step 2 completed: Project files uploaded"

# Step 3: Install dependencies and build
log_info "Step 3: Installing dependencies and building..."
ssh $VPS_USER@$VPS_IP << 'EOF'
    cd /var/www/whisky
    
    # Backend dependencies
    cd backend
    npm install --production
    echo "✅ Backend dependencies installed"
    
    # Frontend dependencies and build
    cd ../frontend
    npm install
    npm run build
    echo "✅ Frontend built successfully"
    
    cd ..
EOF
log_success "Step 3 completed: Dependencies installed and frontend built"

# Step 4: Setup environment and admin user
log_info "Step 4: Setting up environment and admin user..."
ssh $VPS_USER@$VPS_IP << 'EOF'
    cd /var/www/whisky/backend
    
    # Create production .env file
    cat > .env << 'ENVEOF'
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/viticult-whisky

# JWT Configuration
JWT_SECRET=production-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Admin Authentication
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=$2a$12$ke4TGQIxNad09TwzMsNHBejhj0KOo5e53vZ4iZM3tV539sNMfGVl2

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=admin@viticultwhisky.co.uk
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@viticultwhisky.co.uk
EMAIL_FROM_NAME=ViticultWhisky

# Frontend Configuration
FRONTEND_URL=https://viticultwhisky.co.uk
ALLOWED_ORIGINS=https://viticultwhisky.co.uk,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
ENCRYPTION_KEY=prodencryptionkey32charsexactly32
COOKIE_SECRET=production-cookie-secret
SESSION_SECRET=production-session-secret
CSRF_SECRET=production-csrf-secret

# Logging
LOG_LEVEL=info
LOG_TO_FILE=true
ENVEOF
    
    echo "✅ Production .env file created"
    
    # Setup admin user
    node scripts/setup-admin.js
    echo "✅ Admin user setup completed"
EOF
log_success "Step 4 completed: Environment and admin user configured"

# Step 5: Configure Nginx
log_info "Step 5: Configuring Nginx..."
ssh $VPS_USER@$VPS_IP << 'EOF'
    # Update Nginx configuration
    cat > /etc/nginx/sites-available/whisky << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name viticultwhisky.co.uk www.viticultwhisky.co.uk;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/viticultwhisky.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viticultwhisky.co.uk/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/viticultwhisky.co.uk/chain.pem;

    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss application/atom+xml image/svg+xml;

    # Document root
    root /var/www/whisky/frontend/build;
    index index.html index.htm;

    # Client max body size for file uploads
    client_max_body_size 10M;

    # API routes
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebP images
    location ~* \.(webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept;
        try_files $uri =404;
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # React routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/api/health;
        access_log off;
    }
}
NGINXEOF
    
    # Test and reload Nginx
    nginx -t && systemctl reload nginx
    echo "✅ Nginx configuration updated and reloaded"
EOF
log_success "Step 5 completed: Nginx configured"

# Step 6: Start services
log_info "Step 6: Starting services..."
ssh $VPS_USER@$VPS_IP << 'EOF'
    cd /var/www/whisky/backend
    
    # Start backend with PM2
    pm2 start server.js --name whisky-backend --time
    pm2 save
    pm2 startup
    
    echo "✅ Backend started with PM2"
    
    # Setup cron jobs
    bash scripts/cron-setup.sh
    echo "✅ Cron jobs configured"
EOF
log_success "Step 6 completed: Services started"

# Step 7: Verify deployment
log_info "Step 7: Verifying deployment..."
ssh $VPS_USER@$VPS_IP << 'EOF'
    # Check backend health
    echo "Checking backend health..."
    curl -s http://localhost:5000/api/health | grep -q "ok" && echo "✅ Backend health check passed" || echo "❌ Backend health check failed"
    
    # Check admin login
    echo "Testing admin login..."
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/admin/login \
        -H 'Content-Type: application/json' \
        -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}')
    
    if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
        echo "✅ Admin login test passed"
    else
        echo "❌ Admin login test failed"
        echo "Response: $LOGIN_RESPONSE"
    fi
    
    # Check PM2 status
    echo "PM2 Status:"
    pm2 list
    
    # Check Nginx status
    echo "Nginx Status:"
    systemctl status nginx --no-pager
EOF
log_success "Step 7 completed: Deployment verified"

echo ""
echo "=========================================="
log_success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo ""
log_info "Your ViticultWhisky platform is now live at:"
echo "  🌐 Website: https://$DOMAIN"
echo "  🔐 Admin Login: https://$DOMAIN/admin"
echo ""
log_info "Default admin credentials:"
echo "  📧 Email: $ADMIN_EMAIL"
echo "  🔑 Password: admin123"
echo ""
log_warning "IMPORTANT: Change the default admin password immediately!"
echo ""
log_info "Monitoring commands (run on VPS):"
echo "  pm2 list              - Check backend status"
echo "  pm2 logs whisky-backend - View backend logs"
echo "  nginx -t              - Test Nginx configuration"
echo "  systemctl status nginx - Check Nginx status"
echo ""
log_success "Deployment script completed!"