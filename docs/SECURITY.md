# Security Configuration Guide

## Critical Security Checklist for Production Deployment

### 1. Environment Variables
- [ ] Generate strong random values for:
  - `JWT_SECRET` (64 characters)
  - `ENCRYPTION_KEY` (32 characters)
  - `COOKIE_SECRET` (32 characters)
  - `SESSION_SECRET` (32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Update `ALLOWED_ORIGINS` with production domains only
- [ ] Use strong admin password and update `ADMIN_PASSWORD_HASH`
- [ ] Configure MongoDB with authentication

### 2. HTTPS Configuration
- [ ] SSL certificate installed and configured
- [ ] HSTS enabled with preload
- [ ] All cookies marked as Secure
- [ ] HTTP to HTTPS redirect configured

### 3. Database Security
- [ ] MongoDB authentication enabled
- [ ] Database user with minimal required permissions
- [ ] Connection string includes authentication
- [ ] Regular automated backups configured

### 4. Application Security
- [ ] CORS properly configured for production domain
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Security headers enabled via Helmet
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive information

### 5. Infrastructure Security
- [ ] Firewall configured (only necessary ports open)
- [ ] SSH key-based authentication only
- [ ] Fail2ban or similar intrusion prevention
- [ ] Regular security updates scheduled
- [ ] Monitoring and alerting configured

### 6. Deployment Security
- [ ] Remove all development/test files
- [ ] Disable directory listing
- [ ] Set proper file permissions
- [ ] Configure log rotation
- [ ] Implement backup strategy

## Security Headers Configured

- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: [configured]

## Rate Limiting

- Global: 60 requests per 15 minutes (production)
- Authentication: 3 failed attempts per 15 minutes
- Progressive lockout after 5 failed login attempts

## CSRF Protection

- Single-use tokens for admin operations
- Token expiration: 1 hour
- Required for all state-changing operations

## Login Security

- Account lockout after 5 failed attempts
- Progressive delay increases with attempts
- IP-based tracking
- Detailed logging of authentication events

## Monitoring

Configure alerts for:
- Multiple failed login attempts
- Rate limit violations
- CSRF token failures
- Unexpected errors
- Database connection issues

## Regular Security Tasks

- [ ] Weekly: Review security logs
- [ ] Monthly: Update dependencies (`npm audit`)
- [ ] Quarterly: Security assessment
- [ ] Annually: Penetration testing

## Incident Response

1. Detect: Monitor logs and alerts
2. Contain: Isolate affected systems
3. Investigate: Determine scope and impact
4. Remediate: Fix vulnerabilities
5. Document: Record incident details
6. Review: Update security measures

## Contact

Security issues should be reported to: security@viticultwhisky.co.uk