# Admin Login Guide

## Quick Start

### Default Credentials
- **Email**: `admin@viticultwhisky.co.uk`
- **Password**: `admin123`
- **Login URL**: `http://localhost:3000/admin/login`

## First Time Setup

### 1. Run the Setup Script
```bash
./setup-admin.sh
```

This will:
- Set up admin email and password
- Generate secure password hash
- Update the `.env` file automatically

### 2. Start the Servers
```bash
./start-servers.sh
```

### 3. Access Admin Panel
- Open browser to: `http://localhost:3000/admin/login`
- Enter your credentials
- Click "Sign in"

## Troubleshooting

### Login Failed?

1. **Check Environment File**
   ```bash
   cat backend/.env | grep ADMIN
   ```

2. **Reset Password**
   ```bash
   ./setup-admin.sh
   # Enter new credentials when prompted
   ```

3. **Restart Servers**
   ```bash
   # Kill existing processes
   pkill -f "nodemon"
   pkill -f "react-scripts"
   
   # Start fresh
   ./start-servers.sh
   ```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid credentials" | Run `./setup-admin.sh` to reset |
| Server not responding | Check if MongoDB is running: `brew services list` |
| Port already in use | Kill processes: `lsof -ti:3000,5001 | xargs kill -9` |
| Hash mismatch | The password is hashed, never edit `ADMIN_PASSWORD_HASH` manually |

## Security Best Practices

### For Development
- Default credentials are fine for local development
- Always use `.env` files (never commit them)

### For Production
1. **Change Default Password**
   - Use strong password (min 12 chars, mixed case, numbers, symbols)
   - Example: `MyS3cur3P@ssw0rd!2024`

2. **Use Environment Variables**
   ```bash
   export ADMIN_EMAIL="admin@yourdomain.com"
   export ADMIN_PASSWORD_HASH="$2a$12$..."
   ```

3. **Additional Security**
   - Enable HTTPS
   - Implement rate limiting
   - Add 2FA authentication
   - Regular password rotation
   - IP whitelisting for admin routes

## Password Requirements

### Development Mode
- Minimum 8 characters
- Any password accepted (for ease of testing)

### Production Mode
- Minimum 12 characters
- Must include:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)

## Quick Commands

```bash
# Setup admin
./setup-admin.sh

# Start servers
./start-servers.sh

# View current admin email
grep ADMIN_EMAIL backend/.env

# Check if servers are running
ps aux | grep -E "node|react" | grep -v grep

# View logs
tail -f backend.log    # Backend logs
tail -f frontend.log   # Frontend logs
```

## API Endpoints

- Login: `POST /api/admin/login`
- Change Password: `POST /api/auth/admin/change-password`
- Export Data: `GET /api/admin/export-submissions`

## Need Help?

1. Check the logs: `backend.log` and `frontend.log`
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Run the setup script again