# Emergency Access Guide - ViticultWhisky Admin

## 🚨 Quick Recovery Options

### Option 1: Password Recovery (Recommended)
```bash
# From your local machine
curl -X POST https://yourdomain.com/api/recovery/request-recovery \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk"}'
```
Check email for recovery link (valid for 1 hour)

### Option 2: SSH Server Reset
```bash
# SSH into server
ssh user@server

# Navigate to app directory
cd /path/to/viticultwhisky

# Run password reset
./reset-admin-password.sh
```

### Option 3: Emergency Master Key
```bash
# Use only if other methods fail
curl -X POST https://yourdomain.com/api/recovery/emergency-access \
  -H "Content-Type: application/json" \
  -d '{
    "masterKey": "your-master-key",
    "newPassword": "NewSecurePassword123!"
  }'
```

### Option 4: Decrypt Backup
```bash
# If you have the encrypted backup file
cat production-credentials-*.enc | \
  openssl enc -aes-256-cbc -d -pbkdf2 -base64

# Enter master password when prompted
```

## 📱 Recovery Methods Comparison

| Method | Speed | Security | Requirements |
|--------|-------|----------|--------------|
| Email Recovery | ⚡ Fast | 🔒 High | Email access |
| SSH Reset | ⚡ Fast | 🔒 High | Server access |
| Master Key | ⚡⚡ Instant | ⚠️ Medium | Master key |
| Decrypt Backup | ⚡ Fast | 🔒 High | Backup + password |

## 🔐 Setting Up Recovery Methods

### 1. Configure Email Recovery
Add to `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 2. Create Master Key
```bash
# Generate secure master key
openssl rand -hex 32

# Add to .env (production only)
MASTER_KEY=generated-key-here
```

### 3. Enable Recovery Routes
```javascript
// In server.js
const recoveryRoutes = require('./routes/recovery.routes');
app.use('/api/recovery', recoveryRoutes);
```

## 🛡️ Security Best Practices

### Do's ✅
- Store master key in secure vault (AWS Secrets, HashiCorp Vault)
- Use different master keys per environment
- Rotate master key quarterly
- Log all emergency access attempts
- Set up alerts for recovery attempts

### Don'ts ❌
- Share master key in plain text
- Use weak master keys
- Store backup passwords unencrypted
- Leave emergency endpoints unprotected
- Ignore failed access attempts

## 📞 Break Glass Procedure

### When Regular Access Fails:

1. **Try Standard Recovery First**
   - Email recovery link
   - SSH password reset
   
2. **Escalate to Emergency Access**
   - Use master key endpoint
   - Decrypt credential backup
   
3. **Last Resort**
   - Direct database update
   - Environment variable override
   - Contact system administrator

## 🚀 Quick Scripts

### Test Recovery Endpoint
```bash
#!/bin/bash
curl -I https://yourdomain.com/api/recovery/request-recovery
```

### Monitor Failed Logins
```bash
#!/bin/bash
tail -f backend.log | grep "Failed login"
```

### Verify Admin Access
```bash
#!/bin/bash
./verify-admin-access.sh
```

## 📊 Recovery Metrics

Track these for security:
- Recovery requests per day
- Failed recovery attempts
- Emergency access usage
- Time to recover access

## 🔄 Regular Maintenance

### Weekly
- Test recovery email delivery
- Check backup integrity

### Monthly  
- Verify master key works
- Review access logs
- Update recovery contacts

### Quarterly
- Rotate master key
- Update recovery procedures
- Security audit

## 📱 Contact Information

### Primary Support
- Email: support@viticultwhisky.com
- Phone: [Your Phone]

### Emergency Contacts
- DevOps Lead: [Contact]
- Security Team: [Contact]
- System Admin: [Contact]

## 🎯 Recovery Checklist

- [ ] Document the issue
- [ ] Try email recovery
- [ ] Check server access
- [ ] Use emergency methods
- [ ] Update passwords after recovery
- [ ] Review security logs
- [ ] Document resolution

## 💾 Backup Locations

### Encrypted Credentials
- Local: `./production-credentials-*.enc`
- Cloud: S3 bucket `viticult-backups`
- Vault: HashiCorp Vault path `/admin/creds`

### Recovery Keys
- Primary: AWS Secrets Manager
- Backup: Physical safe
- Emergency: Security team vault

---

⚠️ **Remember**: Always follow the principle of least privilege. Use the minimum access level needed to resolve the issue.