#!/bin/bash

# 💾 Automated Backup Script
# Creates comprehensive backups with versioning and retention

set -e

echo "💾 AUTOMATED BACKUP SYSTEM"
echo "=========================="

# Configuration
BACKUP_BASE_DIR="/var/backups/whisky"
LOCAL_BACKUP_DIR="/tmp/whisky-backups"
RETENTION_DAYS=30
MAX_BACKUPS=10

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create backup directories
sudo mkdir -p "$BACKUP_BASE_DIR"
mkdir -p "$LOCAL_BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="whisky-backup-$TIMESTAMP"

echo "Creating backup: $BACKUP_NAME"
echo "Time: $(date)"
echo ""

# Function to calculate size
human_size() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$((bytes/1024))KB"
    elif [ $bytes -lt 1073741824 ]; then
        echo "$((bytes/1048576))MB"
    else
        echo "$((bytes/1073741824))GB"
    fi
}

# 1. Create website backup
echo "📂 Step 1: Backing up website files"
echo "====================================="

cd /var/www
tar -czf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-website.tar.gz" viticultwhisky/ 2>/dev/null
WEBSITE_SIZE=$(stat -c%s "$LOCAL_BACKUP_DIR/$BACKUP_NAME-website.tar.gz")
echo -e "${GREEN}✅ Website backup: $(human_size $WEBSITE_SIZE)${NC}"

# 2. Create database backup
echo ""
echo "🗄️  Step 2: Backing up database"
echo "==============================="

# Get MongoDB URI from environment
cd /var/www/viticultwhisky/backend
MONGODB_URI=$(grep "MONGODB_URI=" .env.production 2>/dev/null | cut -d= -f2)

if [ -n "$MONGODB_URI" ]; then
    # Extract database name from URI
    DB_NAME=$(echo "$MONGODB_URI" | sed 's/.*\/\([^?]*\).*/\1/')
    
    # Create MongoDB dump
    mongodump --uri="$MONGODB_URI" --out "$LOCAL_BACKUP_DIR/$BACKUP_NAME-db" 2>/dev/null
    tar -czf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-database.tar.gz" -C "$LOCAL_BACKUP_DIR" "$BACKUP_NAME-db" 2>/dev/null
    rm -rf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-db"
    
    DB_SIZE=$(stat -c%s "$LOCAL_BACKUP_DIR/$BACKUP_NAME-database.tar.gz" 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ Database backup: $(human_size $DB_SIZE)${NC}"
else
    echo -e "${YELLOW}⚠️ MongoDB URI not found, skipping database backup${NC}"
    touch "$LOCAL_BACKUP_DIR/$BACKUP_NAME-database.tar.gz"
fi

# 3. Create configuration backup
echo ""
echo "⚙️  Step 3: Backing up configurations"
echo "====================================="

mkdir -p "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config"

# Backup environment files
cp /var/www/viticultwhisky/backend/.env.production "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config/" 2>/dev/null || true

# Backup nginx config
cp /etc/nginx/sites-available/viticultwhisky.co.uk "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config/" 2>/dev/null || true

# Backup PM2 config
pm2 save 2>/dev/null || true
cp ~/.pm2/dump.pm2 "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config/" 2>/dev/null || true

# Backup SSL certificates
sudo cp -r /etc/letsencrypt/live/viticultwhisky.co.uk "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config/" 2>/dev/null || true

tar -czf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config.tar.gz" -C "$LOCAL_BACKUP_DIR" "$BACKUP_NAME-config" 2>/dev/null
rm -rf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config"

CONFIG_SIZE=$(stat -c%s "$LOCAL_BACKUP_DIR/$BACKUP_NAME-config.tar.gz")
echo -e "${GREEN}✅ Configuration backup: $(human_size $CONFIG_SIZE)${NC}"

# 4. Create logs backup
echo ""
echo "📋 Step 4: Backing up logs"
echo "=========================="

mkdir -p "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs"

# PM2 logs
cp ~/.pm2/logs/* "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs/" 2>/dev/null || true

# Nginx logs
sudo cp /var/log/nginx/access.log "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs/" 2>/dev/null || true
sudo cp /var/log/nginx/error.log "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs/" 2>/dev/null || true

# System logs related to website
sudo journalctl -u nginx --since "1 week ago" > "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs/nginx-journal.log" 2>/dev/null || true

tar -czf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs.tar.gz" -C "$LOCAL_BACKUP_DIR" "$BACKUP_NAME-logs" 2>/dev/null
rm -rf "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs"

LOGS_SIZE=$(stat -c%s "$LOCAL_BACKUP_DIR/$BACKUP_NAME-logs.tar.gz")
echo -e "${GREEN}✅ Logs backup: $(human_size $LOGS_SIZE)${NC}"

# 5. Create complete backup bundle
echo ""
echo "📦 Step 5: Creating complete backup bundle"
echo "=========================================="

cd "$LOCAL_BACKUP_DIR"
tar -czf "$BACKUP_NAME-COMPLETE.tar.gz" "$BACKUP_NAME"-*.tar.gz

COMPLETE_SIZE=$(stat -c%s "$BACKUP_NAME-COMPLETE.tar.gz")
echo -e "${GREEN}✅ Complete backup: $(human_size $COMPLETE_SIZE)${NC}"

# 6. Move to permanent storage
echo ""
echo "🏠 Step 6: Moving to permanent storage"
echo "======================================"

sudo mv "$BACKUP_NAME-COMPLETE.tar.gz" "$BACKUP_BASE_DIR/"
sudo mv "$BACKUP_NAME"-*.tar.gz "$BACKUP_BASE_DIR/"

echo -e "${GREEN}✅ Backup stored in: $BACKUP_BASE_DIR${NC}"

# 7. Create backup manifest
echo ""
echo "📝 Step 7: Creating backup manifest"
echo "==================================="

MANIFEST_FILE="$BACKUP_BASE_DIR/$BACKUP_NAME-manifest.txt"
sudo tee "$MANIFEST_FILE" > /dev/null << EOF
WHISKY WEBSITE BACKUP MANIFEST
==============================
Backup Name: $BACKUP_NAME
Created: $(date)
Server: $(hostname)
User: $(whoami)

FILES:
- $BACKUP_NAME-website.tar.gz     ($(human_size $WEBSITE_SIZE))
- $BACKUP_NAME-database.tar.gz    ($(human_size $DB_SIZE))
- $BACKUP_NAME-config.tar.gz      ($(human_size $CONFIG_SIZE))
- $BACKUP_NAME-logs.tar.gz        ($(human_size $LOGS_SIZE))
- $BACKUP_NAME-COMPLETE.tar.gz    ($(human_size $COMPLETE_SIZE))

TOTAL SIZE: $(human_size $((WEBSITE_SIZE + DB_SIZE + CONFIG_SIZE + LOGS_SIZE)))

RESTORE INSTRUCTIONS:
=====================
1. Stop services: pm2 stop all && sudo systemctl stop nginx
2. Extract: cd / && sudo tar -xzf $BACKUP_BASE_DIR/$BACKUP_NAME-COMPLETE.tar.gz
3. Restore website: sudo tar -xzf $BACKUP_NAME-website.tar.gz
4. Restore database: tar -xzf $BACKUP_NAME-database.tar.gz && mongorestore
5. Restore config: tar -xzf $BACKUP_NAME-config.tar.gz && sudo cp configs to proper locations
6. Start services: pm2 start all && sudo systemctl start nginx

VERIFICATION:
- Website: curl https://viticultwhisky.co.uk
- Admin: curl -X POST http://localhost:5001/api/auth/admin/login
- Health: whisky-health-check
EOF

echo -e "${GREEN}✅ Manifest created: $MANIFEST_FILE${NC}"

# 8. Cleanup old backups
echo ""
echo "🧹 Step 8: Cleaning up old backups"
echo "=================================="

# Remove backups older than retention period
sudo find "$BACKUP_BASE_DIR" -name "whisky-backup-*" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# Keep only the most recent backups
BACKUP_COUNT=$(sudo ls -1 "$BACKUP_BASE_DIR"/whisky-backup-*-COMPLETE.tar.gz 2>/dev/null | wc -l)
if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    EXCESS=$((BACKUP_COUNT - MAX_BACKUPS))
    sudo ls -1t "$BACKUP_BASE_DIR"/whisky-backup-*-COMPLETE.tar.gz | tail -n $EXCESS | sudo xargs rm -f
    echo "🗑️  Removed $EXCESS old backups"
fi

REMAINING=$(sudo ls -1 "$BACKUP_BASE_DIR"/whisky-backup-*-COMPLETE.tar.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Cleanup complete: $REMAINING backups retained${NC}"

# 9. Summary
echo ""
echo "📊 BACKUP SUMMARY"
echo "================="
echo -e "Backup Name: ${GREEN}$BACKUP_NAME${NC}"
echo -e "Total Size: ${GREEN}$(human_size $COMPLETE_SIZE)${NC}"
echo -e "Location: ${GREEN}$BACKUP_BASE_DIR${NC}"
echo -e "Retention: ${GREEN}$RETENTION_DAYS days${NC}"
echo -e "Status: ${GREEN}SUCCESS${NC}"
echo ""

# Log the backup
echo "$(date): Backup $BACKUP_NAME completed successfully ($COMPLETE_SIZE bytes)" >> /var/log/whisky-backup.log 2>/dev/null || true

echo "🎉 Backup completed successfully!"
echo ""
echo "To restore this backup:"
echo "  sudo tar -xzf $BACKUP_BASE_DIR/$BACKUP_NAME-COMPLETE.tar.gz"
echo ""
echo "Available backups:"
sudo ls -lah "$BACKUP_BASE_DIR"/whisky-backup-*-COMPLETE.tar.gz 2>/dev/null | tail -5 || echo "No backups found"
echo ""