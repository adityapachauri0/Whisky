# VPS Deployment Security Checklist

## Pre-Deployment Requirements

### 🚨 CRITICAL - Must Complete Before Deployment

- [x] Remove hardcoded admin credentials from Login.tsx
- [x] Add .env to .gitignore
- [ ] Change default admin password (admin123) to a strong password
- [ ] Run `npm audit fix` to patch vulnerable dependencies
- [ ] Create production .env file with real values (not committed to git)
- [ ] Test authentication flow without demo credentials

### Environment Variables to Set on VPS

```bash
# Frontend (.env)
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_GOOGLE_MAPS_API_KEY=your-actual-google-maps-key
REACT_APP_STRIPE_PUBLIC_KEY=your-actual-stripe-key
REACT_APP_GA_TRACKING_ID=your-google-analytics-id

# Backend (.env)
PORT=5001
MONGODB_URI=mongodb://localhost:27017/viticult-whisky
JWT_SECRET=generate-strong-random-secret-here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=strong-password-here
```

## VPS Security Configuration

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install fail2ban for brute force protection
sudo apt install fail2ban -y

# Configure firewall
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw allow 5001/tcp # API (if needed externally)
sudo ufw enable
```

### 2. Nginx Security Headers
Add to your nginx config:
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com;" always;

# Hide nginx version
server_tokens off;

# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
```

### 3. MongoDB Security
```bash
# Enable authentication
mongo
> use admin
> db.createUser({
    user: "viticultAdmin",
    pwd: "strong-password-here",
    roles: [ { role: "root", db: "admin" } ]
  })

# Update MongoDB URI in backend .env
MONGODB_URI=mongodb://viticultAdmin:password@localhost:27017/viticult-whisky?authSource=admin
```

### 4. Process Management (PM2)
```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name whisky-api

# Save PM2 config
pm2 save
pm2 startup
```

### 5. SSL/HTTPS Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Security Monitoring

### 1. Log Monitoring
```bash
# Monitor auth attempts
sudo tail -f /var/log/auth.log

# Monitor nginx access
sudo tail -f /var/log/nginx/access.log

# Monitor API logs
pm2 logs whisky-api
```

### 2. Automated Security Updates
```bash
# Enable unattended upgrades
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Post-Deployment Verification

- [ ] Test login without demo credentials
- [ ] Verify HTTPS is working
- [ ] Check all environment variables are loaded
- [ ] Test email functionality
- [ ] Verify MongoDB authentication
- [ ] Check API rate limiting
- [ ] Test file upload restrictions
- [ ] Monitor error logs for issues
- [ ] Verify CORS is properly configured
- [ ] Test admin password change functionality

## Emergency Procedures

### If Compromised:
1. Immediately change all passwords
2. Revoke all JWT tokens (restart server)
3. Check access logs for unauthorized access
4. Update JWT_SECRET in .env
5. Review database for suspicious entries

### Backup Strategy:
```bash
# Daily MongoDB backup
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# Keep last 7 days
find /backup -type d -mtime +7 -exec rm -rf {} +
```

## Additional Recommendations

1. **Implement 2FA for admin accounts** (high priority)
2. **Set up monitoring alerts** (Datadog, New Relic, or similar)
3. **Regular security audits** (monthly)
4. **Penetration testing** (before major releases)
5. **Implement rate limiting** on all API endpoints
6. **Add request size limits** to prevent DoS
7. **Set up fail2ban rules** for API endpoints
8. **Implement session timeout** for admin panel

## Contact for Security Issues

- Security Email: security@yourdomain.com
- Emergency Contact: [Your Phone]
- Hosting Provider Support: [Provider Details]

---

**Remember:** Security is an ongoing process. Regularly update dependencies, monitor logs, and stay informed about new vulnerabilities.