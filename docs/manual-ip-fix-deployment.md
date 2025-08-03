# Manual IP Address Fix Deployment

## Files to Deploy

### Backend Files:
1. `/backend/controllers/contact.controller.js` - Updated to use getClientIp helper
2. `/backend/utils/getClientIp.js` - New file that properly extracts client IP

### Frontend Files:
The frontend already has IP display code, but we need to ensure the backend sends it.

## Manual Deployment Steps

### 1. Connect to VPS
```bash
ssh root@31.97.57.193
```

### 2. Create the getClientIp utility
```bash
cd /var/www/viticultwhisky/backend/utils
nano getClientIp.js
```

Copy and paste this content:
```javascript
// Helper function to get the real client IP address
function getClientIp(req) {
  // Get IP from various headers (in order of preference)
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const ip = req.ip;
  const connectionRemoteAddress = req.connection?.remoteAddress;
  const socketRemoteAddress = req.socket?.remoteAddress;
  
  // Parse x-forwarded-for (can contain multiple IPs)
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    // Return the first (original client) IP
    return ips[0];
  }
  
  // Use x-real-ip if available
  if (realIp) {
    return realIp;
  }
  
  // Use req.ip (Express's best guess with trust proxy enabled)
  if (ip) {
    return ip;
  }
  
  // Fallback to connection addresses
  return connectionRemoteAddress || socketRemoteAddress || 'Unknown';
}

module.exports = getClientIp;
```

### 3. Update the contact controller
```bash
cd /var/www/viticultwhisky/backend/controllers
nano contact.controller.js
```

Add this at the top with other imports:
```javascript
const getClientIp = require('../utils/getClientIp');
```

Find the line that says `ipAddress: req.ip,` and change it to:
```javascript
ipAddress: getClientIp(req),
```

Also update the logging after contact creation:
```javascript
// Log IP address for debugging
logger.info(`Contact form submitted by ${contactData.email} from IP: ${contactData.ipAddress}`);
```

### 4. Check nginx configuration
```bash
nano /etc/nginx/sites-available/viticultwhisky
```

Ensure your /api/ location block includes these headers:
```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $server_name;
```

### 5. Set permissions and restart
```bash
chown -R nodeapp:nodeapp /var/www/viticultwhisky/backend
pm2 restart whisky-backend
pm2 save
nginx -t
systemctl reload nginx
```

### 6. Test the fix
1. Submit a new contact form at https://viticultwhisky.co.uk/contact
2. Login to admin at https://viticultwhisky.co.uk/admin/login
3. Click "View" on the new submission
4. The IP address should now be displayed in the contact details modal

### 7. Check logs
```bash
pm2 logs whisky-backend --lines 50
```

Look for lines like:
```
Contact form submitted by email@example.com from IP: 123.456.789.0
```

## Troubleshooting

If IP addresses still show as "Unknown":
1. Check PM2 logs for any errors
2. Verify nginx is properly forwarding headers
3. Test with: `curl -X GET http://localhost:5001/api/test-ip -H "X-Real-IP: 1.2.3.4"`