#!/bin/bash

# Security Updates Script
# Automated security updates and vulnerability checks

APP_NAME="viticult-whisky"
APP_DIR="/var/www/$APP_NAME"
LOG_FILE="/var/log/$APP_NAME/security.log"

echo "$(date): Starting security updates check" | tee -a $LOG_FILE

# Function to send notification
send_notification() {
    local subject=$1
    local message=$2
    echo "$(date): $message" | tee -a $LOG_FILE
    # Uncomment to enable email notifications
    # echo "$message" | mail -s "$subject" admin@viticultwhisky.co.uk
}

# Update package lists
echo "$(date): Updating package lists..." | tee -a $LOG_FILE

if command -v apt-get >/dev/null 2>&1; then
    # Ubuntu/Debian
    apt-get update
    
    # Check for security updates
    SECURITY_UPDATES=$(apt list --upgradable 2>/dev/null | grep -i security | wc -l)
    
    if [ $SECURITY_UPDATES -gt 0 ]; then
        echo "$(date): $SECURITY_UPDATES security updates available" | tee -a $LOG_FILE
        
        # Install security updates automatically
        DEBIAN_FRONTEND=noninteractive apt-get -y upgrade
        
        send_notification "Security Updates Applied" "$SECURITY_UPDATES security updates were automatically installed"
    else
        echo "$(date): No security updates available" | tee -a $LOG_FILE
    fi
    
elif command -v yum >/dev/null 2>&1; then
    # CentOS/RHEL
    yum check-update
    
    # Install security updates
    yum update -y --security
    
    send_notification "Security Updates Check" "Security updates check completed on CentOS/RHEL system"
fi

# Check Node.js dependencies for vulnerabilities
if [ -d "$APP_DIR/backend" ]; then
    echo "$(date): Checking backend dependencies for vulnerabilities..." | tee -a $LOG_FILE
    cd $APP_DIR/backend
    
    if command -v npm >/dev/null 2>&1; then
        # Run npm audit
        NPM_AUDIT=$(npm audit --audit-level=high 2>/dev/null)
        VULNERABILITIES=$(echo "$NPM_AUDIT" | grep "found" | head -1)
        
        if echo "$NPM_AUDIT" | grep -q "found.*vulnerabilities"; then
            echo "$(date): Vulnerabilities found in backend dependencies" | tee -a $LOG_FILE
            echo "$VULNERABILITIES" | tee -a $LOG_FILE
            
            # Attempt automatic fix
            npm audit fix --force
            
            # Check again after fix
            NPM_AUDIT_AFTER=$(npm audit --audit-level=high 2>/dev/null)
            if echo "$NPM_AUDIT_AFTER" | grep -q "found.*vulnerabilities"; then
                REMAINING_VULNS=$(echo "$NPM_AUDIT_AFTER" | grep "found" | head -1)
                send_notification "NPM Vulnerabilities Remain" "Some vulnerabilities could not be automatically fixed: $REMAINING_VULNS"
            else
                send_notification "NPM Vulnerabilities Fixed" "All vulnerabilities in backend dependencies have been automatically fixed"
            fi
        else
            echo "$(date): No high-severity vulnerabilities found in backend dependencies" | tee -a $LOG_FILE
        fi
    fi
fi

# Check frontend dependencies
if [ -d "$APP_DIR/frontend" ]; then
    echo "$(date): Checking frontend dependencies for vulnerabilities..." | tee -a $LOG_FILE
    cd $APP_DIR/frontend
    
    if command -v npm >/dev/null 2>&1; then
        NPM_AUDIT_FRONTEND=$(npm audit --audit-level=high 2>/dev/null)
        
        if echo "$NPM_AUDIT_FRONTEND" | grep -q "found.*vulnerabilities"; then
            echo "$(date): Vulnerabilities found in frontend dependencies" | tee -a $LOG_FILE
            
            # Attempt automatic fix
            npm audit fix --force
            
            send_notification "Frontend Dependencies" "Attempted to fix vulnerabilities in frontend dependencies"
        else
            echo "$(date): No high-severity vulnerabilities found in frontend dependencies" | tee -a $LOG_FILE
        fi
    fi
fi

# Check for failed login attempts
echo "$(date): Checking for security threats..." | tee -a $LOG_FILE

# Check auth.log for failed login attempts
if [ -f /var/log/auth.log ]; then
    FAILED_LOGINS=$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %d)" | wc -l)
    
    if [ $FAILED_LOGINS -gt 50 ]; then
        send_notification "Security Alert" "High number of failed login attempts today: $FAILED_LOGINS"
    fi
fi

# Check application logs for suspicious activity
if [ -f "$APP_DIR/backend/logs/error.log" ]; then
    SUSPICIOUS_REQUESTS=$(grep -E "(sql injection|script|eval|exec)" $APP_DIR/backend/logs/error.log | grep "$(date +%Y-%m-%d)" | wc -l)
    
    if [ $SUSPICIOUS_REQUESTS -gt 0 ]; then
        send_notification "Suspicious Activity" "$SUSPICIOUS_REQUESTS suspicious requests detected in application logs"
    fi
fi

# Check disk space for security logs
LOG_DISK_USAGE=$(df /var/log | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $LOG_DISK_USAGE -gt 90 ]; then
    send_notification "Log Storage Alert" "Log partition is ${LOG_DISK_USAGE}% full"
fi

# Update firewall rules if needed
if command -v ufw >/dev/null 2>&1; then
    echo "$(date): Checking firewall status..." | tee -a $LOG_FILE
    
    if ! ufw status | grep -q "Status: active"; then
        echo "$(date): WARNING: UFW firewall is not active" | tee -a $LOG_FILE
        send_notification "Firewall Alert" "UFW firewall is not active on the server"
    fi
fi

# Check SSL certificate security
if [ -f "/etc/letsencrypt/live/viticultwhisky.co.uk/cert.pem" ]; then
    echo "$(date): Checking SSL certificate security..." | tee -a $LOG_FILE
    
    # Check if certificate uses strong encryption
    SSL_KEY_SIZE=$(openssl x509 -in /etc/letsencrypt/live/viticultwhisky.co.uk/cert.pem -noout -text | grep "Public-Key:" | grep -o '[0-9]*')
    
    if [ $SSL_KEY_SIZE -lt 2048 ]; then
        send_notification "Weak SSL Certificate" "SSL certificate uses weak encryption: ${SSL_KEY_SIZE}-bit key"
    fi
fi

# Check for rootkits (if rkhunter is installed)
if command -v rkhunter >/dev/null 2>&1; then
    echo "$(date): Running rootkit check..." | tee -a $LOG_FILE
    rkhunter --update --quiet
    rkhunter --check --skip-keypress --quiet
    
    if [ $? -ne 0 ]; then
        send_notification "Rootkit Detection" "rkhunter detected potential security issues"
    fi
fi

# Check for malware (if clamav is installed)
if command -v clamscan >/dev/null 2>&1; then
    echo "$(date): Running malware scan on application directory..." | tee -a $LOG_FILE
    
    # Update virus definitions
    freshclam --quiet
    
    # Scan application directory
    MALWARE_SCAN=$(clamscan -r $APP_DIR --quiet --infected)
    
    if [ $? -ne 0 ]; then
        send_notification "Malware Detection" "ClamAV detected potential malware in application directory"
    fi
fi

# Restart services if critical updates were applied
if [ $SECURITY_UPDATES -gt 0 ]; then
    echo "$(date): Checking if services need restart after updates..." | tee -a $LOG_FILE
    
    # Check if nginx needs restart
    if command -v checkrestart >/dev/null 2>&1; then
        if checkrestart | grep -q nginx; then
            echo "$(date): Restarting nginx after security updates..." | tee -a $LOG_FILE
            systemctl restart nginx
        fi
    fi
    
    # Check if mongodb needs restart
    if command -v checkrestart >/dev/null 2>&1; then
        if checkrestart | grep -q mongod; then
            echo "$(date): Restarting MongoDB after security updates..." | tee -a $LOG_FILE
            systemctl restart mongod
        fi
    fi
fi

# Generate security report
REPORT_FILE="/tmp/security-report-$(date +%Y%m%d).txt"
cat > $REPORT_FILE << EOF
Security Update Report - $(date)
================================

System Updates:
- Security updates applied: $SECURITY_UPDATES

Application Security:
- Backend dependency scan completed
- Frontend dependency scan completed
- Suspicious requests: $SUSPICIOUS_REQUESTS

System Security:
- Failed login attempts: $FAILED_LOGINS
- Log disk usage: $LOG_DISK_USAGE%
- SSL certificate check completed

EOF

echo "$(date): Security update process completed" | tee -a $LOG_FILE
echo "$(date): Report saved to $REPORT_FILE" | tee -a $LOG_FILE