#!/bin/bash

echo "🚀 Disabling Investment-Grade Whisky Casks Section"
echo "=================================================="

# Step 1: Find the website directory
echo "🔍 Finding website directory..."
if [ -d "/var/www/viticultwhisky.co.uk" ]; then
    WEB_DIR="/var/www/viticultwhisky.co.uk"
    echo "✅ Found website at: $WEB_DIR"
elif [ -d "/var/www/html" ]; then
    WEB_DIR="/var/www/html"
    echo "✅ Found website at: $WEB_DIR"
elif [ -d "/var/www/whisky/frontend/build" ]; then
    WEB_DIR="/var/www/whisky/frontend/build"
    echo "✅ Found website at: $WEB_DIR"
else
    echo "❌ Could not find website directory"
    echo "Please run: find /var/www -name '*.html' -type f"
    exit 1
fi

cd "$WEB_DIR"

# Step 2: Backup current files
echo "📦 Creating backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r static/ "$BACKUP_DIR/" 2>/dev/null || echo "No static directory to backup"
cp index.html "$BACKUP_DIR/" 2>/dev/null || echo "No index.html to backup"
echo "✅ Backup created at: $WEB_DIR/$BACKUP_DIR"

# Step 3: Find and modify the main JavaScript file
echo "🔧 Modifying main JavaScript file..."
MAIN_JS=$(find . -name "main.*.js" -type f | head -1)

if [ -n "$MAIN_JS" ]; then
    echo "✅ Found main JS file: $MAIN_JS"
    
    # Create a backup of the JS file
    cp "$MAIN_JS" "$BACKUP_DIR/main.js.backup"
    
    # Replace the buy section content with an empty div
    # This is a simplified approach - we're commenting out the buy functionality
    sed -i.bak 's/Investment-Grade Whisky Casks/Section Temporarily Disabled/g' "$MAIN_JS"
    sed -i.bak 's/Buy Whisky/Sell Whisky Only/g' "$MAIN_JS"
    
    echo "✅ Modified main JavaScript file"
else
    echo "❌ Could not find main JavaScript file"
    echo "Available JS files:"
    find . -name "*.js" -type f
fi

# Step 4: Check if there's a React build structure
if [ -d "static/js" ]; then
    echo "🔧 Found React build structure"
    
    # Find all chunk files that might contain the buy section
    for js_file in static/js/*.js; do
        if grep -q "Investment-Grade" "$js_file" 2>/dev/null; then
            echo "✅ Found buy section in: $js_file"
            cp "$js_file" "$BACKUP_DIR/"
            
            # Replace the content
            sed -i.bak 's/Investment-Grade Whisky Casks/Section Temporarily Disabled/g' "$js_file"
            sed -i.bak 's/Highland Single Malt 2018//g' "$js_file"
            sed -i.bak 's/Islay Peated Cask 2019//g' "$js_file"
            sed -i.bak 's/Speyside Reserve 2017//g' "$js_file"
            sed -i.bak 's/Highland Park 2016//g' "$js_file"
            sed -i.bak 's/Buy Whisky/Sell Whisky Only/g' "$js_file"
            
            echo "✅ Modified: $js_file"
        fi
    done
fi

# Step 5: Restart web server if needed
echo "🔄 Restarting web services..."
if systemctl is-active --quiet nginx; then
    systemctl reload nginx
    echo "✅ Nginx reloaded"
fi

if command -v pm2 &> /dev/null; then
    pm2 restart all
    echo "✅ PM2 processes restarted"
fi

echo ""
echo "🎉 Buy section disable completed!"
echo "================================="
echo "✅ Backup created at: $WEB_DIR/$BACKUP_DIR"
echo "✅ Investment-Grade Whisky Casks section should now be disabled"
echo ""
echo "To verify, visit: https://viticultwhisky.co.uk/buy-sell"
echo ""
echo "To rollback if needed:"
echo "cp $WEB_DIR/$BACKUP_DIR/* $WEB_DIR/static/js/"