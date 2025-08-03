# Security Cleanup Instructions

## ⚠️ IMPORTANT: Files to Remove Before Committing

### Environment Files to Remove
The following files contain sensitive information and should NEVER be committed:

```bash
# Remove these files from git tracking (if already tracked)
git rm --cached backend/.env
git rm --cached backend/.env.production
git rm --cached frontend/.env
git rm --cached frontend/.env.production

# Delete local copies after backing up credentials
rm backend/.env.production
rm frontend/.env.production
```

### Files Safe to Keep
These example files are safe as they don't contain real credentials:
- `backend/.env.example`
- `backend/.env.production.example`
- `frontend/.env.example`

## 📋 Pre-Commit Checklist

Before committing to the repository:

1. **Check for sensitive data:**
   ```bash
   # Search for potential secrets
   grep -r "password\|secret\|key\|token" . --exclude-dir=node_modules --exclude-dir=.git
   ```

2. **Verify .gitignore is working:**
   ```bash
   git status --ignored
   ```

3. **Remove any test files with credentials:**
   ```bash
   rm test-secure-auth.js
   rm generate-secrets.js
   ```

## 🔒 Security Best Practices

1. **Never commit .env files** - Use .env.example templates instead
2. **Use environment variables** on your VPS for production
3. **Rotate secrets regularly** - Generate new ones for production
4. **Keep .gitignore updated** - Add new sensitive file patterns as needed

## 🚀 For VPS Deployment

On your VPS, create the .env files manually with production values:

```bash
# On VPS only
nano /path/to/backend/.env
# Add your production environment variables

nano /path/to/frontend/.env  
# Add your production frontend config
```

Remember: Production secrets should NEVER be in your git repository!