# 🤖 Whisky Investment Platform - Automation Guide

## Complete Self-Managed Server Setup

Your Whisky Investment Platform now includes comprehensive automation scripts that will keep your server running smoothly with minimal manual intervention.

## 🚀 Quick Setup (After Git Clone on VPS)

```bash
# 1. Deploy your application (follow DEPLOYMENT_GUIDE.md first)

# 2. Install automation scripts
sudo cp backend/scripts/* /var/www/viticult-whisky/backend/scripts/
sudo chmod +x /var/www/viticult-whisky/backend/scripts/*.sh

# 3. Install cron jobs for automation
sudo /var/www/viticult-whisky/backend/scripts/cron-setup.sh
sudo crontab /tmp/viticult-crontab

# 4. Create necessary directories
sudo mkdir -p /var/log/viticult-whisky/reports
sudo mkdir -p /var/backups/viticult-whisky
sudo chown -R www-data:www-data /var/log/viticult-whisky
sudo chown -R www-data:www-data /var/backups/viticult-whisky
```

## 📋 Automated Tasks Schedule

### 🔄 **Continuous Monitoring (24/7)**
- **Every 5 Minutes**: Health Check - Monitors application status and auto-restarts if needed
- **Every 30 Minutes**: Application Monitor - Advanced monitoring with failure thresholds

### 🌅 **Daily Morning Maintenance (Starting 6:00 AM)**

**6:00 AM** - Log Rotation
- Rotates large log files (>10MB)
- Compresses and archives old logs
- Prevents disk space issues

**6:15 AM** - Database Backup  
- Creates compressed MongoDB backups
- Maintains 30-day retention
- Automatic cleanup of old backups

**6:30 AM** - Cleanup Temporary Files
- Clears cache files, temporary uploads
- Frees up disk space
- Maintains system performance

**6:45 AM** - Security Updates
- Installs critical security patches
- Scans for vulnerabilities in dependencies
- Updates npm packages automatically

**7:00 AM** - SSL Certificate Check
- Daily verification of SSL certificate status
- Auto-renews if expiring within 30 days
- Updates nginx configuration

### 📅 **Weekly Tasks**

**7:15 AM (Sundays)** - Database Optimization
- Runs MongoDB optimization
- Compacts collections
- Updates statistics

**7:30 AM (Mondays)** - Weekly Report
- System health summary
- Security status
- Performance metrics
- Backup status
- Automated recommendations

**7:45 AM (Sundays)** - Backup Cleanup
- Remove old backups (older than 30 days)
- Manage storage space

**8:00 AM (Sundays)** - Log Cleanup
- Remove old log files (older than 30 days)
- Maintain log storage

## 🛠️ Available Scripts

### Core Monitoring
- `health-check.sh` - Basic health monitoring
- `app-monitor.sh` - Advanced application monitoring  
- `log-rotation.sh` - Log management and rotation

### Maintenance
- `cleanup-temp.sh` - Temporary file cleanup
- `db-backup.sh` - Database backup automation
- `db-cleanup.sh` - Database maintenance
- `db-optimize.sh` - Database optimization

### Security
- `security-updates.sh` - Automated security patching
- `ssl-renewal.sh` - SSL certificate management
- `permissions-check.sh` - File permission auditing

### Reporting
- `weekly-report.sh` - Comprehensive weekly reports
- `monthly-report.sh` - Monthly analytics and trends

## 🔧 Manual Script Execution

You can run any script manually if needed:

```bash
# Run health check
sudo /var/www/viticult-whisky/backend/scripts/health-check.sh

# Force database backup
sudo /var/www/viticult-whisky/backend/scripts/db-backup.sh

# Generate weekly report
sudo /var/www/viticult-whisky/backend/scripts/weekly-report.sh

# Clean temporary files
sudo /var/www/viticult-whisky/backend/scripts/cleanup-temp.sh

# Check for security updates
sudo /var/www/viticult-whisky/backend/scripts/security-updates.sh
```

## 📧 Email Notifications (Optional)

To enable email notifications, uncomment the mail commands in the scripts and configure:

```bash
# Install mail utilities
sudo apt-get install mailutils

# Configure email settings
sudo dpkg-reconfigure postfix

# Test email functionality
echo "Test message" | mail -s "Test Subject" admin@viticultwhisky.co.uk
```

## 📊 Monitoring Dashboard

The weekly reports generate HTML dashboards available at:
- `/var/log/viticult-whisky/reports/weekly-report-YYYYMMDD.html`

You can serve these through nginx for web access:

```nginx
location /reports {
    alias /var/log/viticult-whisky/reports;
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

## 🚨 Alert Thresholds

### Critical Alerts (Immediate Action)
- Application down > 5 minutes
- Database connection failed
- Disk usage > 90%
- SSL certificate expires < 7 days
- Memory usage > 95%

### Warning Alerts (Monitor)
- High error rate (>100 errors/week)
- Failed login attempts (>50/day)
- Disk usage > 80%
- SSL certificate expires < 30 days
- Memory usage > 80%

## 📝 Log Locations

All automation logs are stored in:
- `/var/log/viticult-whisky/backup.log` - Backup operations
- `/var/log/viticult-whisky/health.log` - Health checks
- `/var/log/viticult-whisky/monitor.log` - Application monitoring
- `/var/log/viticult-whisky/security.log` - Security updates
- `/var/log/viticult-whisky/maintenance.log` - General maintenance
- `/var/log/viticult-whisky/reports/` - Weekly/monthly reports

## 🔄 Customization

### Adjust Monitoring Frequency
Edit crontab to change task frequency:
```bash
sudo crontab -e
```

### Modify Alert Thresholds
Edit the scripts to adjust warning/critical thresholds:
```bash
sudo nano /var/www/viticult-whisky/backend/scripts/app-monitor.sh
```

### Add Custom Tasks
Create new scripts in the scripts directory and add to crontab.

## 🎯 Benefits

✅ **Zero Downtime** - Automatic restart of failed services  
✅ **Data Protection** - Daily automated backups with retention  
✅ **Security** - Automatic security updates and monitoring  
✅ **Performance** - Proactive cleanup and optimization  
✅ **Visibility** - Comprehensive reporting and alerting  
✅ **Cost Effective** - Reduces need for manual server management  
✅ **Peace of Mind** - 24/7 automated monitoring

## 🆘 Emergency Procedures

### If All Scripts Fail
```bash
# Check cron service
sudo systemctl status cron

# Restart cron if needed
sudo systemctl restart cron

# Verify crontab entries
sudo crontab -l

# Check script permissions
ls -la /var/www/viticult-whisky/backend/scripts/
```

### Manual Recovery
```bash
# Restart application manually
cd /var/www/viticult-whisky/backend
pm2 restart all

# Check application status
pm2 status
pm2 logs

# Restart system services
sudo systemctl restart nginx
sudo systemctl restart mongod
```

## 📞 Support

Your server is now **fully self-managed**! The automation handles:
- Application monitoring and restart
- Database backups and maintenance  
- Security updates and patches
- Performance optimization
- Comprehensive reporting

For any issues, check the logs in `/var/log/viticult-whisky/` first.

---

*Your Whisky Investment Platform is now enterprise-grade with complete automation! 🥃🚀*