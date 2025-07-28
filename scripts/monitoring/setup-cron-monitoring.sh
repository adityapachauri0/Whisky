#!/bin/bash

# 📅 Setup Automated Monitoring with Cron Jobs
# This will set up daily health checks and alerts

echo "📅 Setting up automated monitoring"
echo "================================="

# Create monitoring directory
sudo mkdir -p /var/log/whisky-monitoring
sudo chown $USER:$USER /var/log/whisky-monitoring

# Copy health check script to system location
sudo cp /Users/adityapachauri/Desktop/Whisky/scripts/monitoring/health-check.sh /usr/local/bin/whisky-health-check
sudo chmod +x /usr/local/bin/whisky-health-check

# Create alert script
cat > /tmp/whisky-alert.sh << 'EOF'
#!/bin/bash

# Email alert script for health check failures
ISSUES=$1
TIMESTAMP=$(date)

if [ $ISSUES -gt 0 ]; then
    # Log critical issues
    echo "[$TIMESTAMP] CRITICAL: $ISSUES issues detected" >> /var/log/whisky-monitoring/alerts.log
    
    # You can add email notifications here if needed:
    # echo "Whisky website has $ISSUES critical issues at $TIMESTAMP" | mail -s "Website Alert" admin@viticultwhisky.co.uk
    
    # For now, just create a flag file
    echo "$ISSUES issues at $TIMESTAMP" > /var/log/whisky-monitoring/ALERT
else
    # Remove alert flag if all is well
    rm -f /var/log/whisky-monitoring/ALERT
fi
EOF

sudo mv /tmp/whisky-alert.sh /usr/local/bin/whisky-alert
sudo chmod +x /usr/local/bin/whisky-alert

# Add cron jobs
echo "Setting up cron jobs..."

# Create cron job for daily health check at 6 AM
(crontab -l 2>/dev/null; echo "0 6 * * * /usr/local/bin/whisky-health-check >> /var/log/whisky-monitoring/daily-health.log 2>&1; /usr/local/bin/whisky-alert \$?") | crontab -

# Create cron job for hourly quick check (just admin login test)
(crontab -l 2>/dev/null; echo "0 * * * * curl -s -X POST http://localhost:5001/api/auth/admin/login -H 'Content-Type: application/json' -H 'Origin: https://viticultwhisky.co.uk' -d '{\"email\":\"admin@viticultwhisky.co.uk\",\"password\":\"admin123\"}' | grep -q 'success.*true' || echo \"[\$(date)] Admin login failed\" >> /var/log/whisky-monitoring/hourly-check.log") | crontab -

# Create cron job for weekly backup at 2 AM Sunday
(crontab -l 2>/dev/null; echo "0 2 * * 0 cd / && tar -czf /var/backups/whisky-weekly-\$(date +\%Y\%m\%d).tar.gz var/www/viticultwhisky/ && find /var/backups -name 'whisky-weekly-*' -mtime +30 -delete") | crontab -

echo "✅ Cron jobs added:"
echo "  - Daily health check at 6 AM"
echo "  - Hourly admin login test"  
echo "  - Weekly backup at 2 AM Sunday"
echo ""

# Create log rotation for monitoring logs
sudo tee /etc/logrotate.d/whisky-monitoring > /dev/null << EOF
/var/log/whisky-monitoring/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    sharedscripts
}
EOF

echo "✅ Log rotation configured"
echo ""

# Create monitoring dashboard script
cat > /usr/local/bin/whisky-status << 'EOF'
#!/bin/bash

echo "🏥 WHISKY WEBSITE STATUS DASHBOARD"
echo "================================="
echo ""

# Check if alert flag exists
if [ -f /var/log/whisky-monitoring/ALERT ]; then
    echo "🚨 ACTIVE ALERTS:"
    cat /var/log/whisky-monitoring/ALERT
    echo ""
fi

# Show last health check
echo "📊 Last Health Check:"
if [ -f /var/log/whisky-monitoring/daily-health.log ]; then
    tail -n 5 /var/log/whisky-monitoring/daily-health.log
else
    echo "No health check data yet"
fi
echo ""

# Show recent admin login issues
echo "🔐 Recent Admin Issues:"
if [ -f /var/log/whisky-monitoring/hourly-check.log ]; then
    tail -n 3 /var/log/whisky-monitoring/hourly-check.log 2>/dev/null || echo "No admin issues"
else
    echo "No admin check data yet"
fi
echo ""

# Show backend status
echo "🔧 Backend Status:"
pm2 list | grep viticult-backend || echo "Backend not found in PM2"
echo ""

# Show recent backups
echo "💾 Recent Backups:"
ls -la /var/backups/whisky-weekly-* 2>/dev/null | tail -3 || echo "No weekly backups yet"
echo ""

echo "Commands:"
echo "  whisky-health-check  - Run manual health check"
echo "  whisky-status        - Show this dashboard"
echo "  crontab -l           - Show scheduled jobs"
EOF

sudo chmod +x /usr/local/bin/whisky-status

echo "✅ Monitoring dashboard created: whisky-status"
echo ""

echo "🎉 MONITORING SETUP COMPLETE"
echo "==========================="
echo ""
echo "Your monitoring is now configured with:"
echo "  ✅ Daily health checks at 6 AM"
echo "  ✅ Hourly admin login tests"
echo "  ✅ Weekly backups at 2 AM Sunday"
echo "  ✅ Log rotation (30 days retention)"
echo "  ✅ Status dashboard"
echo ""
echo "Commands you can use:"
echo "  whisky-status         - View monitoring dashboard"
echo "  whisky-health-check   - Run manual health check"
echo "  crontab -l            - View all scheduled jobs"
echo ""
echo "Logs are stored in: /var/log/whisky-monitoring/"
echo ""