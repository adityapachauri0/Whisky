#!/bin/bash

# Security Monitoring Script for ViticultWhisky
# Run this regularly to check security status

echo "=== Security Status Check ==="
echo "Date: $(date)"
echo

# Check for failed login attempts
echo "1. Failed SSH Login Attempts (last 24h):"
grep "Failed password" /var/log/auth.log | grep "$(date -d '1 day ago' '+%b %d')" | wc -l

echo
echo "2. Nginx 4xx/5xx Errors (last hour):"
tail -n 1000 /var/log/nginx/viticult-access.log | grep -E "\" [45][0-9]{2} " | wc -l

echo
echo "3. MongoDB Authentication Failures:"
grep "authentication failed" /var/log/mongodb/mongod.log | tail -5

echo
echo "4. Disk Usage:"
df -h | grep -E "^/dev/"

echo
echo "5. Memory Usage:"
free -h

echo
echo "6. Active Connections:"
netstat -an | grep ESTABLISHED | wc -l

echo
echo "7. PM2 Process Status:"
pm2 status

echo
echo "8. Recent Admin Logins:"
grep "Admin login successful" /var/www/viticult-whisky/backend/logs/app.log | tail -5

echo
echo "9. SSL Certificate Expiry:"
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

echo
echo "10. Firewall Status:"
ufw status numbered

echo
echo "=== Security Recommendations ==="
echo "- Review any unusual patterns in logs"
echo "- Update packages if needed: apt update && apt upgrade"
echo "- Check for security updates: apt list --upgradable"
echo "- Rotate logs if needed"
echo "- Verify backups are running"