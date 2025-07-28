#!/bin/bash

# Weekly Analytics and Performance Report
# Generates comprehensive weekly reports for system health and business metrics

APP_NAME="viticult-whisky"
APP_DIR="/var/www/$APP_NAME"
REPORT_DIR="/var/log/$APP_NAME/reports"
TIMESTAMP=$(date +%Y%m%d)
REPORT_FILE="$REPORT_DIR/weekly-report-$TIMESTAMP.html"

# Create reports directory
mkdir -p $REPORT_DIR

echo "$(date): Generating weekly report..."

# Start HTML report
cat > $REPORT_FILE << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Whisky Investment Platform - Weekly Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #1a1a1a; color: #d4af37; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
        .chart { margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
EOF

# Add report header
cat >> $REPORT_FILE << EOF
<div class="header">
    <h1>🥃 Whisky Investment Platform</h1>
    <h2>Weekly Performance Report</h2>
    <p>Report generated: $(date)</p>
    <p>Period: $(date -d '7 days ago' +%Y-%m-%d) to $(date +%Y-%m-%d)</p>
</div>
EOF

# System Health Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>🖥️ System Health & Performance</h3>
EOF

# Get system metrics
UPTIME=$(uptime | awk '{print $3,$4}' | sed 's/,//')
LOAD_AVG=$(uptime | awk '{print $10,$11,$12}')
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
DISK_USAGE=$(df / | awk 'NR==2{print $5}')
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

cat >> $REPORT_FILE << EOF
    <div class="metric">
        <strong>Server Uptime:</strong> $UPTIME
    </div>
    <div class="metric">
        <strong>Load Average:</strong> $LOAD_AVG
    </div>
    <div class="metric">
        <strong>Memory Usage:</strong> $MEMORY_USAGE
    </div>
    <div class="metric">
        <strong>Disk Usage:</strong> $DISK_USAGE
    </div>
    <div class="metric">
        <strong>CPU Usage:</strong> ${CPU_USAGE}%
    </div>
EOF

# Check application status
if pm2 list | grep -q "viticult-backend.*online"; then
    APP_STATUS="<span class='success'>✅ Online</span>"
else
    APP_STATUS="<span class='danger'>❌ Offline</span>"
fi

cat >> $REPORT_FILE << EOF
    <div class="metric">
        <strong>Application Status:</strong> $APP_STATUS
    </div>
</div>
EOF

# Security Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>🔒 Security Overview</h3>
EOF

# Check for failed login attempts in the last week
FAILED_LOGINS=0
if [ -f /var/log/auth.log ]; then
    FAILED_LOGINS=$(grep "Failed password" /var/log/auth.log | grep -E "$(date -d '7 days ago' +%b' '%d)|$(date -d '6 days ago' +%b' '%d)|$(date -d '5 days ago' +%b' '%d)|$(date -d '4 days ago' +%b' '%d)|$(date -d '3 days ago' +%b' '%d)|$(date -d '2 days ago' +%b' '%d)|$(date -d '1 day ago' +%b' '%d)|$(date +%b' '%d)" | wc -l)
fi

# Check SSL certificate
SSL_STATUS="Unknown"
SSL_DAYS_LEFT="N/A"
if [ -f "/etc/letsencrypt/live/viticultwhisky.co.uk/cert.pem" ]; then
    EXPIRY_DATE=$(openssl x509 -in /etc/letsencrypt/live/viticultwhisky.co.uk/cert.pem -noout -dates | grep notAfter | cut -d= -f2)
    EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
    CURRENT_TIMESTAMP=$(date +%s)
    SSL_DAYS_LEFT=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
    
    if [ $SSL_DAYS_LEFT -gt 30 ]; then
        SSL_STATUS="<span class='success'>✅ Valid</span>"
    elif [ $SSL_DAYS_LEFT -gt 7 ]; then
        SSL_STATUS="<span class='warning'>⚠️ Expires Soon</span>"
    else
        SSL_STATUS="<span class='danger'>❌ Critical</span>"
    fi
fi

cat >> $REPORT_FILE << EOF
    <div class="metric">
        <strong>Failed Login Attempts (7 days):</strong> $FAILED_LOGINS
    </div>
    <div class="metric">
        <strong>SSL Certificate:</strong> $SSL_STATUS ($SSL_DAYS_LEFT days left)
    </div>
</div>
EOF

# Application Metrics Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>📊 Application Metrics</h3>
EOF

# Get application logs and metrics
ERROR_COUNT=0
if [ -f "$APP_DIR/backend/logs/error.log" ]; then
    ERROR_COUNT=$(grep -E "$(date -d '7 days ago' +%Y-%m-%d)|$(date -d '6 days ago' +%Y-%m-%d)|$(date -d '5 days ago' +%Y-%m-%d)|$(date -d '4 days ago' +%Y-%m-%d)|$(date -d '3 days ago' +%Y-%m-%d)|$(date -d '2 days ago' +%Y-%m-%d)|$(date -d '1 day ago' +%Y-%m-%d)|$(date +%Y-%m-%d)" $APP_DIR/backend/logs/error.log | wc -l)
fi

# PM2 metrics
PM2_RESTARTS=0
if command -v pm2 >/dev/null 2>&1; then
    PM2_RESTARTS=$(pm2 jlist | jq -r '.[] | select(.name=="viticult-backend") | .restart_time' 2>/dev/null || echo "0")
fi

cat >> $REPORT_FILE << EOF
    <div class="metric">
        <strong>Application Errors (7 days):</strong> $ERROR_COUNT
    </div>
    <div class="metric">
        <strong>Application Restarts:</strong> $PM2_RESTARTS
    </div>
</div>
EOF

# Database Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>🗄️ Database Statistics</h3>
EOF

# MongoDB stats
if command -v mongo >/dev/null 2>&1; then
    DB_SIZE=$(mongo viticult-whisky --eval "printjson(db.stats())" --quiet | grep "dataSize" | cut -d: -f2 | cut -d, -f1 | tr -d ' ')
    if [ ! -z "$DB_SIZE" ]; then
        DB_SIZE_MB=$((DB_SIZE / 1024 / 1024))
    else
        DB_SIZE_MB="Unknown"
    fi
    
    # Count documents in key collections
    CONTACT_FORMS=$(mongo viticult-whisky --eval "db.contacts.count()" --quiet 2>/dev/null || echo "0")
    SELL_FORMS=$(mongo viticult-whisky --eval "db.sellwhiskies.count()" --quiet 2>/dev/null || echo "0")
    
else
    DB_SIZE_MB="MongoDB not accessible"
    CONTACT_FORMS="N/A"
    SELL_FORMS="N/A"
fi

cat >> $REPORT_FILE << EOF
    <div class="metric">
        <strong>Database Size:</strong> ${DB_SIZE_MB} MB
    </div>
    <div class="metric">
        <strong>Contact Forms:</strong> $CONTACT_FORMS
    </div>
    <div class="metric">
        <strong>Sell Whisky Forms:</strong> $SELL_FORMS
    </div>
</div>
EOF

# Backup Status Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>💾 Backup Status</h3>
EOF

# Check backup files
BACKUP_DIR="/var/backups/viticult-whisky/database"
RECENT_BACKUPS=0
BACKUP_SIZE="0"

if [ -d "$BACKUP_DIR" ]; then
    RECENT_BACKUPS=$(find $BACKUP_DIR -name "*.gz" -mtime -7 | wc -l)
    if [ $RECENT_BACKUPS -gt 0 ]; then
        BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
        LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.gz 2>/dev/null | head -1)
        LATEST_BACKUP_DATE=$(stat -c %y "$LATEST_BACKUP" 2>/dev/null | cut -d' ' -f1 || echo "Unknown")
    else
        LATEST_BACKUP_DATE="No recent backups"
    fi
else
    LATEST_BACKUP_DATE="Backup directory not found"
fi

cat >> $REPORT_FILE << EOF
    <div class="metric">
        <strong>Backups (7 days):</strong> $RECENT_BACKUPS
    </div>
    <div class="metric">
        <strong>Backup Storage:</strong> $BACKUP_SIZE
    </div>
    <div class="metric">
        <strong>Latest Backup:</strong> $LATEST_BACKUP_DATE
    </div>
</div>
EOF

# Log Analysis Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>📋 Log Analysis</h3>
    <table>
        <tr>
            <th>Log Type</th>
            <th>Size</th>
            <th>Last Modified</th>
            <th>Status</th>
        </tr>
EOF

# Analyze various log files
log_files=(
    "/var/log/viticult-whisky/error.log:Application Errors"
    "/var/log/viticult-whisky/access.log:Application Access"
    "/var/log/nginx/access.log:Nginx Access"
    "/var/log/nginx/error.log:Nginx Errors"
    "/var/log/mongodb/mongod.log:MongoDB"
)

for log_entry in "${log_files[@]}"; do
    log_file=$(echo $log_entry | cut -d: -f1)
    log_name=$(echo $log_entry | cut -d: -f2)
    
    if [ -f "$log_file" ]; then
        log_size=$(du -h "$log_file" | cut -f1)
        log_modified=$(stat -c %y "$log_file" | cut -d' ' -f1)
        
        # Determine status based on size
        size_bytes=$(stat -c%s "$log_file")
        if [ $size_bytes -gt 104857600 ]; then  # 100MB
            status="<span class='warning'>Large</span>"
        else
            status="<span class='success'>OK</span>"
        fi
    else
        log_size="N/A"
        log_modified="N/A"
        status="<span class='warning'>Missing</span>"
    fi
    
    cat >> $REPORT_FILE << EOF
        <tr>
            <td>$log_name</td>
            <td>$log_size</td>
            <td>$log_modified</td>
            <td>$status</td>
        </tr>
EOF
done

cat >> $REPORT_FILE << 'EOF'
    </table>
</div>
EOF

# Recommendations Section
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <h3>💡 Recommendations</h3>
    <ul>
EOF

# Generate recommendations based on metrics
if [ $ERROR_COUNT -gt 100 ]; then
    echo "        <li class='warning'>⚠️ High error count detected. Review application logs.</li>" >> $REPORT_FILE
fi

if [ $FAILED_LOGINS -gt 100 ]; then
    echo "        <li class='warning'>⚠️ High number of failed login attempts. Consider security measures.</li>" >> $REPORT_FILE
fi

if [ $SSL_DAYS_LEFT -lt 30 ]; then
    echo "        <li class='warning'>⚠️ SSL certificate expires soon. Plan renewal.</li>" >> $REPORT_FILE
fi

if [ $RECENT_BACKUPS -eq 0 ]; then
    echo "        <li class='danger'>❌ No recent backups found. Check backup system.</li>" >> $REPORT_FILE
fi

# Check disk space
DISK_USAGE_NUM=$(echo $DISK_USAGE | sed 's/%//')
if [ $DISK_USAGE_NUM -gt 80 ]; then
    echo "        <li class='warning'>⚠️ Disk usage is high ($DISK_USAGE). Consider cleanup.</li>" >> $REPORT_FILE
fi

cat >> $REPORT_FILE << 'EOF'
        <li class='success'>✅ Continue monitoring system performance</li>
        <li class='success'>✅ Maintain regular backup schedule</li>
        <li class='success'>✅ Keep security measures up to date</li>
    </ul>
</div>
EOF

# Close HTML report
cat >> $REPORT_FILE << 'EOF'
<div class="section">
    <p><small>This report was automatically generated by the Whisky Investment Platform monitoring system.</small></p>
</div>
</body>
</html>
EOF

echo "$(date): Weekly report generated: $REPORT_FILE"

# Create text summary for email (optional)
SUMMARY_FILE="$REPORT_DIR/weekly-summary-$TIMESTAMP.txt"
cat > $SUMMARY_FILE << EOF
Whisky Investment Platform - Weekly Summary
==========================================

System Health: $APP_STATUS
Server Uptime: $UPTIME
Memory Usage: $MEMORY_USAGE
Disk Usage: $DISK_USAGE

Security:
- Failed Logins: $FAILED_LOGINS
- SSL Status: $SSL_DAYS_LEFT days remaining

Application:
- Errors: $ERROR_COUNT
- Restarts: $PM2_RESTARTS

Database:
- Size: ${DB_SIZE_MB} MB
- Contact Forms: $CONTACT_FORMS
- Sell Forms: $SELL_FORMS

Backups: $RECENT_BACKUPS created this week

Full report: $REPORT_FILE
EOF

# Optional: Send email report
# mail -s "Weekly Report - Whisky Investment Platform" -a $REPORT_FILE admin@viticultwhisky.co.uk < $SUMMARY_FILE

echo "$(date): Weekly report completed"