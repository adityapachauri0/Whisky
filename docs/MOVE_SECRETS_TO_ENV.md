# Moving Secrets to Environment Variables - Security Fix

## Current Issues Found

1. **Hardcoded admin password in development.js**:
   - Line 44: `password: process.env.ADMIN_PASSWORD || 'admin123'`
   
2. **Hardcoded secrets in development.js**:
   - Line 14: `jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production'`
   - Line 15: `sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-change-in-production'`
   - Line 36: `keyId: process.env.RAZORPAY_KEY_ID || 'test_key_id'`
   - Line 37: `keySecret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'`

3. **Default password in setup scripts**:
   - setup-admin.sh: Line 29: `DEFAULT_PASSWORD="admin123"`

## Solution Steps

### Step 1: Update backend/config/development.js

Replace hardcoded defaults with environment variable requirements:

```javascript
// Change line 44 from:
password: process.env.ADMIN_PASSWORD || 'admin123'
// To:
password: process.env.ADMIN_PASSWORD // No default

// Change line 14 from:
jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production'
// To:
jwtSecret: process.env.JWT_SECRET // Required

// Change line 15 from:
sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-change-in-production'
// To:
sessionSecret: process.env.SESSION_SECRET // Required
```

### Step 2: Create .env validation

Update backend/utils/validateEnv.js to ensure these variables exist:

```javascript
const required = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD_HASH'
];
```

### Step 3: Update setup-admin.sh

Remove the default password suggestion:

```bash
# Change line 29 from:
DEFAULT_PASSWORD="admin123"
# To:
DEFAULT_PASSWORD="" # No default for security

# Add warning if no password provided
if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ Password is required for security"
    exit 1
fi
```

### Step 4: Update local .env files

Ensure all .env files have proper secrets:

```bash
# backend/.env
JWT_SECRET=your-secure-jwt-secret-here
SESSION_SECRET=your-secure-session-secret-here
CSRF_SECRET=your-secure-csrf-secret-here
ENCRYPTION_KEY=your-32-character-encryption-key
```

### Step 5: Generate secure secrets

Create a helper script to generate secure secrets:

```bash
#!/bin/bash
# generate-secure-secrets.sh

echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "SESSION_SECRET=$(openssl rand -hex 32)"
echo "CSRF_SECRET=$(openssl rand -hex 32)"
echo "ENCRYPTION_KEY=$(openssl rand -hex 16)"
```

## Benefits

1. No hardcoded secrets in code
2. Forces proper configuration in all environments
3. Prevents accidental commits of secrets
4. Improves security score to 8/10

## Important Note

**Your admin password remains "admin123"** - we're only removing hardcoded defaults from the code, not changing your actual password.