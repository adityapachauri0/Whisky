#!/bin/bash

# Temporary Files Cleanup Script
# Removes temporary files and caches to free up disk space

APP_NAME="viticult-whisky"
APP_DIR="/var/www/$APP_NAME"
LOG_DIR="/var/log/$APP_NAME"

echo "$(date): Starting temporary files cleanup"

# Track space before cleanup
INITIAL_SPACE=$(df / | awk 'NR==2 {print $4}')

# Clean PM2 logs and dumps
if command -v pm2 >/dev/null 2>&1; then
    echo "$(date): Cleaning PM2 logs and dumps"
    pm2 flush
    rm -rf ~/.pm2/logs/*.log
    rm -rf ~/.pm2/dumps/*
fi

# Clean Node.js cache
if [ -d "$APP_DIR/backend/node_modules/.cache" ]; then
    echo "$(date): Cleaning Node.js cache"
    rm -rf $APP_DIR/backend/node_modules/.cache/*
fi

if [ -d "$APP_DIR/frontend/node_modules/.cache" ]; then
    echo "$(date): Cleaning frontend cache"
    rm -rf $APP_DIR/frontend/node_modules/.cache/*
fi

# Clean npm cache
if command -v npm >/dev/null 2>&1; then
    echo "$(date): Cleaning npm cache"
    npm cache clean --force
fi

# Clean temporary directories
echo "$(date): Cleaning system temporary files"
find /tmp -name "*viticult*" -mtime +1 -delete 2>/dev/null
find /tmp -name "*.tmp" -mtime +7 -delete 2>/dev/null
find /var/tmp -name "*.tmp" -mtime +7 -delete 2>/dev/null

# Clean old log files
echo "$(date): Cleaning old log files"
find $LOG_DIR -name "*.log" -mtime +30 -delete 2>/dev/null
find $APP_DIR/backend/logs -name "*.log" -mtime +30 -delete 2>/dev/null

# Clean old backup files
echo "$(date): Cleaning old backup files"
find /var/backups/$APP_NAME -name "*.gz" -mtime +30 -delete 2>/dev/null

# Clean MongoDB logs if needed
if [ -f /var/log/mongodb/mongod.log ]; then
    MONGO_LOG_SIZE=$(stat -f%z "/var/log/mongodb/mongod.log" 2>/dev/null || stat -c%s "/var/log/mongodb/mongod.log" 2>/dev/null)
    if [ $MONGO_LOG_SIZE -gt 104857600 ]; then  # 100MB
        echo "$(date): Rotating large MongoDB log"
        logrotate -f /etc/logrotate.d/mongodb-server 2>/dev/null || echo "" > /var/log/mongodb/mongod.log
    fi
fi

# Clean Nginx logs if they're too large
if [ -f /var/log/nginx/access.log ]; then
    NGINX_LOG_SIZE=$(stat -f%z "/var/log/nginx/access.log" 2>/dev/null || stat -c%s "/var/log/nginx/access.log" 2>/dev/null)
    if [ $NGINX_LOG_SIZE -gt 104857600 ]; then  # 100MB
        echo "$(date): Rotating large Nginx access log"
        logrotate -f /etc/logrotate.d/nginx 2>/dev/null || echo "" > /var/log/nginx/access.log
    fi
fi

# Clean system journal logs (keep last 7 days)
if command -v journalctl >/dev/null 2>&1; then
    echo "$(date): Cleaning system journal logs"
    journalctl --vacuum-time=7d
fi

# Clean APT cache (Ubuntu/Debian)
if command -v apt-get >/dev/null 2>&1; then
    echo "$(date): Cleaning APT cache"
    apt-get clean
    apt-get autoremove -y
fi

# Clean YUM cache (CentOS/RHEL)
if command -v yum >/dev/null 2>&1; then
    echo "$(date): Cleaning YUM cache"
    yum clean all
fi

# Clean Docker if installed
if command -v docker >/dev/null 2>&1; then
    echo "$(date): Cleaning Docker unused resources"
    docker system prune -f
fi

# Clean application-specific temporary files
if [ -d "$APP_DIR/backend/temp" ]; then
    echo "$(date): Cleaning application temp directory"
    find $APP_DIR/backend/temp -type f -mtime +1 -delete
fi

# Clean old session files if any
find /tmp -name "sess_*" -mtime +1 -delete 2>/dev/null

# Clean core dumps
find /var/crash -name "*.crash" -mtime +7 -delete 2>/dev/null
find / -name "core.*" -mtime +7 -delete 2>/dev/null

# Calculate space freed
FINAL_SPACE=$(df / | awk 'NR==2 {print $4}')
SPACE_FREED=$((FINAL_SPACE - INITIAL_SPACE))

if [ $SPACE_FREED -gt 0 ]; then
    SPACE_FREED_MB=$((SPACE_FREED / 1024))
    echo "$(date): Cleanup completed - freed ${SPACE_FREED_MB}MB of disk space"
else
    echo "$(date): Cleanup completed - no significant space freed"
fi

# Check final disk usage
FINAL_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
echo "$(date): Current disk usage: ${FINAL_USAGE}%"

if [ $FINAL_USAGE -gt 85 ]; then
    echo "$(date): ⚠️  WARNING: Disk usage still high after cleanup"
    # Send alert
    # echo "Disk usage still high after cleanup: ${FINAL_USAGE}%" | mail -s "Disk Space Alert" admin@viticultwhisky.co.uk
fi

echo "$(date): Temporary files cleanup completed"