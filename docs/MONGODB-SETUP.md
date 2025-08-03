# MongoDB Security Setup for Production

## 1. Enable MongoDB Authentication

### On your VPS, connect to MongoDB:
```bash
mongo
```

### Create admin user:
```javascript
use admin
db.createUser({
  user: "whiskyAdmin",
  pwd: "GENERATE_STRONG_PASSWORD_HERE",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
```

### Create application user:
```javascript
use viticult-whisky
db.createUser({
  user: "whiskyApp",
  pwd: "GENERATE_STRONG_PASSWORD_HERE",
  roles: [
    { role: "readWrite", db: "viticult-whisky" }
  ]
})
```

## 2. Enable Authentication in MongoDB Config

### Edit MongoDB configuration:
```bash
sudo nano /etc/mongod.conf
```

### Add/Update security section:
```yaml
security:
  authorization: enabled
```

### Restart MongoDB:
```bash
sudo systemctl restart mongod
```

## 3. Update Connection String

### In your .env file on VPS:
```
MONGODB_URI=mongodb://whiskyApp:YOUR_PASSWORD@localhost:27017/viticult-whisky?authSource=viticult-whisky
```

## 4. Additional Security Measures

### Firewall Rules:
```bash
# Only allow MongoDB connections from localhost
sudo ufw deny 27017
sudo ufw allow from 127.0.0.1 to any port 27017
```

### Bind to localhost only in mongod.conf:
```yaml
net:
  bindIp: 127.0.0.1
  port: 27017
```

## 5. Backup Strategy

### Create backup script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://whiskyApp:PASSWORD@localhost:27017/viticult-whisky?authSource=viticult-whisky" --out="/backup/mongodb/$DATE"
```

### Add to crontab for daily backups:
```bash
0 3 * * * /path/to/backup-script.sh
```

## Security Checklist:
- [ ] Authentication enabled
- [ ] Strong passwords generated
- [ ] Application user has minimal permissions
- [ ] MongoDB bound to localhost only
- [ ] Firewall rules configured
- [ ] Connection string uses authentication
- [ ] Regular backups configured
- [ ] Monitoring enabled