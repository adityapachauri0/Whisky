#!/bin/bash

# Health Check Script
# Monitors application health and auto-restarts if needed

APP_NAME="viticult-whisky"
BACKEND_URL="http://localhost:5001/api/health"
FRONTEND_URL="http://localhost:3000"
PM2_APP_NAME="viticult-backend"
NGINX_SERVICE="nginx"
MONGO_SERVICE="mongod"

# Function to check service status
check_service() {
    local service_name=$1
    if systemctl is-active --quiet $service_name; then
        echo "$(date): ✅ $service_name is running"
        return 0
    else
        echo "$(date): ❌ $service_name is not running"
        return 1
    fi
}

# Function to check URL response
check_url() {
    local url=$1
    local service_name=$2
    
    if curl -sf --max-time 10 $url > /dev/null 2>&1; then
        echo "$(date): ✅ $service_name is responding ($url)"
        return 0
    else
        echo "$(date): ❌ $service_name is not responding ($url)"
        return 1
    fi
}

# Function to restart PM2 app
restart_app() {
    echo "$(date): 🔄 Restarting PM2 application: $PM2_APP_NAME"
    pm2 restart $PM2_APP_NAME
    sleep 5
    
    # Verify restart
    if pm2 list | grep -q "$PM2_APP_NAME.*online"; then
        echo "$(date): ✅ Application restarted successfully"
        return 0
    else
        echo "$(date): ❌ Application restart failed"
        return 1
    fi
}

# Main health check
echo "$(date): Starting health check for $APP_NAME"

# Check MongoDB
if ! check_service $MONGO_SERVICE; then
    echo "$(date): 🔄 Attempting to start MongoDB"
    systemctl start $MONGO_SERVICE
    sleep 3
fi

# Check Nginx
if ! check_service $NGINX_SERVICE; then
    echo "$(date): 🔄 Attempting to start Nginx"
    systemctl start $NGINX_SERVICE
    sleep 3
fi

# Check PM2 backend application
if ! pm2 list | grep -q "$PM2_APP_NAME.*online"; then
    echo "$(date): ❌ PM2 application $PM2_APP_NAME is not online"
    restart_app
fi

# Check backend API health
if ! check_url $BACKEND_URL "Backend API"; then
    echo "$(date): 🔄 Backend not responding, attempting restart"
    restart_app
    sleep 10
    
    # Recheck after restart
    if ! check_url $BACKEND_URL "Backend API"; then
        echo "$(date): ❌ Backend still not responding after restart"
        # Send critical alert
        # echo "Critical: Backend API down after restart attempt" | mail -s "CRITICAL ALERT" admin@viticultwhisky.co.uk
    fi
fi

# Check frontend (if serving with nginx)
# check_url $FRONTEND_URL "Frontend"

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "$(date): ⚠️  WARNING: Disk usage is ${DISK_USAGE}%"
    # Clean up temporary files
    /var/www/viticult-whisky/backend/scripts/cleanup-temp.sh
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 90 ]; then
    echo "$(date): ⚠️  WARNING: Memory usage is ${MEMORY_USAGE}%"
    # Optional: restart applications to free memory
    # restart_app
fi

# Check SSL certificate expiry (if using Let's Encrypt)
if [ -f /etc/letsencrypt/live/viticultwhisky.co.uk/cert.pem ]; then
    DAYS_UNTIL_EXPIRY=$(openssl x509 -in /etc/letsencrypt/live/viticultwhisky.co.uk/cert.pem -noout -dates | grep notAfter | cut -d= -f2 | xargs -I {} date -d "{}" +%s | xargs -I {} echo "({} - $(date +%s)) / 86400" | bc)
    
    if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
        echo "$(date): ⚠️  WARNING: SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
        # Trigger certificate renewal
        /var/www/viticult-whisky/backend/scripts/ssl-renewal.sh
    fi
fi

echo "$(date): Health check completed"