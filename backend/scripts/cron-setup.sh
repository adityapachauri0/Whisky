#!/bin/bash

# Whisky Investment Platform - Automated Cron Jobs Setup
# This script sets up automated maintenance tasks for production deployment

PROJECT_ROOT="/var/www/viticult-whisky"
BACKUP_DIR="/var/backups/viticult-whisky"
LOG_DIR="/var/log/viticult-whisky"

echo "Setting up cron jobs for Whisky Investment Platform..."

# Create necessary directories
sudo mkdir -p $BACKUP_DIR/{database,files,logs}
sudo mkdir -p $LOG_DIR
sudo chown -R www-data:www-data $BACKUP_DIR
sudo chown -R www-data:www-data $LOG_DIR

# Create crontab for automated tasks
cat > /tmp/viticult-crontab << 'EOF'
# Whisky Investment Platform - Automated Maintenance
# Edit with: sudo crontab -e
# ALL TASKS RUN STARTING AT 6:00 AM WITH 15-MINUTE INTERVALS

# ============================================
# DAILY MAINTENANCE SEQUENCE (Starting 6:00 AM)
# ============================================

# 6:00 AM - Log rotation and cleanup
0 6 * * * /var/www/viticult-whisky/backend/scripts/log-rotation.sh >> /var/log/viticult-whisky/maintenance.log 2>&1

# 6:15 AM - Database backup
15 6 * * * /var/www/viticult-whisky/backend/scripts/db-backup.sh >> /var/log/viticult-whisky/backup.log 2>&1

# 6:30 AM - Temporary files cleanup
30 6 * * * /var/www/viticult-whisky/backend/scripts/cleanup-temp.sh >> /var/log/viticult-whisky/cleanup.log 2>&1

# 6:45 AM - Security updates check
45 6 * * * /var/www/viticult-whisky/backend/scripts/security-updates.sh >> /var/log/viticult-whisky/security.log 2>&1

# 7:00 AM - SSL certificate renewal check (daily check, renew if needed)
0 7 * * * /var/www/viticult-whisky/backend/scripts/ssl-renewal.sh >> /var/log/viticult-whisky/ssl.log 2>&1

# 7:15 AM - Database optimization (weekly on Sundays, otherwise skip)
15 7 * * 0 /var/www/viticult-whisky/backend/scripts/db-optimize.sh >> /var/log/viticult-whisky/optimization.log 2>&1

# 7:30 AM - Weekly report generation (Mondays only)
30 7 * * 1 /var/www/viticult-whisky/backend/scripts/weekly-report.sh >> /var/log/viticult-whisky/reports.log 2>&1

# 7:45 AM - Remove old backups (weekly cleanup on Sundays)
45 7 * * 0 find /var/backups/viticult-whisky -name "*.tar.gz" -mtime +30 -delete

# 8:00 AM - Remove old log files (weekly cleanup on Sundays)
0 8 * * 0 find /var/log/viticult-whisky -name "*.log" -mtime +30 -delete

# ============================================
# CONTINUOUS MONITORING (24/7)
# ============================================

# Health check every 5 minutes (critical for uptime)
*/5 * * * * /var/www/viticult-whisky/backend/scripts/health-check.sh >> /var/log/viticult-whisky/health.log 2>&1

# Application restart if needed (every 30 minutes)
*/30 * * * * /var/www/viticult-whisky/backend/scripts/app-monitor.sh >> /var/log/viticult-whisky/monitor.log 2>&1

EOF

echo "Cron jobs configuration created at /tmp/viticult-crontab"
echo ""
echo "To install these cron jobs on your server, run:"
echo "sudo crontab /tmp/viticult-crontab"
echo ""
echo "Created maintenance scripts:"
echo "- Database backup and cleanup"
echo "- Log rotation and management"  
echo "- Health monitoring and auto-restart"
echo "- Security updates and SSL renewal"
echo "- Performance optimization"
echo "- Automated reporting"
echo ""
echo "All scripts will be created in the next step..."