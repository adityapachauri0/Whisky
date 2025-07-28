#!/bin/bash

# Deploy Hero Image Fix
echo "🔧 Deploying Hero Image Fix to VPS"
echo "=================================="

VPS_IP="173.249.4.116"
VPS_USER="root"

# Check if running locally on VPS
if [ "$(hostname)" = "srv897225" ] || [ -d "/var/www/whisky/backend" ]; then
    echo "🏠 Running locally on VPS - deploying directly"
    
    # Copy new frontend build
    echo "📦 Copying updated frontend build..."
    cp -r frontend/build/* /var/www/whisky/ 2>/dev/null || {
        echo "❌ Failed to copy frontend build"
        exit 1
    }
    
    # Verify hero image files are present
    echo "🔍 Verifying hero image files..."
    HERO_DIR="/var/www/whisky/whisky/hero/optimized"
    if [ -d "$HERO_DIR" ]; then
        echo "✅ Hero image directory exists"
        
        # Check for URL-safe files
        if [ -f "$HERO_DIR/resized_winery_Viticult-7513835-1-1280w.webp" ]; then
            echo "✅ URL-safe hero image files present"
        else
            echo "❌ URL-safe hero image files missing"
        fi
        
        # List all winery files for verification
        echo "📋 All winery image files:"
        ls -la "$HERO_DIR/" | grep "winery_Viticult-7513835" | while read line; do
            echo "   $line"
        done
    else
        echo "❌ Hero image directory not found"
    fi
else
    echo "🌐 Running remotely - deploying via SSH"
    
    # Create deployment package
    echo "📦 Creating deployment package..."
    cd frontend
    tar -czf ../hero-image-fix.tar.gz -C build .
    cd ..
    
    # Upload to VPS
    echo "📤 Uploading to VPS..."
    scp hero-image-fix.tar.gz $VPS_USER@$VPS_IP:/tmp/
    
    # Deploy on VPS
    echo "🚀 Deploying on VPS..."
    ssh $VPS_USER@$VPS_IP << 'EOF'
        cd /var/www/whisky
        
        # Backup current frontend
        if [ -d "frontend_backup" ]; then
            rm -rf frontend_backup_old
            mv frontend_backup frontend_backup_old
        fi
        mkdir -p frontend_backup
        cp -r index.html static whisky frontend_backup/ 2>/dev/null || true
        
        # Extract new build
        tar -xzf /tmp/hero-image-fix.tar.gz
        
        # Verify deployment
        echo "🔍 Verifying hero image deployment..."
        HERO_DIR="/var/www/whisky/whisky/hero/optimized"
        if [ -f "$HERO_DIR/resized_winery_Viticult-7513835-1-1280w.webp" ]; then
            echo "✅ URL-safe hero image files deployed successfully"
        else
            echo "❌ Hero image files not found - checking directory..."
            ls -la "$HERO_DIR/" | grep "winery" || echo "No winery files found"
        fi
        
        # Clean up
        rm -f /tmp/hero-image-fix.tar.gz
        
        # Set proper permissions
        chown -R www-data:www-data /var/www/whisky/whisky/
        
        echo "✅ Hero image fix deployment complete"
EOF
    
    # Clean up local package
    rm -f hero-image-fix.tar.gz
fi

echo ""
echo "🎉 Hero Image Fix Deployment Complete!"
echo "======================================="
echo ""
echo "🧪 Test Steps:"
echo "1. Open: https://viticultwhisky.co.uk"
echo "2. Hard refresh browser (Ctrl+Shift+R)"
echo "3. Check if first hero image loads properly"
echo "4. Test direct image URL:"
echo "   https://viticultwhisky.co.uk/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp"
echo ""
echo "💡 What was fixed:"
echo "   ❌ Old filename: 'resized_winery_Viticult-7513835 (1)'"
echo "   ✅ New filename: 'resized_winery_Viticult-7513835-1'"
echo "   🔧 Issue: Spaces and parentheses caused URL encoding problems"
echo ""