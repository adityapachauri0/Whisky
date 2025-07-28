#!/bin/bash

# Application Monitor Script
# Advanced monitoring with automatic recovery and alerts

APP_NAME="viticult-whisky"
PM2_APP_NAME="viticult-backend"
BACKEND_URL="http://localhost:5001/api/health"
MAX_RESPONSE_TIME=5000  # 5 seconds
MAX_MEMORY_MB=512       # 512MB
MAX_CPU_PERCENT=80      # 80%
RESTART_THRESHOLD=3     # Number of failed checks before restart

# State file to track consecutive failures
STATE_FILE="/tmp/viticult_monitor_state"

# Initialize state file if it doesn't exist
if [ ! -f "$STATE_FILE" ]; then
    echo "0" > "$STATE_FILE"
fi

# Read current failure count
FAILURE_COUNT=$(cat "$STATE_FILE")

echo "$(date): Starting application monitoring (failure count: $FAILURE_COUNT)"

# Function to reset failure counter
reset_failures() {
    echo "0" > "$STATE_FILE"
    echo "$(date): Failure counter reset"
}

# Function to increment failure counter
increment_failures() {
    FAILURE_COUNT=$((FAILURE_COUNT + 1))
    echo "$FAILURE_COUNT" > "$STATE_FILE"
    echo "$(date): Failure count increased to $FAILURE_COUNT"
}

# Function to check application response time
check_response_time() {
    echo "$(date): Checking response time..."
    
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' --max-time 10 $BACKEND_URL)
    if [ $? -eq 0 ]; then
        RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc | cut -d. -f1)
        echo "$(date): Response time: ${RESPONSE_MS}ms"
        
        if [ $RESPONSE_MS -gt $MAX_RESPONSE_TIME ]; then
            echo "$(date): ⚠️  WARNING: Slow response time (${RESPONSE_MS}ms > ${MAX_RESPONSE_TIME}ms)"
            return 1
        else
            echo "$(date): ✅ Response time OK"
            return 0
        fi
    else
        echo "$(date): ❌ Application not responding"
        return 1
    fi
}

# Function to check memory usage
check_memory_usage() {
    if command -v pm2 >/dev/null 2>&1; then
        MEMORY_MB=$(pm2 jlist | jq -r ".[] | select(.name==\"$PM2_APP_NAME\") | .memory" 2>/dev/null)
        
        if [ ! -z "$MEMORY_MB" ] && [ "$MEMORY_MB" != "null" ]; then
            MEMORY_MB=$(echo "$MEMORY_MB / 1024 / 1024" | bc)
            echo "$(date): Memory usage: ${MEMORY_MB}MB"
            
            if [ $MEMORY_MB -gt $MAX_MEMORY_MB ]; then
                echo "$(date): ⚠️  WARNING: High memory usage (${MEMORY_MB}MB > ${MAX_MEMORY_MB}MB)"
                return 1
            else
                echo "$(date): ✅ Memory usage OK"
                return 0
            fi
        fi
    fi
    return 0
}

# Function to check CPU usage
check_cpu_usage() {
    if command -v pm2 >/dev/null 2>&1; then
        CPU_PERCENT=$(pm2 jlist | jq -r ".[] | select(.name==\"$PM2_APP_NAME\") | .cpu" 2>/dev/null)
        
        if [ ! -z "$CPU_PERCENT" ] && [ "$CPU_PERCENT" != "null" ]; then
            CPU_PERCENT=$(echo "$CPU_PERCENT" | cut -d. -f1)
            echo "$(date): CPU usage: ${CPU_PERCENT}%"
            
            if [ $CPU_PERCENT -gt $MAX_CPU_PERCENT ]; then
                echo "$(date): ⚠️  WARNING: High CPU usage (${CPU_PERCENT}% > ${MAX_CPU_PERCENT}%)"
                return 1
            else
                echo "$(date): ✅ CPU usage OK"
                return 0
            fi
        fi
    fi
    return 0
}

# Function to restart application
restart_application() {
    echo "$(date): 🔄 Restarting application due to $FAILURE_COUNT consecutive failures"
    
    # Stop application gracefully
    pm2 stop $PM2_APP_NAME
    sleep 3
    
    # Kill any remaining processes
    pkill -f "node.*server.js"
    sleep 2
    
    # Start application
    cd /var/www/$APP_NAME/backend
    pm2 start ecosystem.config.js --only $PM2_APP_NAME
    
    # Wait for startup
    sleep 10
    
    # Verify restart
    if pm2 list | grep -q "$PM2_APP_NAME.*online"; then
        echo "$(date): ✅ Application restarted successfully"
        reset_failures
        
        # Send success notification
        # echo "Application automatically restarted at $(date)" | mail -s "Auto-Restart Success" admin@viticultwhisky.co.uk
        return 0
    else
        echo "$(date): ❌ Application restart failed"
        
        # Send failure notification
        # echo "CRITICAL: Application restart failed at $(date)" | mail -s "CRITICAL: Restart Failed" admin@viticultwhisky.co.uk
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    echo "$(date): Checking database connectivity..."
    
    if mongo --eval "db.adminCommand('ismaster')" >/dev/null 2>&1; then
        echo "$(date): ✅ Database connection OK"
        return 0
    else
        echo "$(date): ❌ Database connection failed"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    echo "$(date): Disk usage: ${DISK_USAGE}%"
    
    if [ $DISK_USAGE -gt 90 ]; then
        echo "$(date): ❌ CRITICAL: Disk usage critical (${DISK_USAGE}%)"
        
        # Trigger cleanup
        /var/www/$APP_NAME/backend/scripts/cleanup-temp.sh
        
        return 1
    elif [ $DISK_USAGE -gt 80 ]; then
        echo "$(date): ⚠️  WARNING: Disk usage high (${DISK_USAGE}%)"
        return 1
    else
        echo "$(date): ✅ Disk usage OK"
        return 0
    fi
}

# Main monitoring logic
HEALTH_ISSUES=0

# Check if PM2 app is running
if ! pm2 list | grep -q "$PM2_APP_NAME.*online"; then
    echo "$(date): ❌ PM2 application not online"
    HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
else
    echo "$(date): ✅ PM2 application is online"
fi

# Run all health checks
check_response_time || HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
check_memory_usage || HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
check_cpu_usage || HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
check_database || HEALTH_ISSUES=$((HEALTH_ISSUES + 1))
check_disk_space || HEALTH_ISSUES=$((HEALTH_ISSUES + 1))

# Evaluate health status
if [ $HEALTH_ISSUES -eq 0 ]; then
    echo "$(date): ✅ All health checks passed"
    reset_failures
else
    echo "$(date): ❌ $HEALTH_ISSUES health issues detected"
    increment_failures
    
    # Check if restart threshold reached
    if [ $FAILURE_COUNT -ge $RESTART_THRESHOLD ]; then
        restart_application
    else
        echo "$(date): Waiting for more failures before restart ($FAILURE_COUNT/$RESTART_THRESHOLD)"
    fi
fi

echo "$(date): Application monitoring completed"