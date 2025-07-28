# Production Deployment Checklist

## Pre-Deployment (Local)

- [x] Security audit completed
- [x] CORS properly configured
- [x] Rate limiting implemented
- [x] CSRF protection added
- [x] Security headers configured
- [x] Login security enhanced
- [x] Password properly hashed
- [x] Frontend API endpoints fixed

## Backend Security Configuration

- [ ] Generate new JWT_SECRET (64 characters):
  ```bash
  openssl rand -hex 32
  ```

- [ ] Generate security keys (32 characters each):
  ```bash
  # For ENCRYPTION_KEY
  openssl rand -hex 16
  
  # For COOKIE_SECRET
  openssl rand -hex 16
  
  # For SESSION_SECRET
  openssl rand -hex 16
  ```

- [ ] Update MongoDB connection string with authentication:
  ```
  mongodb://username:password@localhost:27017/viticult-whisky?authSource=admin
  ```

## VPS Deployment Steps

1. **Build Frontend Locally**
   ```bash
   cd frontend
   echo "REACT_APP_API_URL=https://viticultwhisky.co.uk/api" > .env.production
   npm run build
   ```

2. **Transfer Files to VPS**
   ```bash
   # Transfer backend
   scp -r backend/* root@31.97.57.193:/var/www/viticultwhisky/backend/
   
   # Transfer frontend build
   scp -r frontend/build/* root@31.97.57.193:/var/www/viticultwhisky/frontend/build/
   ```

3. **On VPS - Update Environment**
   ```bash
   cd /var/www/viticultwhisky/backend
   nano .env  # Update with production values
   ```

4. **Install Dependencies**
   ```bash
   npm install --production
   ```

5. **Restart Services**
   ```bash
   pm2 restart whisky-backend
   pm2 save
   nginx -s reload
   ```

## Post-Deployment Verification

- [ ] HTTPS is working: https://viticultwhisky.co.uk
- [ ] Security headers are present (check browser DevTools)
- [ ] Admin login works with new credentials
- [ ] Rate limiting is active (test multiple failed logins)
- [ ] API endpoints are secured
- [ ] No sensitive information in logs
- [ ] MongoDB authentication is enabled

## Security Reminders

1. **Never commit .env files**
2. **Use strong, unique passwords**
3. **Enable MongoDB authentication**
4. **Monitor logs regularly**
5. **Keep dependencies updated**
6. **Enable firewall rules**
7. **Set up automated backups**

## Emergency Rollback

If issues occur:
```bash
# On VPS
cd /var/www/viticultwhisky
git stash
git pull origin main
pm2 restart whisky-backend
```

## Admin Credentials

- Email: `admin@viticultwhisky.co.uk`
- Password: `AdminPass2024`
- **Important**: Change this password after first login!

## Support Commands

```bash
# View logs
pm2 logs whisky-backend

# Check status
pm2 status

# Monitor resources
pm2 monit

# Check nginx
nginx -t
systemctl status nginx
```