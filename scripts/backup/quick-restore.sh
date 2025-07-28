#!/bin/bash

# 🔄 Quick Restore Script
# Quickly restore from the most recent backup

set -e

echo "🔄 QUICK RESTORE SYSTEM"
echo "======================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BACKUP_BASE_DIR="/var/backups/whisky"

# Check if backup directory exists
if [ ! -d "$BACKUP_BASE_DIR" ]; then
    echo -e "${RED}❌ Backup directory not found: $BACKUP_BASE_DIR${NC}"
    echo "Run automated-backup.sh first to create backups"
    exit 1
fi

# List available backups
echo "📦 Available backups:"
echo "===================="
BACKUPS=($(sudo ls -1t "$BACKUP_BASE_DIR"/whisky-backup-*-COMPLETE.tar.gz 2>/dev/null))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}❌ No backups found${NC}"
    exit 1
fi

for i in "${!BACKUPS[@]}"; do
    BACKUP_FILE="${BACKUPS[$i]}"
    BACKUP_NAME=$(basename "$BACKUP_FILE" -COMPLETE.tar.gz)
    BACKUP_DATE=$(echo "$BACKUP_NAME" | grep -o '[0-9]\{8\}-[0-9]\{6\}')
    BACKUP_SIZE=$(sudo stat -c%s "$BACKUP_FILE" 2>/dev/null || echo "0")
    
    # Convert size to human readable
    if [ $BACKUP_SIZE -lt 1048576 ]; then
        SIZE_DISPLAY="$((BACKUP_SIZE/1024))KB"
    else
        SIZE_DISPLAY="$((BACKUP_SIZE/1048576))MB"
    fi
    
    echo "$((i+1)). $BACKUP_DATE ($SIZE_DISPLAY)"
done

echo ""

# Get user choice
if [ $# -eq 0 ]; then
    echo "Select backup to restore (1-${#BACKUPS[@]}) or press Enter for most recent:"
    read -r choice
    
    if [ -z "$choice" ]; then
        choice=1
    fi
else
    choice=$1
fi

# Validate choice
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#BACKUPS[@]} ]; then
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$((choice-1))]}"
BACKUP_NAME=$(basename "$SELECTED_BACKUP" -COMPLETE.tar.gz)

echo -e "${YELLOW}⚠️ WARNING: This will restore from backup: $BACKUP_NAME${NC}"
echo -e "${YELLOW}⚠️ This will OVERWRITE current website data${NC}"
echo ""
echo "Are you sure you want to continue? (y/N)"
read -r confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    exit 0
fi

echo ""
echo "🔄 Starting restore from: $BACKUP_NAME"
echo "======================================"

# Step 1: Create current backup before restore
echo "💾 Step 1: Creating safety backup of current state"
echo "=================================================="
SAFETY_BACKUP="/tmp/pre-restore-backup-$(date +%s).tar.gz"
cd /var/www
tar -czf "$SAFETY_BACKUP" viticultwhisky/ 2>/dev/null
echo -e "${GREEN}✅ Safety backup created: $SAFETY_BACKUP${NC}"

# Step 2: Stop services
echo ""
echo "🛑 Step 2: Stopping services"
echo "==========================="
pm2 stop viticult-backend 2>/dev/null || echo "Backend not running"
sudo systemctl stop nginx 2>/dev/null || echo "Nginx not running"
echo -e "${GREEN}✅ Services stopped${NC}"

# Step 3: Extract backup
echo ""
echo "📦 Step 3: Extracting backup"
echo "============================"
TEMP_RESTORE="/tmp/restore-$(date +%s)"
mkdir -p "$TEMP_RESTORE"
cd "$TEMP_RESTORE"

sudo tar -xzf "$SELECTED_BACKUP"
echo -e "${GREEN}✅ Backup extracted${NC}"

# Step 4: Restore website files
echo ""
echo "🌐 Step 4: Restoring website files"
echo "=================================="
if [ -f "$BACKUP_NAME-website.tar.gz" ]; then
    cd /var/www
    sudo rm -rf viticultwhisky.old 2>/dev/null || true
    sudo mv viticultwhisky viticultwhisky.old 2>/dev/null || true
    sudo tar -xzf "$TEMP_RESTORE/$BACKUP_NAME-website.tar.gz"
    echo -e "${GREEN}✅ Website files restored${NC}"
else
    echo -e "${RED}❌ Website backup not found${NC}"
    exit 1
fi

# Step 5: Restore database
echo ""
echo "🗄️  Step 5: Restoring database"
echo "=============================="
if [ -f "$TEMP_RESTORE/$BACKUP_NAME-database.tar.gz" ]; then
    cd "$TEMP_RESTORE"
    tar -xzf "$BACKUP_NAME-database.tar.gz"
    
    if [ -d "$BACKUP_NAME-db" ]; then
        # Get MongoDB URI
        MONGODB_URI=$(grep "MONGODB_URI=" /var/www/viticultwhisky/backend/.env.production 2>/dev/null | cut -d= -f2)
        
        if [ -n "$MONGODB_URI" ]; then
            mongorestore --uri="$MONGODB_URI" --drop "$BACKUP_NAME-db" 2>/dev/null
            echo -e "${GREEN}✅ Database restored${NC}"
        else
            echo -e "${YELLOW}⚠️ MongoDB URI not found, skipping database restore${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ No database data in backup${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Database backup not found${NC}"
fi

# Step 6: Restore configurations
echo ""
echo "⚙️  Step 6: Restoring configurations"
echo "===================================="
if [ -f "$TEMP_RESTORE/$BACKUP_NAME-config.tar.gz" ]; then
    cd "$TEMP_RESTORE"
    tar -xzf "$BACKUP_NAME-config.tar.gz"
    
    if [ -d "$BACKUP_NAME-config" ]; then
        # Restore nginx config
        if [ -f "$BACKUP_NAME-config/viticultwhisky.co.uk" ]; then
            sudo cp "$BACKUP_NAME-config/viticultwhisky.co.uk" /etc/nginx/sites-available/
            echo "✅ Nginx config restored"
        fi
        
        # Restore PM2 config
        if [ -f "$BACKUP_NAME-config/dump.pm2" ]; then
            cp "$BACKUP_NAME-config/dump.pm2" ~/.pm2/
            echo "✅ PM2 config restored"
        fi
        
        # Restore SSL certificates
        if [ -d "$BACKUP_NAME-config/viticultwhisky.co.uk" ]; then
            sudo cp -r "$BACKUP_NAME-config/viticultwhisky.co.uk" /etc/letsencrypt/live/
            echo "✅ SSL certificates restored"
        fi
    fi
    echo -e "${GREEN}✅ Configurations restored${NC}"
else
    echo -e "${YELLOW}⚠️ Configuration backup not found${NC}"
fi

# Step 7: Set permissions
echo ""
echo "🔐 Step 7: Setting permissions"
echo "=============================="
sudo chown -R $USER:$USER /var/www/viticultwhisky/
sudo chmod -R 755 /var/www/viticultwhisky/
echo -e "${GREEN}✅ Permissions set${NC}"

# Step 8: Start services
echo ""
echo "🚀 Step 8: Starting services"
echo "============================"
cd /var/www/viticultwhisky/backend
export NODE_ENV=production
pm2 start viticult-backend 2>/dev/null || pm2 restart viticult-backend
sudo systemctl start nginx

# Wait for services to start
sleep 5
echo -e "${GREEN}✅ Services started${NC}"

# Step 9: Test restoration
echo ""
echo "🧪 Step 9: Testing restoration"
echo "=============================="

# Test website
WEBSITE_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://viticultwhisky.co.uk 2>/dev/null)
if [ "$WEBSITE_TEST" = "200" ]; then
    echo -e "${GREEN}✅ Website accessible (HTTP $WEBSITE_TEST)${NC}"
else
    echo -e "${RED}❌ Website not accessible (HTTP $WEBSITE_TEST)${NC}"
fi

# Test admin login
ADMIN_TEST=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' 2>/dev/null)

if echo "$ADMIN_TEST" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Admin login working${NC}"
else
    echo -e "${RED}❌ Admin login failed${NC}"
fi

# Step 10: Cleanup
echo ""
echo "🧹 Step 10: Cleanup"
echo "=================="
rm -rf "$TEMP_RESTORE"
echo -e "${GREEN}✅ Temporary files cleaned${NC}"

# Summary
echo ""
echo "📊 RESTORE SUMMARY"
echo "=================="
echo -e "Restored from: ${GREEN}$BACKUP_NAME${NC}"
echo -e "Website: ${GREEN}https://viticultwhisky.co.uk${NC}"
echo -e "Admin: ${GREEN}https://viticultwhisky.co.uk/admin/login${NC}"
echo -e "Safety backup: ${GREEN}$SAFETY_BACKUP${NC}"
echo ""

if [ "$WEBSITE_TEST" = "200" ] && echo "$ADMIN_TEST" | grep -q "success"; then
    echo -e "${GREEN}🎉 RESTORE COMPLETED SUCCESSFULLY${NC}"
    echo ""
    echo "✅ Website is accessible"
    echo "✅ Admin login is working"
    echo "✅ All services are running"
else
    echo -e "${YELLOW}⚠️ RESTORE COMPLETED WITH ISSUES${NC}"
    echo ""
    echo "Some tests failed. Check the logs and run:"
    echo "  pm2 logs viticult-backend"
    echo "  sudo journalctl -u nginx"
    echo ""
    echo "If issues persist, you can rollback:"
    echo "  cd /var/www && sudo rm -rf viticultwhisky && sudo mv viticultwhisky.old viticultwhisky"
fi

echo ""
echo "To run a full health check:"
echo "  whisky-health-check"
echo ""