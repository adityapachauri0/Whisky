# Development Setup Guide

## Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: At least 5GB free space
- **Network**: Stable internet connection

### Required Software

#### Node.js and npm
```bash
# Install Node.js v16 or higher
# Download from: https://nodejs.org/

# Verify installation
node --version  # Should be v16.0.0 or higher
npm --version   # Should be v8.0.0 or higher
```

#### MongoDB
```bash
# Option 1: MongoDB Community Server (Local)
# Download from: https://www.mongodb.com/try/download/community

# Option 2: MongoDB Atlas (Cloud)
# Sign up at: https://www.mongodb.com/atlas

# Option 3: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Git
```bash
# Install Git
# Download from: https://git-scm.com/

# Verify installation
git --version
```

#### Code Editor (Recommended)
- **Visual Studio Code**: https://code.visualstudio.com/
- **Recommended Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code
  - GitLens
  - Prettier - Code formatter
  - ESLint

## Project Setup

### 1. Clone the Repository

```bash
# Clone the project
git clone https://github.com/your-org/viticultwhisky.git
cd viticultwhisky

# Or if downloading as ZIP
# Extract the ZIP file and navigate to the folder
```

### 2. Environment Configuration

#### Backend Environment Variables
Create `/backend/.env`:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/viticultwhisky
MONGODB_URI_PRODUCTION=mongodb://your-production-host/viticultwhisky

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random
JWT_EXPIRES_IN=7d
COOKIE_SECRET=another-secret-for-cookie-signing

# Email Configuration (Gmail example)
EMAIL_FROM=noreply@viticultwhisky.co.uk
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5001
NODE_ENV=development

# Admin User (for initial setup)
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD=secure-admin-password-change-this

# Security
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=session-secret-key

# Optional: External Services
GOOGLE_ANALYTICS_ID=your-ga-id
GTM_ID=your-gtm-id
```

#### Frontend Environment Variables
Create `/frontend/.env`:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api

# Google Services (Optional)
REACT_APP_GTM_ID=your-gtm-id
REACT_APP_GA_ID=your-ga-id

# Environment
REACT_APP_ENV=development

# Other configurations
GENERATE_SOURCEMAP=true
DISABLE_ESLINT_PLUGIN=false
```

### 3. Database Setup

#### Option A: Local MongoDB Setup

```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows:
net start MongoDB

# On Linux:
sudo systemctl start mongod

# Create database and collections
mongosh
use viticultwhisky

# Create initial collections (optional, will be created automatically)
db.createCollection("users")
db.createCollection("contacts")
db.createCollection("sellwhiskies")
db.createCollection("blogposts")
```

#### Option B: MongoDB Atlas Setup

1. **Create Account**: Sign up at https://www.mongodb.com/atlas
2. **Create Cluster**: Follow the setup wizard
3. **Create Database User**: Add a user with read/write permissions
4. **Whitelist IP**: Add your IP address or use 0.0.0.0/0 for development
5. **Get Connection String**: Copy the connection URI
6. **Update .env**: Replace MONGODB_URI with your Atlas connection string

```bash
# Example Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/viticultwhisky
```

### 4. Install Dependencies

#### Backend Dependencies
```bash
cd backend

# Install dependencies
npm install

# Verify installation
npm list
```

#### Frontend Dependencies
```bash
cd ../frontend

# Install dependencies
npm install

# Verify installation
npm list
```

## Development Workflow

### 1. Start the Development Servers

#### Terminal 1: Backend Server
```bash
cd backend

# Start in development mode (with auto-restart)
npm run dev

# Or start normally
npm start

# Backend will run on http://localhost:5001
```

#### Terminal 2: Frontend Server
```bash
cd frontend

# Start the React development server
npm start

# Frontend will run on http://localhost:3000
```

### 2. Verify Setup

#### Backend Health Check
```bash
# Test API endpoint
curl http://localhost:5001/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00Z",
  "version": "1.0.0",
  "environment": "development",
  "database": "connected"
}
```

#### Frontend Access
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Contact Form**: http://localhost:3000/contact

### 3. Database Initialization

#### Create Admin User
```bash
cd backend

# Run the admin setup script
npm run setup-admin

# Or manually create admin user
node scripts/setup-admin.js
```

#### Seed Test Data (Optional)
```bash
# Run database seeding script
npm run seed

# This will create sample:
# - Contact submissions
# - Blog posts
# - Test users
```

## Development Tools

### Available Scripts

#### Backend Scripts
```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production mode
npm test            # Run test suite
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Database
npm run seed        # Seed database with test data
npm run migrate     # Run database migrations
npm run setup-admin # Create admin user

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
```

#### Frontend Scripts
```bash
# Development
npm start           # Start development server
npm run build       # Build for production
npm test            # Run test suite
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier

# Analysis
npm run analyze     # Analyze bundle size
```

### Code Quality Tools

#### ESLint Configuration
Backend (`.eslintrc.js`):
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error'
  }
};
```

Frontend (inherited from Create React App with custom rules):
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Git Workflow

#### Branch Naming Convention
```bash
# Feature branches
feature/contact-form-validation
feature/admin-dashboard-export

# Bug fixes
bugfix/rate-limiting-issue
bugfix/memory-leak-3d-components

# Hotfixes
hotfix/security-vulnerability
hotfix/production-crash

# Releases
release/v1.0.0
release/v1.1.0
```

#### Commit Message Convention
```bash
# Format: type(scope): description

# Examples:
feat(contact): add email validation
fix(admin): resolve dashboard loading issue
docs(api): update endpoint documentation
style(frontend): format component files
refactor(auth): simplify JWT middleware
test(contact): add form validation tests
chore(deps): update dependencies
```

## Testing

### Backend Testing

#### Unit Tests
```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test auth.test.js

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Test Example
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  test('POST /auth/admin/login - valid credentials', async () => {
    const response = await request(app)
      .post('/auth/admin/login')
      .send({
        email: 'admin@viticultwhisky.co.uk',
        password: 'admin123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });
});
```

### Frontend Testing

#### Component Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

#### Test Example
```javascript
// src/components/__tests__/ContactForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from '../ContactForm';

test('renders contact form', () => {
  render(<ContactForm />);
  
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});
```

## Debugging

### Backend Debugging

#### VS Code Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeArgs": ["--nolazy"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Logging
```javascript
// Use Winston logger
const logger = require('./utils/logger');

// Log levels: error, warn, info, debug
logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', error);
```

### Frontend Debugging

#### React Developer Tools
1. Install React Developer Tools browser extension
2. Open browser dev tools
3. Use "Components" and "Profiler" tabs

#### Debug Hooks
```javascript
// Add debug logs to custom hooks
import { useEffect } from 'react';

const useDebugValue = (value, label) => {
  useEffect(() => {
    console.log(`${label}:`, value);
  }, [value, label]);
};
```

### Network Debugging

#### API Testing with cURL
```bash
# Test contact form submission
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+44 20 7946 0958",
    "message": "Test message"
  }'

# Test admin login
curl -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@viticultwhisky.co.uk",
    "password": "admin123"
  }'
```

#### Browser Network Tab
1. Open browser developer tools (F12)
2. Go to Network tab
3. Perform actions to see API requests
4. Check request/response details

## Common Issues and Solutions

### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5001
lsof -i :5001

# Kill process on port
kill -9 <PID>

# Or use different ports
PORT=3001 npm start  # Frontend
PORT=5002 npm start  # Backend
```

### Database Connection Issues
```bash
# Check MongoDB status
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongod

# Windows:
sc query MongoDB

# Test connection
mongosh mongodb://localhost:27017/viticultwhisky
```

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For permission issues on macOS/Linux
sudo chown -R $(whoami) ~/.npm
```

### Environment Variable Issues
```bash
# Check if .env file is loaded
node -e "require('dotenv').config(); console.log(process.env)"

# Verify specific variables
echo $NODE_ENV
echo $MONGODB_URI
```

## Production Deployment

### Build Process

#### Frontend Build
```bash
cd frontend

# Create production build
npm run build

# Serve build locally (testing)
npx serve -s build -l 3000
```

#### Backend Preparation
```bash
cd backend

# Install production dependencies only
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export PORT=5001

# Start application
npm start
```

### Environment Setup

#### Production Environment Variables
```bash
# Create production .env file
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://production-host:27017/viticultwhisky
JWT_SECRET=production-jwt-secret-very-long-and-secure
EMAIL_HOST=production-smtp-host
CORS_ORIGIN=https://viticultwhisky.co.uk
```

#### SSL Certificate Setup
```bash
# Using Let's Encrypt
sudo apt install certbot
sudo certbot certonly --webroot -w /var/www/html -d viticultwhisky.co.uk

# Configure Nginx with SSL
# See nginx configuration in deployment docs
```

### Process Management

#### PM2 Configuration
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Monitor application
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart viticultwhisky-backend
```

## Performance Optimization

### Development Performance

#### Frontend Optimization
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Optimize images
# Use WebP format
# Implement lazy loading
# Add responsive images
```

#### Backend Optimization
```bash
# Profile Node.js application
node --prof server.js

# Analyze profile
node --prof-process isolate-*.log > processed.txt

# Monitor memory usage
node --inspect server.js
```

### Database Optimization

#### MongoDB Indexing
```javascript
// Create indexes for better performance
db.contacts.createIndex({ "email": 1 })
db.contacts.createIndex({ "submittedAt": -1 })
db.sellwhiskies.createIndex({ "personalInfo.email": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

#### Query Optimization
```javascript
// Use lean queries for better performance
const contacts = await Contact.find().lean();

// Limit fields returned
const users = await User.find({}, 'email name role');

// Use pagination
const contacts = await Contact.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ submittedAt: -1 });
```

## Security Considerations

### Development Security

#### Secrets Management
```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use different secrets for each environment
# Development secrets can be simpler
# Production secrets must be cryptographically secure
```

#### Code Security
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Install security linting
npm install --save-dev eslint-plugin-security
```

### Production Security

#### Environment Hardening
- Use strong passwords and secrets
- Enable firewall with minimal open ports
- Regular security updates
- Monitor access logs
- Implement backup strategy

#### Application Security
- Input validation and sanitization
- Rate limiting
- HTTPS enforcement
- Security headers
- Error handling (no stack traces in production)

---

*Development Setup Guide Version: 1.0.0*
*Last Updated: January 2025*
*For support, contact: dev-support@viticultwhisky.co.uk*