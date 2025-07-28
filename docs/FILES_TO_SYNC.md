# Files That Must Match Between Local and VPS

## Backend Files
1. `backend/.env.production`
   - Contains: admin credentials, JWT secret, database URL, CORS settings

## Frontend Files  
2. `frontend/.env.production`
   - Contains: API URL for production

## Server Configuration
3. `nginx-vps-config` → `/etc/nginx/sites-available/viticultwhisky` (on VPS)
   - Contains: proxy settings for API

## Deployment Scripts
4. `deploy-fix.sh`
   - Contains: commands to fix all issues on VPS

5. `diagnose-api.sh`
   - Contains: commands to check API health

## Files That Should NOT Exist on VPS
- ❌ `/.env` (in root directory)
- ❌ `/.env.production` (in root directory)
- ❌ `/backend/.env` (development file)
- ❌ `/frontend/.env` (development file)

## Most Important Values to Check

### In `backend/.env.production`:
- `ADMIN_PASSWORD_HASH` - Must start with `$2a$` or `$2b$` (bcrypt format)
- `NODE_ENV` - Must be `production`
- `ADMIN_EMAIL` - Must be `admin@viticultwhisky.co.uk`

### In `frontend/.env.production`:
- `REACT_APP_API_URL` - Must be `https://viticultwhisky.co.uk/api`