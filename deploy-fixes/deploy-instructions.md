# IP Fix Deployment Instructions

## Files in this directory:
1. `getClientIp.js` - Goes to `/var/www/viticultwhisky/backend/utils/`
2. `contact.controller.js` - Goes to `/var/www/viticultwhisky/backend/controllers/`

## Quick Deploy Commands:
```bash
# After downloading these files to server
cp getClientIp.js /var/www/viticultwhisky/backend/utils/
cp contact.controller.js /var/www/viticultwhisky/backend/controllers/
cd /var/www/viticultwhisky/backend
chown -R nodeapp:nodeapp .
pm2 restart whisky-backend
pm2 logs whisky-backend --lines 20
```

## Verify Success:
1. Submit contact form
2. Check admin dashboard
3. IP should now display