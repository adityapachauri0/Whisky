# Authentication & Security Guide

## Overview

This document provides comprehensive information about the authentication and security implementation in the ViticultWhisky backend. The system implements industry-standard security practices with JWT authentication, account protection, and comprehensive security middleware.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [JWT Implementation](#jwt-implementation)
3. [Password Security](#password-security)
4. [Account Protection](#account-protection)
5. [Role-Based Access Control](#role-based-access-control)
6. [CSRF Protection](#csrf-protection)
7. [Rate Limiting](#rate-limiting)
8. [Security Middleware](#security-middleware)
9. [IP Address Tracking](#ip-address-tracking)
10. [Session Management](#session-management)
11. [Security Best Practices](#security-best-practices)

---

## Authentication Flow

### Admin Login Process

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    participant Logger

    Client->>Server: POST /api/admin/login
    Server->>Server: Validate input format
    Server->>Database: Find admin user by email
    Database-->>Server: Return user (with password)
    Server->>Server: Check account lock status
    Server->>Server: Verify password with bcrypt
    
    alt Password Valid
        Server->>Database: Reset login attempts
        Server->>Database: Update last login time
        Server->>Server: Generate JWT token
        Server->>Client: Set httpOnly cookie + success response
        Server->>Logger: Log successful login with IP
    else Password Invalid
        Server->>Database: Increment login attempts
        Server->>Database: Lock account if threshold reached
        Server->>Logger: Log failed attempt with IP
        Server->>Client: Return error response
    end
```

### Authentication Verification

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant JWT
    participant Database

    Client->>Middleware: API Request with cookie
    Middleware->>Middleware: Extract token from cookie/header
    Middleware->>JWT: Verify token signature
    JWT-->>Middleware: Token payload
    Middleware->>Database: Check user exists and active
    Database-->>Middleware: User data
    Middleware->>Middleware: Verify role permissions
    Middleware->>Client: Grant/Deny access
```

---

## JWT Implementation

### Token Structure

**File**: `controllers/admin.controller.js:26-37`

```javascript
const generateToken = (email) => {
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET not configured in environment variables');
    throw new Error('Authentication configuration error');
  }
  
  return jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
```

### Cookie Configuration

**File**: `controllers/admin.controller.js:119-127`

```javascript
// Set secure httpOnly cookie - PRODUCTION READY
res.cookie('authToken', token, {
  httpOnly: true,
  secure: false, // Allow both HTTP and HTTPS for flexibility
  sameSite: 'lax', // Permissive for cross-origin requests
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  domain: undefined, // Allow all domains
  path: '/api' // Set cookie for all API endpoints
});
```

### Token Verification

**File**: `controllers/admin.controller.js:177-231`

```javascript
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Check for token in httpOnly cookie first
    let token = req.cookies?.authToken;
    
    // Fallback to Authorization header for backward compatibility
    if (!token) {
      token = req.headers.authorization?.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    // Handle token expiration and invalid tokens
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    logger.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};
```

---

## Password Security

### Password Hashing

**File**: `models/User.js:98-109`

```javascript
// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12); // 12 salt rounds for security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

### Password Comparison

**File**: `models/User.js:111-114`

```javascript
// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### Password Complexity Requirements

**File**: `controllers/admin.controller.js:250-264`

```javascript
// Validate new password strength
if (newPassword.length < 8) {
  return res.status(400).json({
    success: false,
    message: 'New password must be at least 8 characters long'
  });
}

// Password complexity check
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
if (!passwordRegex.test(newPassword)) {
  return res.status(400).json({
    success: false,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  });
}
```

### Password Requirements

- **Minimum Length**: 8 characters
- **Uppercase**: At least one uppercase letter (A-Z)
- **Lowercase**: At least one lowercase letter (a-z)
- **Number**: At least one digit (0-9)
- **Special Character**: At least one special character (@$!%*?&)
- **Hashing**: bcrypt with 12 salt rounds

---

## Account Protection

### Failed Login Tracking

**File**: `models/User.js:116-135`

```javascript
// Method to handle failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5; // Maximum failed attempts
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours lockout
  
  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};
```

### Account Lock Check

**File**: `models/User.js:93-96`

```javascript
// Virtual property to check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});
```

### Login Security Implementation

**File**: `controllers/admin.controller.js:82-89`

```javascript
// Check if account is locked
if (adminUser.isLocked) {
  return res.status(423).json({
    success: false,
    message: 'Account is locked due to too many failed login attempts. Please try again later.'
  });
}
```

### Account Protection Features

- **Failed Attempt Tracking**: Counts consecutive failed login attempts
- **Account Lockout**: 5 failed attempts = 2-hour lockout
- **Automatic Reset**: Failed attempts reset on successful login
- **Lock Expiration**: Automatic unlock after lockout period
- **Status Code 423**: HTTP "Locked" status for locked accounts

---

## Role-Based Access Control

### User Roles

**File**: `models/User.js:32-36`

```javascript
role: {
  type: String,
  enum: ['user', 'investor', 'admin'],
  default: 'user'
}
```

### Role Verification

**File**: `middleware/auth.js:62-69`

```javascript
// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
```

### Admin Role Verification

**File**: `controllers/admin.controller.js:200-206`

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);

if (decoded.role !== 'admin') {
  return res.status(403).json({
    success: false,
    message: 'Access denied'
  });
}
```

### Permission Levels

1. **User**: Basic access, can submit forms
2. **Investor**: Enhanced access, investment features
3. **Admin**: Full access, all administrative functions

---

## CSRF Protection

### CSRF Token Generation

**File**: `routes/admin.routes.js:10-11`

```javascript
// Get CSRF token
router.get('/csrf-token', getCSRFToken);
```

### CSRF Validation

**File**: `routes/admin.routes.js:30`

```javascript
// Apply CSRF protection to state-changing operations
router.post('/change-password', validateCSRF, adminController.changePassword);
```

### CSRF Implementation

**File**: `middleware/csrf.js`

```javascript
const validateCSRF = (req, res, next) => {
  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session.csrfToken;
  
  if (!token || token !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }
  
  next();
};
```

### CSRF Protection Features

- **Token-based Protection**: Unique tokens per session
- **State-changing Operations**: Required for POST/PUT/DELETE
- **Header Validation**: `X-CSRF-Token` header requirement
- **Session Binding**: Tokens tied to user sessions

---

## Rate Limiting

### IP-based Rate Limiting

**File**: `middleware/rateLimiter.js`

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Login-specific Rate Limiting

**File**: `middleware/loginSecurity.js`

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});
```

### User-based Rate Limiting

**File**: `middleware/auth.js:112-150`

```javascript
// Rate limiting by user (more strict than IP-based)
exports.userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!req.user) return next();
    
    const key = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key).filter(timestamp => timestamp > windowStart);
    
    if (userRequests.length >= maxRequests) {
      return next(new AppError(`Too many requests. Please try again later.`, 429));
    }
    
    userRequests.push(now);
    requests.set(key, userRequests);
    
    next();
  };
};
```

### Rate Limiting Configuration

- **General API**: 100 requests per IP per 15 minutes
- **Login Endpoints**: 5 attempts per IP per 15 minutes
- **User-specific**: 100 requests per user per 15 minutes
- **Automatic Cleanup**: Memory cleanup for expired entries

---

## Security Middleware

### Security Headers

**File**: `server.js`

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));
```

### Input Sanitization

```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
```

### Security Middleware Stack

1. **Helmet**: Security headers
2. **CORS**: Cross-origin resource sharing
3. **Rate Limiting**: Request throttling
4. **Mongo Sanitize**: NoSQL injection prevention
5. **XSS Clean**: Cross-site scripting prevention
6. **HPP**: HTTP parameter pollution prevention

---

## IP Address Tracking

### IP Address Extraction

**File**: `utils/getClientIp.js`

```javascript
const getClientIp = (req) => {
  // Check for IP from load balancer or proxy
  let ip = req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.connection?.socket?.remoteAddress ||
           req.ip;

  // Handle comma-separated IPs (proxy chains)
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // Remove IPv6 prefix if present
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  return ip || 'unknown';
};
```

### IP Logging in Authentication

**File**: `controllers/admin.controller.js:117`

```javascript
// Log successful login with IP
logger.info(`Admin login successful: ${email} from IP: ${getClientIp(req)}`);
```

### IP Storage in Submissions

**File**: Contact and SellWhisky controllers

```javascript
// Store IP address with form submissions
const submission = new Contact({
  ...formData,
  ipAddress: getClientIp(req),
  userAgent: req.headers['user-agent']
});
```

### IP Tracking Features

- **Proxy Support**: Handles X-Forwarded-For, X-Real-IP headers
- **IPv6 Compatibility**: Handles IPv6 addresses and mappings
- **Audit Trail**: IP addresses logged for all security events
- **Form Submissions**: IP addresses stored with all submissions

---

## Session Management

### Session Configuration

**File**: `middleware/session.js`

```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
};
```

### Session Security Features

- **MongoDB Storage**: Sessions stored in database
- **Secure Cookies**: httpOnly and secure flags
- **Session Expiration**: 24-hour maximum lifetime
- **CSRF Integration**: Session-based CSRF tokens
- **Automatic Cleanup**: Expired session removal

---

## Security Best Practices

### Password Management

1. **Strong Hashing**: bcrypt with 12 salt rounds
2. **Complexity Requirements**: Enforced password strength
3. **No Plain Text**: Passwords never stored in plain text
4. **Secure Updates**: Password changes require current password

### Token Security

1. **httpOnly Cookies**: Prevents XSS token theft
2. **Short Expiration**: 24-hour token lifetime
3. **Secure Transmission**: HTTPS-only in production
4. **Signature Verification**: JWT signature validation

### Account Security

1. **Account Lockout**: Protection against brute force
2. **Login Tracking**: Failed attempt monitoring
3. **IP Logging**: Comprehensive audit trail
4. **Role Verification**: Strict permission checking

### API Security

1. **Rate Limiting**: Request throttling
2. **Input Validation**: Comprehensive data validation
3. **CSRF Protection**: State-changing operation protection
4. **Security Headers**: Comprehensive header configuration

### Data Protection

1. **Field Selection**: Sensitive data exclusion
2. **Sanitization**: Input cleaning and validation
3. **Encryption**: Sensitive data encryption at rest
4. **Audit Logging**: Comprehensive activity logging

---

## Environment Security

### Environment Variables

```bash
# Required Security Variables
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
SESSION_SECRET=your-session-secret-key-here-min-32-chars
CSRF_SECRET=your-csrf-secret-key-here-min-32-chars

# Admin Credentials (hashed)
ADMIN_EMAIL=admin@viticult.co.uk
ADMIN_PASSWORD_HASH=$2a$12$your.bcrypt.hashed.password.here

# Database (with authentication)
MONGODB_URI=mongodb://username:password@host:port/database

# Email Security
SMTP_USER=your-smtp-username
SMTP_PASS=your-app-specific-password

# Production Security
NODE_ENV=production
HTTPS_ONLY=true
TRUST_PROXY=true
```

### Secret Management

1. **Environment Variables**: Never commit secrets to code
2. **Strong Secrets**: Minimum 32-character random strings
3. **Regular Rotation**: Periodic secret updates
4. **Access Control**: Limited access to environment files
5. **Backup Security**: Encrypted backup of secrets

---

## Security Monitoring

### Login Monitoring

```javascript
// Successful login logging
logger.info(`Admin login successful: ${email} from IP: ${getClientIp(req)}`);

// Failed login logging
logger.warn(`Failed login attempt for ${email} from IP: ${getClientIp(req)}`);

// Account lockout logging
logger.error(`Account locked for ${email} after ${maxAttempts} failed attempts from IP: ${getClientIp(req)}`);
```

### Security Event Logging

- **Authentication Events**: Login success/failure
- **Authorization Events**: Permission denials
- **Rate Limiting**: Exceeded request limits
- **CSRF Violations**: Invalid token attempts
- **Suspicious Activity**: Multiple failed attempts

### Alert Thresholds

- **Failed Logins**: 3+ attempts from same IP
- **Account Lockouts**: Any account lockout event
- **Rate Limiting**: Exceeded limits
- **Invalid Tokens**: Multiple invalid token attempts

---

## Compliance and Standards

### OWASP Compliance

- **A01 - Broken Access Control**: Role-based permissions
- **A02 - Cryptographic Failures**: Strong encryption
- **A03 - Injection**: Input sanitization
- **A05 - Security Misconfiguration**: Secure defaults
- **A06 - Vulnerable Components**: Regular updates
- **A07 - Identification Failures**: Strong authentication
- **A09 - Security Logging Failures**: Comprehensive logging
- **A10 - Server-Side Request Forgery**: Input validation

### Security Standards

- **JWT Best Practices**: RFC 7519 compliance
- **Password Hashing**: OWASP recommendations
- **Session Management**: OWASP session guidelines
- **HTTPS Enforcement**: TLS 1.2+ requirement
- **Security Headers**: OWASP secure headers

---

## Troubleshooting

### Common Issues

**Account Locked**
```bash
# Check lock status in database
db.users.findOne({email: "admin@viticult.co.uk"}, {loginAttempts: 1, lockUntil: 1})

# Reset account lock
db.users.updateOne(
  {email: "admin@viticult.co.uk"},
  {$set: {loginAttempts: 0}, $unset: {lockUntil: 1}}
)
```

**Invalid JWT Token**
- Check JWT_SECRET environment variable
- Verify token expiration (24 hours)
- Check for httpOnly cookie presence
- Validate token format and signature

**CSRF Token Errors**
- Get CSRF token from `/api/admin/csrf-token`
- Include token in `X-CSRF-Token` header
- Ensure session persistence

**Rate Limiting**
- Wait for rate limit window to reset (15 minutes)
- Check IP address for proxy issues
- Verify rate limiting configuration

---

*Last Updated: January 2024*  
*Version: 1.0*  
*Authentication & Security Guide for ViticultWhisky Backend*