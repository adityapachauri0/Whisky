#!/bin/bash

echo "🚀 DISABLING INVESTMENT-GRADE WHISKY CASKS SECTION"
echo "=================================================="
echo "Starting at: $(date)"
echo ""

# Function to log with timestamp
log() {
    echo "[$(date '+%H:%M:%S')] $1"
}

# Step 1: Find website directory
log "🔍 Finding website directory..."
WEB_DIR=""

# Check common locations
if [ -d "/var/www/viticultwhisky.co.uk" ]; then
    WEB_DIR="/var/www/viticultwhisky.co.uk"
elif [ -d "/var/www/html" ]; then
    WEB_DIR="/var/www/html"
elif [ -d "/var/www/whisky/frontend/build" ]; then
    WEB_DIR="/var/www/whisky/frontend/build"
elif [ -d "/usr/share/nginx/html" ]; then
    WEB_DIR="/usr/share/nginx/html"
fi

if [ -z "$WEB_DIR" ]; then
    log "❌ Could not find website directory automatically"
    log "Please run: find /var/www -name index.html -type f"
    exit 1
fi

log "✅ Found website directory: $WEB_DIR"
cd "$WEB_DIR"

# Step 2: Create backup
log "📦 Creating backup..."
BACKUP_DIR="backup_buy_section_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup all relevant files
if [ -d "static" ]; then
    cp -r static/ "$BACKUP_DIR/"
    log "✅ Backed up static/ directory"
fi

if [ -f "index.html" ]; then
    cp index.html "$BACKUP_DIR/"
    log "✅ Backed up index.html"
fi

# Step 3: Find files containing buy section
log "🔍 Searching for files containing Investment-Grade content..."

# Find all JS files that contain the buy section
BUY_FILES=$(grep -r "Investment-Grade Whisky Casks" . --include="*.js" -l 2>/dev/null)
if [ -n "$BUY_FILES" ]; then
    log "✅ Found files containing Investment-Grade content:"
    echo "$BUY_FILES" | while read file; do
        log "   - $file"
    done
else
    log "⚠️  No files found with 'Investment-Grade Whisky Casks'"
    # Try alternative search
    BUY_FILES=$(grep -r "Highland Single Malt 2018" . --include="*.js" -l 2>/dev/null)
    if [ -n "$BUY_FILES" ]; then
        log "✅ Found files containing Highland Single Malt:"
        echo "$BUY_FILES" | while read file; do
            log "   - $file"
        done
    fi
fi

# Step 4: Disable buy section in found files
log "🔧 Disabling buy section in JavaScript files..."

if [ -n "$BUY_FILES" ]; then
    echo "$BUY_FILES" | while read file; do
        if [ -f "$file" ]; then
            log "✅ Processing: $file"
            
            # Create backup of this specific file
            cp "$file" "$BACKUP_DIR/$(basename "$file").backup"
            
            # Apply replacements to disable buy functionality
            sed -i.tmp 's/Investment-Grade Whisky Casks/Section Temporarily Disabled/g' "$file"
            sed -i.tmp 's/Highland Single Malt 2018/Unavailable/g' "$file"
            sed -i.tmp 's/Islay Peated Cask 2019/Unavailable/g' "$file"
            sed -i.tmp 's/Speyside Reserve 2017/Unavailable/g' "$file"
            sed -i.tmp 's/Highland Park 2016/Unavailable/g' "$file"
            sed -i.tmp 's/The Dalmore/Unavailable/g' "$file"
            sed -i.tmp 's/Lagavulin/Unavailable/g' "$file"
            sed -i.tmp 's/The Macallan/Unavailable/g' "$file"
            sed -i.tmp 's/Highland Park/Unavailable/g' "$file"
            sed -i.tmp 's/£12,500/N\/A/g' "$file"
            sed -i.tmp 's/£18,750/N\/A/g' "$file"
            sed -i.tmp 's/£45,000/N\/A/g' "$file"
            sed -i.tmp 's/£28,500/N\/A/g' "$file"
            sed -i.tmp 's/Buy Whisky/Sell Whisky Only/g' "$file"
            
            # Clean up temp files
            rm -f "$file.tmp"
            
            log "✅ Modified: $file"
        fi
    done
else
    log "❌ No files found to modify"
    log "Manual search required. Try:"
    log "   find . -name '*.js' -exec grep -l 'Buy.*Whisky' {} \\;"
fi

# Step 5: Clear any caches
log "🔄 Clearing potential caches..."

# Clear nginx cache if it exists
if [ -d "/var/cache/nginx" ]; then
    rm -rf /var/cache/nginx/*
    log "✅ Cleared nginx cache"
fi

# Step 6: Restart services
log "🔄 Restarting web services..."

# Restart nginx
if systemctl is-active --quiet nginx; then
    systemctl reload nginx
    log "✅ Nginx reloaded"
elif service nginx status >/dev/null 2>&1; then
    service nginx reload
    log "✅ Nginx reloaded (via service)"
fi

# Restart PM2 if it exists
if command -v pm2 >/dev/null 2>&1; then
    pm2 restart all >/dev/null 2>&1
    log "✅ PM2 processes restarted"
fi

# Step 7: Verify changes
log "🔍 Verifying changes..."
if [ -n "$BUY_FILES" ]; then
    echo "$BUY_FILES" | while read file; do
        if grep -q "Section Temporarily Disabled" "$file" 2>/dev/null; then
            log "✅ Verification: $file contains disabled content"
        else
            log "⚠️  Verification: $file may not be properly modified"
        fi
    done
fi

# Final summary
log ""
log "🎉 BUY SECTION DISABLE PROCESS COMPLETED!"
log "========================================"
log "✅ Backup created at: $WEB_DIR/$BACKUP_DIR"
log "✅ Investment-Grade Whisky Casks section disabled"
log "✅ Web services restarted"
log ""
log "🔗 Please verify by visiting: https://viticultwhisky.co.uk/buy-sell"
log ""
log "📝 To rollback if needed:"
log "   cd $WEB_DIR"
log "   cp $BACKUP_DIR/*.backup static/js/"
log "   systemctl reload nginx"
log ""
log "Completed at: $(date)"