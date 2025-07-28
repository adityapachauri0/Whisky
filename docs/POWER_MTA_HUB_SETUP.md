# Power MTA Hub - Multi-Tenant Email Marketing Platform

## Project Overview
A MERN stack multi-tenant email marketing platform that allows multiple businesses to manage their email campaigns independently. Each business has their own login, domain configuration, and sending capabilities using Amazon SES.

## Project Location
- **VPS Path**: `/power-mta-hub/`
- **Backend Port**: 5002
- **Frontend Port**: 3001 (planned)
- **MongoDB**: `mongodb://localhost:27017/power-mta-hub`

## Completed Setup

### 1. Backend Structure Created
```
/power-mta-hub/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── models/
│   │   ├── Business.js
│   │   ├── User.js
│   │   ├── EmailCampaign.js
│   │   └── EmailTemplate.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   └── auth.js
│   └── utils/
│       └── jwt.js
```

### 2. Dependencies Installed
```json
{
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.4.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.4.5",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.3.0",
    "express-validator": "^7.1.0",
    "nodemailer": "^6.9.13",
    "@aws-sdk/client-ses": "^3.596.0"
  }
}
```

### 3. Environment Configuration (.env)
```
PORT=5002
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/power-mta-hub
JWT_SECRET=power-mta-hub-jwt-secret-change-in-production
JWT_EXPIRES_IN=7d
MASTER_SES_ACCESS_KEY=your-master-aws-access-key
MASTER_SES_SECRET_KEY=your-master-aws-secret-key
```

### 4. Database Models

#### Business Model (models/Business.js)
- Multi-tenant business management
- SES configuration per business
- Subscription plans (free, basic, pro, enterprise)
- Sending domains and limits

#### User Model (models/User.js)
- Business association
- Role-based access (super_admin, business_admin, business_user)
- Password hashing with bcrypt
- Permission management

#### EmailCampaign Model (models/EmailCampaign.js)
- Campaign tracking with recipient-level status
- Stats aggregation (sent, opened, clicked, bounced)
- Scheduling options
- Business association

#### EmailTemplate Model (models/EmailTemplate.js)
- Reusable templates with variables
- HTML and text content
- Category and tags
- Usage tracking

### 5. Authentication System

#### JWT Utility (utils/jwt.js)
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
```

#### Auth Middleware (middleware/auth.js)
- Token validation
- User authentication
- Business context injection
- Role-based access control

#### Auth Routes (routes/auth.js)
- POST /api/auth/register
- POST /api/auth/login
- Started implementation, needs completion

### 6. Server Configuration
- Express 4.x (downgraded from 5.x for compatibility)
- Security middleware (helmet, cors, rate limiting)
- MongoDB connection
- PM2 process management

### 7. PM2 Setup
```bash
pm2 start server.js --name power-mta-backend
pm2 save
pm2 startup
```

## Pending Tasks

### 1. Complete Authentication Routes
Need to add to server.js after "// API Routes (to be added)":
```javascript
// API Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

Then implement full register/login functionality in routes/auth.js.

### 2. Business Management Routes
- Create business
- Update business settings
- Manage SES configurations
- View business stats

### 3. Email Campaign Routes
- Create campaigns
- Schedule campaigns
- Track campaign stats
- Manage recipients

### 4. Frontend Development
- React app on port 3001
- Business dashboard
- Campaign builder
- Template editor
- Analytics dashboard

### 5. Amazon SES Integration
- Verify sending domains
- Configure SES per business
- Handle bounces and complaints
- Track email events

### 6. API Client SDKs
- Create SDK for integration with other projects
- Authentication flow
- Campaign API
- Webhook support

## Architecture Decisions

### Multi-Tenancy
- Each business has isolated data
- Shared infrastructure, separate configurations
- Business-level API keys
- Usage tracking per business

### Security
- JWT authentication
- Role-based access control
- Rate limiting per business
- Input validation
- CORS configuration

### Scalability
- Modular architecture
- Queue-based email sending
- Caching layer (Redis planned)
- Horizontal scaling ready

## Integration with Existing Projects
The Power MTA Hub will serve as a centralized email service for all your projects:
1. Whisky Project (port 5001)
2. Other 3 existing projects
3. Future projects

Each project will:
- Get its own business account
- Have dedicated sending domains
- Track campaigns independently
- Access via API or dashboard

## Next Steps to Continue

1. SSH to VPS: `ssh root@31.97.57.193`
2. Navigate to project: `cd /power-mta-hub/backend`
3. Edit server.js to add auth routes:
   ```bash
   nano server.js
   # Add the auth routes after "// API Routes (to be added)"
   ```
4. Complete auth.js implementation
5. Test endpoints:
   ```bash
   curl http://localhost:5002/api/auth/login
   curl http://localhost:5002/api/auth/register
   ```

## Testing Commands
```bash
# Check if server is running
pm2 status

# View logs
pm2 logs power-mta-backend

# Test health endpoint
curl http://localhost:5002/api/health

# Restart server
pm2 restart power-mta-backend
```

## Important Notes
- Fixed Express 5.x compatibility issue by downgrading to 4.x
- Server running on port 5002 to avoid conflict with Whisky (5001)
- MongoDB database: power-mta-hub
- PM2 process name: power-mta-backend

## Complete Code Files

### package.json
```json
{
  "name": "power-mta-backend",
  "version": "1.0.0",
  "description": "Multi-tenant email marketing platform backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.4.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.4.5",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.3.0",
    "express-validator": "^7.1.0",
    "nodemailer": "^6.9.13",
    "@aws-sdk/client-ses": "^3.596.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.2"
  }
}
```

### server.js (INCOMPLETE - needs auth routes added)
```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Power MTA Hub',
    timestamp: new Date().toISOString()
  });
});

// API Routes (to be added)
// TODO: Add these lines:
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Power MTA Hub backend running on port ${PORT}`);
});
```

### models/Business.js
```javascript
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    emailsPerMonth: {
      type: Number,
      default: 1000
    },
    emailsSentThisMonth: {
      type: Number,
      default: 0
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    nextBillingDate: Date
  },
  sesConfiguration: {
    accessKeyId: String,
    secretAccessKey: String,
    region: {
      type: String,
      default: 'us-east-1'
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  sendingDomains: [{
    domain: String,
    verified: {
      type: Boolean,
      default: false
    },
    dkimTokens: [String],
    verificationToken: String
  }],
  settings: {
    defaultFromEmail: String,
    defaultFromName: String,
    replyToEmail: String,
    webhookUrl: String,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  apiKeys: [{
    key: String,
    name: String,
    permissions: [String],
    lastUsed: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'suspended', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Reset monthly email count
businessSchema.methods.resetMonthlyQuota = function() {
  this.subscription.emailsSentThisMonth = 0;
  return this.save();
};

// Check if business can send emails
businessSchema.methods.canSendEmails = function(count = 1) {
  return this.status === 'active' &&
         this.subscription.emailsSentThisMonth + count <= this.subscription.emailsPerMonth;
};

module.exports = mongoose.model('Business', businessSchema);
```

### models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: function() {
      return this.role !== 'super_admin';
    }
  },
  role: {
    type: String,
    enum: ['super_admin', 'business_admin', 'business_user'],
    default: 'business_user'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_campaigns',
      'manage_templates',
      'manage_settings',
      'view_analytics',
      'send_emails'
    ]
  }],
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.role === 'super_admin' || this.permissions.includes(permission);
};

module.exports = mongoose.model('User', userSchema);
```

### models/EmailCampaign.js
```javascript
const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  fromEmail: {
    type: String,
    required: true
  },
  fromName: String,
  replyTo: String,
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailTemplate'
  },
  content: {
    html: String,
    text: String
  },
  recipients: [{
    email: {
      type: String,
      required: true
    },
    name: String,
    variables: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['pending', 'sent', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed'],
      default: 'pending'
    },
    sentAt: Date,
    openedAt: Date,
    clickedAt: Date,
    bouncedAt: Date
  }],
  segmentCriteria: mongoose.Schema.Types.Mixed,
  schedule: {
    type: String,
    enum: ['immediate', 'scheduled'],
    default: 'immediate'
  },
  scheduledFor: Date,
  stats: {
    totalRecipients: {
      type: Number,
      default: 0
    },
    sent: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Number,
      default: 0
    },
    bounced: {
      type: Number,
      default: 0
    },
    complained: {
      type: Number,
      default: 0
    },
    unsubscribed: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Update stats
emailCampaignSchema.methods.updateStats = async function() {
  const stats = {
    totalRecipients: this.recipients.length,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    complained: 0,
    unsubscribed: 0
  };

  this.recipients.forEach(recipient => {
    if (recipient.status === 'sent' || recipient.status === 'opened' || recipient.status === 'clicked') {
      stats.sent++;
    }
    if (recipient.status === 'opened' || recipient.status === 'clicked') {
      stats.opened++;
    }
    if (recipient.status === 'clicked') {
      stats.clicked++;
    }
    if (recipient.status === 'bounced') {
      stats.bounced++;
    }
    if (recipient.status === 'complained') {
      stats.complained++;
    }
    if (recipient.status === 'unsubscribed') {
      stats.unsubscribed++;
    }
  });

  this.stats = stats;
  return this.save();
};

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);
```

### models/EmailTemplate.js
```javascript
const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  subject: {
    type: String,
    required: true
  },
  content: {
    html: {
      type: String,
      required: true
    },
    text: String
  },
  variables: [{
    name: String,
    description: String,
    defaultValue: String,
    required: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: String,
    enum: ['marketing', 'transactional', 'newsletter', 'announcement', 'other'],
    default: 'other'
  },
  tags: [String],
  thumbnail: String,
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Increment usage count
emailTemplateSchema.methods.incrementUsage = function() {
  this.usageCount++;
  this.lastUsed = new Date();
  return this.save();
};

// Replace variables in content
emailTemplateSchema.methods.renderContent = function(variables = {}) {
  let html = this.content.html;
  let text = this.content.text || '';
  let subject = this.subject;

  // Replace variables in format {{variableName}}
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, variables[key]);
    text = text.replace(regex, variables[key]);
    subject = subject.replace(regex, variables[key]);
  });

  // Replace any remaining variables with defaults
  this.variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    const value = variables[variable.name] || variable.defaultValue || '';
    html = html.replace(regex, value);
    text = text.replace(regex, value);
    subject = subject.replace(regex, value);
  });

  return { html, text, subject };
};

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
```

### middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.userId)
      .populate('business')
      .select('-password');
    
    if (!user || !user.isActive) {
      throw new Error();
    }

    // Check if business is active (for non-super admins)
    if (user.role !== 'super_admin' && user.business?.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Business account is not active'
      });
    }

    // Attach user and business to request
    req.user = user;
    req.business = user.business;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Please authenticate'
    });
  }
};

// Check for specific permission
const authorize = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check for specific role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role privileges'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  requireRole
};
```

### routes/auth.js (INCOMPLETE - needs implementation)
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Business = require('../models/Business');
const { generateToken } = require('../utils/jwt');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Register new business and admin user
router.post('/register', [
  body('businessName').notEmpty().trim(),
  body('domain').isURL().normalizeEmail(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('name').notEmpty().trim()
], validateRequest, async (req, res) => {
  try {
    const { businessName, domain, email, password, name } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if domain already exists
    const existingBusiness = await Business.findOne({ domain });
    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: 'Domain already registered'
      });
    }

    // Create business
    const business = new Business({
      name: businessName,
      domain: domain,
      settings: {
        defaultFromEmail: `noreply@${domain}`,
        defaultFromName: businessName
      }
    });
    await business.save();

    // Create admin user
    const user = new User({
      email,
      password,
      name,
      business: business._id,
      role: 'business_admin',
      permissions: [
        'manage_users',
        'manage_campaigns',
        'manage_templates',
        'manage_settings',
        'view_analytics',
        'send_emails'
      ]
    });
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      businessId: business._id,
      role: user.role
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      business: {
        id: business._id,
        name: business.name,
        domain: business.domain
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with business
    const user = await User.findOne({ email })
      .populate('business')
      .select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is disabled'
      });
    }

    // Check if business is active (for non-super admins)
    if (user.role !== 'super_admin' && user.business?.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Business account is not active'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      businessId: user.business?._id,
      role: user.role
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      },
      business: user.business ? {
        id: user.business._id,
        name: user.business.name,
        domain: user.business.domain,
        subscription: user.business.subscription
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      permissions: req.user.permissions
    },
    business: req.business ? {
      id: req.business._id,
      name: req.business.name,
      domain: req.business.domain,
      subscription: req.business.subscription
    } : null
  });
});

// Refresh token
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const token = generateToken({
      userId: req.user._id,
      businessId: req.business?._id,
      role: req.user.role
    });

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

module.exports = router;
```

## Installation Commands

```bash
# SSH to VPS
ssh root@31.97.57.193

# Navigate to project
cd /power-mta-hub/backend

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name power-mta-backend
pm2 save
pm2 startup
```

## Complete the Setup

1. **Add auth routes to server.js**:
   ```javascript
   // After line: // API Routes (to be added)
   const authRoutes = require('./routes/auth');
   app.use('/api/auth', authRoutes);
   ```

2. **Restart server**:
   ```bash
   pm2 restart power-mta-backend
   ```

3. **Test endpoints**:
   ```bash
   # Register
   curl -X POST http://localhost:5002/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"businessName":"Test Business","domain":"test.com","email":"admin@test.com","password":"Test123!","name":"Admin"}'

   # Login
   curl -X POST http://localhost:5002/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@test.com","password":"Test123!"}'
   ```

This documentation now contains ALL the code files created for the Power MTA Hub project.