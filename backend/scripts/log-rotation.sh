#!/bin/bash

# Log Rotation Script
# Manages application logs to prevent disk space issues

APP_NAME="viticult-whisky"
LOG_DIR="/var/log/$APP_NAME"
APP_LOG_DIR="/var/www/$APP_NAME/backend/logs"
MAX_SIZE="10M"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "$(date): Starting log rotation for $APP_NAME"

# Create backup directory for rotated logs
mkdir -p $LOG_DIR/archived

# Function to rotate log file
rotate_log() {
    local log_file=$1
    local log_name=$(basename $log_file .log)
    
    if [ -f "$log_file" ]; then
        local file_size=$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null)
        local max_size_bytes=$((10 * 1024 * 1024)) # 10MB in bytes
        
        if [ $file_size -gt $max_size_bytes ]; then
            echo "$(date): Rotating $log_file (size: $(du -h $log_file | cut -f1))"
            
            # Compress and move the log file
            gzip -c $log_file > $LOG_DIR/archived/${log_name}_${TIMESTAMP}.log.gz
            
            # Clear the original log file (don't delete to avoid breaking file handles)
            > $log_file
            
            echo "$(date): Rotated $log_file -> ${log_name}_${TIMESTAMP}.log.gz"
        fi
    fi
}

# Rotate application logs
if [ -d "$APP_LOG_DIR" ]; then
    for log_file in $APP_LOG_DIR/*.log; do
        [ -f "$log_file" ] && rotate_log "$log_file"
    done
fi

# Rotate system logs
for log_file in $LOG_DIR/*.log; do
    [ -f "$log_file" ] && rotate_log "$log_file"
done

# Rotate PM2 logs
if command -v pm2 >/dev/null 2>&1; then
    echo "$(date): Rotating PM2 logs"
    pm2 flush
fi

# Rotate Nginx logs (if needed)
if [ -f /var/log/nginx/access.log ]; then
    rotate_log /var/log/nginx/access.log
fi

if [ -f /var/log/nginx/error.log ]; then
    rotate_log /var/log/nginx/error.log
fi

# Clean up old archived logs
echo "$(date): Cleaning up old archived logs (older than $RETENTION_DAYS days)"
find $LOG_DIR/archived -name "*.log.gz" -mtime +$RETENTION_DAYS -delete

# Clean up MongoDB logs if they exist
if [ -f /var/log/mongodb/mongod.log ]; then
    rotate_log /var/log/mongodb/mongod.log
fi

# Generate log rotation summary
TOTAL_ARCHIVED=$(find $LOG_DIR/archived -name "*.log.gz" | wc -l)
TOTAL_SIZE=$(du -sh $LOG_DIR/archived 2>/dev/null | cut -f1 || echo "0")

echo "$(date): Log rotation completed"
echo "$(date): Total archived logs: $TOTAL_ARCHIVED"
echo "$(date): Total archived size: $TOTAL_SIZE"

# Optional: Send summary email
# echo "Log rotation completed. Archived logs: $TOTAL_ARCHIVED, Size: $TOTAL_SIZE" | mail -s "Log Rotation Summary" admin@viticultwhisky.co.uk