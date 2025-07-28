# MongoDB Authentication Setup Guide

## Overview
This guide will help you enable authentication on MongoDB without changing your admin login password (admin123).

## Prerequisites
- SSH access to VPS (root@31.97.57.193)
- MongoDB already installed and running

## Step 1: Create MongoDB Admin User

1. SSH into your VPS:
```bash
ssh root@31.97.57.193
```

2. Connect to MongoDB:
```bash
mongosh
```

3. Switch to admin database:
```javascript
use admin
```

4. Create admin user:
```javascript
db.createUser({
  user: "whiskyAdmin",
  pwd: "MongoSecurePass2024!",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" }
  ]
})
```

5. Create application user for whisky database:
```javascript
use whiskey-investment

db.createUser({
  user: "whiskyApp",
  pwd: "WhiskyAppPass2024!",
  roles: [
    { role: "readWrite", db: "whiskey-investment" }
  ]
})
```

6. Exit MongoDB:
```javascript
exit
```

## Step 2: Enable MongoDB Authentication

1. Edit MongoDB config:
```bash
nano /etc/mongod.conf
```

2. Add/modify security section:
```yaml
security:
  authorization: enabled
```

3. Restart MongoDB:
```bash
systemctl restart mongod
```

## Step 3: Update Backend Connection String

1. Update production .env file:
```bash
cd /var/www/viticultwhisky/backend
nano .env
```

2. Change MONGODB_URI:
```
# FROM:
MONGODB_URI=mongodb://localhost:27017/whiskey-investment

# TO:
MONGODB_URI=mongodb://whiskyApp:WhiskyAppPass2024!@localhost:27017/whiskey-investment?authSource=whiskey-investment
```

3. Restart backend:
```bash
pm2 restart backend
pm2 logs backend
```

## Step 4: Test Authentication

1. Test MongoDB connection:
```bash
mongosh "mongodb://whiskyApp:WhiskyAppPass2024!@localhost:27017/whiskey-investment?authSource=whiskey-investment"
```

2. Test backend API:
```bash
curl http://localhost:5001/api/health
```

3. Test admin login (password remains admin123):
```bash
curl -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'
```

## Important Notes

- **Your admin login password remains "admin123"** - MongoDB auth is separate
- MongoDB passwords are for database access only
- Keep these MongoDB passwords secure and different from your admin login
- Consider using environment variables for MongoDB credentials

## Rollback (if needed)

1. Disable auth in /etc/mongod.conf:
```yaml
#security:
#  authorization: enabled
```

2. Restart MongoDB:
```bash
systemctl restart mongod
```

3. Revert connection string in .env

## Security Benefits
- Prevents unauthorized database access
- Adds authentication layer to MongoDB
- Improves overall security score
- Your login password stays the same!