# Security-First Deployment Checklist

## Before Deployment:
- [ ] No hardcoded secrets in code
- [ ] No .env files in git repository  
- [ ] All API keys remain on server only
- [ ] Using HTTPS for all transfers
- [ ] No sensitive data in logs

## GitHub Security:
- [ ] Private repository only
- [ ] Deploy keys are read-only
- [ ] No credentials in commit history
- [ ] .gitignore excludes all sensitive files

## Server Security:
- [ ] Files owned by nodeapp:nodeapp (not root)
- [ ] Proper permissions (644 for files, 755 for dirs)
- [ ] PM2 running as nodeapp user
- [ ] No temporary upload endpoints left active
- [ ] Nginx security headers intact

## IP Collection Security:
- [ ] IP used for logging only, not authentication
- [ ] No IP-based access control
- [ ] Stored securely in database
- [ ] No PII exposure via IP

## Post-Deployment:
- [ ] Remove temporary files
- [ ] Check PM2 logs for errors
- [ ] Verify no sensitive data exposed
- [ ] Test security headers still working
- [ ] Confirm HTTPS redirect working

## What This Fix Does NOT Change:
- ✅ Authentication system
- ✅ CORS configuration  
- ✅ Security headers
- ✅ Database security
- ✅ API rate limiting
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection

## Commands That Maintain Security:
```bash
# Always use nodeapp user
chown -R nodeapp:nodeapp /var/www/viticultwhisky

# Check file permissions
find /var/www/viticultwhisky -type f -exec ls -la {} \; | grep -v nodeapp

# Verify security headers
curl -I https://viticultwhisky.co.uk

# Check for exposed secrets
grep -r "password\|secret\|key" /var/www/viticultwhisky --exclude-dir=node_modules
```