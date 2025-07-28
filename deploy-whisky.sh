#!/bin/bash

# ============================================================================
# ViticultWhisky Complete Deployment System
# ============================================================================
# This unified script combines deployment, diagnostics, and fixes
# Modes: deploy, diagnose, fix, update
# ============================================================================

set -e  # Exit on any error

# Configuration
VPS_IP="173.249.4.116"
VPS_USER="root"
PROJECT_DIR="/var/www/whisky"
DOMAIN="viticultwhisky.co.uk"
ADMIN_EMAIL="admin@viticultwhisky.co.uk"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🔧 $1${NC}"; }
log_test() { echo -e "${CYAN}🧪 $1${NC}"; }

# Banner
show_banner() {
    echo "============================================================================"
    echo -e "${PURPLE}🥃 ViticultWhisky Complete Deployment System${NC}"
    echo "============================================================================"
    echo -e "${BLUE}Domain: $DOMAIN${NC}"
    echo -e "${BLUE}VPS: $VPS_IP${NC}"
    echo -e "${BLUE}Admin: $ADMIN_EMAIL${NC}"
    echo "============================================================================"
    echo ""
}

# Help function
show_help() {
    show_banner
    echo "Usage: $0 [MODE] [OPTIONS]"
    echo ""
    echo "MODES:"
    echo "  deploy     Complete fresh deployment"
    echo "  update     Update existing deployment with new code"
    echo "  diagnose   Run comprehensive diagnostics"
    echo "  fix        Fix common admin login issues" 
    echo "  test       Test deployment health"
    echo ""
    echo "OPTIONS:"
    echo "  --skip-build    Skip frontend build (for updates)"
    echo "  --force         Force deployment even if checks fail"
    echo "  --verbose       Show detailed output"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 deploy                    # Fresh deployment"
    echo "  $0 update --skip-build       # Quick code update"
    echo "  $0 diagnose                  # Check system health"
    echo "  $0 fix                       # Fix admin login issues"
    echo ""
}

# Test VPS connectivity
test_connectivity() {
    # Check if running locally on VPS
    if [ "$(hostname)" = "srv897225" ] || [ -d "/var/www/whisky/backend" ]; then
        log_test "Running locally on VPS - skipping connectivity test"
        log_success "Local VPS access confirmed"
        return 0
    fi
    
    log_test "Testing VPS connectivity..."
    if ! ssh -o ConnectTimeout=10 $VPS_USER@$VPS_IP "echo 'Connection successful'" > /dev/null 2>&1; then
        log_error "Cannot connect to VPS at $VPS_IP"
        log_error "Please check:"
        echo "  - VPS is running and accessible"
        echo "  - SSH key authentication is set up"  
        echo "  - Network connectivity"
        exit 1
    fi
    log_success "VPS connectivity confirmed"
}

# Diagnose current deployment
diagnose_deployment() {
    log_step "Running comprehensive deployment diagnostics..."
    
    ssh $VPS_USER@$VPS_IP << 'EOF'
        echo "🔍 ViticultWhisky Deployment Diagnostics"
        echo "========================================"
        echo ""
        
        # Check 1: Directory Structure
        echo "1️⃣ Project Structure:"
        if [ -d "/var/www/whisky" ]; then
            echo "✅ Project directory exists"
            cd /var/www/whisky
            
            if [ -d "backend" ] && [ -d "frontend" ]; then
                echo "✅ Backend and frontend directories found"
            else
                echo "❌ Missing backend or frontend directories"
            fi
            
            if [ -f "backend/.env" ]; then
                echo "✅ Backend .env file exists"
            else
                echo "❌ Backend .env file missing"
            fi
            
        else
            echo "❌ Project directory not found at /var/www/whisky"
        fi
        echo ""
        
        # Check 2: Services Status
        echo "2️⃣ Services Status:"
        
        # PM2 Backend
        if pm2 list | grep -q "whisky-backend.*online"; then
            echo "✅ Backend service running"
        else
            echo "❌ Backend service not running"
            echo "   Current PM2 processes:"
            pm2 list
        fi
        
        # MongoDB
        if systemctl is-active --quiet mongod; then
            echo "✅ MongoDB service running"
        else
            echo "❌ MongoDB service not running"
        fi
        
        # Nginx
        if systemctl is-active --quiet nginx; then
            echo "✅ Nginx service running"
        else
            echo "❌ Nginx service not running"
        fi
        echo ""
        
        # Check 3: Configuration Validation
        echo "3️⃣ Configuration Validation:"
        if [ -f "/var/www/whisky/backend/.env" ]; then
            cd /var/www/whisky/backend
            
            # Check admin credentials
            if grep -q "ADMIN_EMAIL=" .env && grep -q "ADMIN_PASSWORD_HASH=" .env; then
                echo "✅ Admin credentials configured"
                
                # Check hash format
                HASH=$(grep ADMIN_PASSWORD_HASH .env | cut -d= -f2)
                if [[ $HASH == \$2* ]]; then
                    echo "✅ Password hash format correct (bcrypt)"
                else
                    echo "❌ Password hash format incorrect"
                    echo "   Expected: \$2a\$12\$..."
                    echo "   Found: $HASH"
                fi
            else
                echo "❌ Admin credentials not configured"
            fi
            
            # Check MongoDB URI
            if grep -q "MONGODB_URI=" .env; then
                echo "✅ MongoDB URI configured"
            else
                echo "❌ MongoDB URI missing"
            fi
            
        else
            echo "❌ Environment file not found"
        fi
        echo ""
        
        # Check 4: API Tests
        echo "4️⃣ API Health Tests:"
        
        # Backend health
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            echo "✅ Backend API responding on port 5000"
        elif curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
            echo "⚠️  Backend API responding on port 5001 (check nginx config)"
        else
            echo "❌ Backend API not responding"
        fi
        
        # Frontend serving
        if curl -s http://localhost/health > /dev/null 2>&1 || curl -s https://$DOMAIN/health > /dev/null 2>&1; then
            echo "✅ Frontend accessible"
        else
            echo "❌ Frontend not accessible"
        fi
        
        # Admin login test
        echo ""
        echo "5️⃣ Admin Login Test:"
        RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/admin/login \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
            2>/dev/null || echo '{"success":false,"message":"Connection failed"}')
        
        if echo "$RESPONSE" | grep -q '"success":true'; then
            echo "✅ Admin login working perfectly!"
        else
            echo "❌ Admin login failed"
            echo "   Response: $RESPONSE"
        fi
        
        echo ""
        echo "🎯 DIAGNOSIS COMPLETE"
        echo "===================="
        
EOF
}

# Fix common deployment issues
fix_deployment() {
    log_step "Applying comprehensive deployment fixes..."
    
    # Check if running locally on VPS or remotely
    if [ "$(hostname)" = "srv897225" ] || [ -d "/var/www/whisky/backend" ]; then
        # Running locally on VPS
        fix_local_deployment
    else
        # Running remotely, use SSH
        ssh $VPS_USER@$VPS_IP << 'EOF'
            $(declare -f fix_local_deployment)
            fix_local_deployment
EOF
    fi
}

# Local deployment fix function
# Copy images from build to web root (NEW - Hero Image Fix)
copy_images_to_webroot() {
    echo "📸 Copying images from build to web root..."
    
    # Copy all built assets including images
    if [ -d "/var/www/whisky/frontend/build/whisky" ]; then
        cp -r /var/www/whisky/frontend/build/whisky/* /var/www/whisky/whisky/
        chown -R www-data:www-data /var/www/whisky/whisky/
        echo "✅ Images copied to web root"
        
        # Verify hero images specifically
        if [ -f "/var/www/whisky/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp" ]; then
            echo "✅ Hero images verified in web root"
        else
            echo "⚠️ Hero images not found - check image paths"
        fi
    else
        echo "❌ Frontend build directory not found"
    fi
}

# Verify hero images are accessible
verify_hero_images() {
    echo "🔍 Verifying hero images..."
    
    HERO_IMAGES=(
        "resized_winery_Viticult-7513835-1-1280w.webp"
        "viticult_whisky_cask_investment43-1280w.webp"
        "dalmore-21-lifestyle-1280w.webp"
    )
    
    for img in "${HERO_IMAGES[@]}"; do
        if [ -f "/var/www/whisky/whisky/hero/optimized/$img" ]; then
            echo "✅ $img found"
        else
            echo "❌ $img NOT found"
        fi
    done
}

fix_local_deployment() {
        echo "🔧 ViticultWhisky Deployment Fix"
        echo "==============================="
        echo ""
        
        cd /var/www/whisky/backend
        
        # Fix 1: Environment Variables
        echo "1️⃣ Fixing Environment Configuration..."
        
        # Ensure .env file has all required variables
        if [ ! -f ".env" ]; then
            echo "Creating .env file..."
            cat > .env << 'ENVFILE'
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

# Frontend Configuration
FRONTEND_URL=https://viticultwhisky.co.uk
ALLOWED_ORIGINS=https://viticultwhisky.co.uk,http://localhost:5000

# Security
ENCRYPTION_KEY=prodencryptionkey32charsexactly32
COOKIE_SECRET=production-cookie-secret
SESSION_SECRET=production-session-secret

# Logging
LOG_LEVEL=info
LOG_TO_FILE=true
ENVFILE
            echo "✅ Environment file created"
        else
            echo "✅ Environment file exists"
        fi
        
        # Fix 2: Admin User Setup
        echo ""
        echo "2️⃣ Setting up Admin User..."
        if [ -f "scripts/setup-admin.js" ]; then
            node scripts/setup-admin.js
        else
            echo "⚠️  Admin setup script not found, using manual method"
            # Manual admin user creation would go here
        fi
        
        # Fix 3: PM2 Configuration
        echo ""
        echo "3️⃣ Configuring PM2 Service..."
        pm2 stop whisky-backend 2>/dev/null || true
        pm2 delete whisky-backend 2>/dev/null || true
        
        pm2 start server.js --name whisky-backend
        pm2 save
        echo "✅ PM2 service configured"
        
        # Fix 4: Nginx Configuration
        echo ""
        echo "4️⃣ Fixing Nginx Configuration..."
        
        # Update nginx config if needed
        if [ -f "/etc/nginx/sites-available/whisky" ]; then
            # Check if proxy port is correct
            if ! grep -q "proxy_pass http://localhost:5000" /etc/nginx/sites-available/whisky; then
                echo "Updating nginx proxy configuration..."
                sed -i.backup 's/proxy_pass http:\/\/localhost:[0-9]*/proxy_pass http:\/\/localhost:5000/' /etc/nginx/sites-available/whisky
                nginx -t && systemctl reload nginx
                echo "✅ Nginx configuration updated"
            else
                echo "✅ Nginx configuration correct"
            fi
        else
            echo "⚠️  Nginx configuration file not found"
        fi
        
        # Fix 5: Image Deployment (NEW - Hero Image Fix)
        echo ""
        echo "5️⃣ Image Deployment..."
        copy_images_to_webroot
        verify_hero_images
        
        # Fix 6: Final Verification
        echo ""
        echo "6️⃣ Final Verification..."
        sleep 3
        
        RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/admin/login \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
            2>/dev/null || echo '{"success":false}')
        
        if echo "$RESPONSE" | grep -q '"success":true'; then
            echo "✅ Admin login verification successful!"
            echo ""
            echo "🎉 ALL FIXES APPLIED SUCCESSFULLY!"
            echo "================================="
            echo "Admin Panel: https://viticultwhisky.co.uk/admin"
            echo "Credentials: admin@viticultwhisky.co.uk / admin123"
        else
            echo "❌ Admin login still failing"
            echo "Response: $RESPONSE"
            echo ""
            echo "Additional debugging required."
        fi
}

# Deploy fresh installation
deploy_fresh() {
    local skip_build=${1:-false}
    
    log_step "Starting fresh deployment..."
    
    # Step 1: Clean and upload
    log_info "Step 1: Uploading project files..."
    ssh $VPS_USER@$VPS_IP "rm -rf /var/www/whisky && mkdir -p /var/www/"
    scp -r . $VPS_USER@$VPS_IP:/var/www/whisky/
    log_success "Project files uploaded"
    
    # Step 2: Install dependencies and build
    if [ "$skip_build" != "true" ]; then
        log_info "Step 2: Installing dependencies and building..." 
        ssh $VPS_USER@$VPS_IP << 'EOF'
            cd /var/www/whisky
            
            # Backend dependencies
            cd backend
            npm install --production
            echo "✅ Backend dependencies installed"
            
            # Frontend build
            cd ../frontend
            npm install
            npm run build
            echo "✅ Frontend built"
            
            # Copy images to web root (Hero Image Fix)
            if [ -d "frontend/build/whisky" ]; then
                cp -r frontend/build/whisky/* whisky/
                chown -R www-data:www-data whisky/
                echo "✅ Images copied to web root"
            fi
EOF
        log_success "Dependencies installed and built"
    fi
    
    # Step 3: Apply fixes
    fix_deployment
    
    log_success "Fresh deployment completed!"
}

# Update existing deployment
update_deployment() {
    local skip_build=${1:-false}
    
    log_step "Updating existing deployment..."
    
    # Upload new code
    log_info "Uploading updated code..."
    scp -r backend/ $VPS_USER@$VPS_IP:/var/www/whisky/
    scp -r frontend/ $VPS_USER@$VPS_IP:/var/www/whisky/ 
    
    if [ "$skip_build" != "true" ]; then
        log_info "Rebuilding frontend..."
        ssh $VPS_USER@$VPS_IP "cd /var/www/whisky/frontend && npm run build"
        
        # Copy images after rebuild (Hero Image Fix)
        log_info "Copying images to web root..."
        ssh $VPS_USER@$VPS_IP "cd /var/www/whisky && if [ -d 'frontend/build/whisky' ]; then cp -r frontend/build/whisky/* whisky/ && chown -R www-data:www-data whisky/; fi"
    fi
    
    # Restart services
    log_info "Restarting services..."
    ssh $VPS_USER@$VPS_IP "cd /var/www/whisky/backend && pm2 restart whisky-backend"
    
    log_success "Deployment updated!"
}

# Test deployment health
test_deployment() {
    log_test "Testing deployment health..."
    
    ssh $VPS_USER@$VPS_IP << 'EOF'
        echo "🧪 Deployment Health Test"
        echo "========================"
        echo ""
        
        # Test backend
        echo "Testing backend API..."
        if curl -s http://localhost:5000/api/health | grep -q "ok"; then
            echo "✅ Backend health check passed"
        else
            echo "❌ Backend health check failed"
        fi
        
        # Test admin login
        echo ""
        echo "Testing admin authentication..."
        RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/admin/login \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}')
        
        if echo "$RESPONSE" | grep -q '"success":true'; then
            echo "✅ Admin authentication working"
        else
            echo "❌ Admin authentication failed"
            echo "Response: $RESPONSE"
        fi
        
        # Test public access
        echo ""
        echo "Testing public access..."
        if curl -s -I https://viticultwhisky.co.uk | grep -q "200 OK"; then
            echo "✅ Website publicly accessible"
        else
            echo "❌ Website not accessible"
        fi
        
EOF
}

# Main execution
main() {
    local mode=${1:-help}
    local skip_build=false
    local force=false
    local verbose=false
    
    # Parse arguments
    for arg in "$@"; do
        case $arg in
            --skip-build) skip_build=true ;;
            --force) force=true ;;
            --verbose) verbose=true; set -x ;;
            -*) log_warning "Unknown option: $arg" ;;
        esac
    done
    
    case $mode in
        deploy)
            show_banner
            log_info "Mode: Fresh Deployment"
            test_connectivity
            deploy_fresh $skip_build
            test_deployment
            ;;
        update)
            show_banner  
            log_info "Mode: Update Existing Deployment"
            test_connectivity
            update_deployment $skip_build
            test_deployment
            ;;
        diagnose)
            show_banner
            log_info "Mode: Diagnostics"
            test_connectivity
            diagnose_deployment
            ;;
        fix)
            show_banner
            log_info "Mode: Fix Issues"
            test_connectivity
            fix_deployment
            test_deployment
            ;;
        test)
            show_banner
            log_info "Mode: Health Test"
            test_connectivity
            test_deployment
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown mode: $mode"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Execute main function with all arguments
main "$@"