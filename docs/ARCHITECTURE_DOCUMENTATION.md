# ViticultWhisky Architecture Documentation

## System Overview

ViticultWhisky is a modern, full-stack web application for premium whisky investment services. The platform follows a microservices-inspired architecture with a clear separation between frontend presentation and backend API services.

### Architecture Principles
- **Separation of Concerns**: Clear boundaries between frontend/backend
- **Security First**: Multiple layers of protection and validation
- **Scalability**: Designed for growth and high availability
- **Performance**: Optimized for speed and user experience
- **Maintainability**: Clean code structure and comprehensive documentation

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   File System   │    │   Indexes       │
│   (Build/Dist)  │    │   (Logs/Temp)   │    │   (Optimized)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React 19.1.0 with TypeScript
- **Routing**: React Router DOM v7.6.3
- **Styling**: Tailwind CSS v3.4.1
- **3D Graphics**: Three.js with @react-three/fiber
- **Animations**: Framer Motion v12.23.0
- **HTTP Client**: Axios v1.10.0
- **Forms**: React Hook Form v7.59.0
- **Charts**: Chart.js + React-ChartJS-2

### Component Architecture

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PublicLayout.tsx
│   ├── sections/         # Page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Testimonials.tsx
│   ├── calculators/      # Investment tools
│   │   └── ROICalculator.tsx
│   ├── 3d/              # Three.js components
│   │   └── WhiskyBarrelAnimation.tsx
│   ├── common/          # Reusable components
│   │   ├── ErrorBoundary.tsx
│   │   └── OptimizedImage.tsx
│   └── admin/           # Admin interface
│       └── SiteConfigManager.tsx
├── pages/               # Route components
│   ├── Home.tsx
│   ├── Contact.tsx
│   ├── SellWhisky.tsx
│   └── Admin/
│       ├── Login.tsx
│       └── Dashboard.tsx
├── services/            # API integration
│   └── api.ts
├── hooks/               # Custom React hooks
│   └── useGTM.ts
├── utils/               # Utility functions
│   ├── logger.ts
│   └── sitemap.ts
└── types/               # TypeScript definitions
    └── global.d.ts
```

### State Management Strategy
- **Local State**: React useState for component-specific data
- **Form State**: React Hook Form for complex forms
- **Global State**: React Context for authentication and app-wide settings
- **Server State**: Direct API calls with Axios (no complex state management library needed)

### Performance Optimizations
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: WebP format with responsive sizing
- **Bundle Optimization**: Tree-shaking and dead code elimination
- **Caching**: Service worker for static assets
- **3D Optimization**: Texture disposal and memory management

### Security Features
- **XSS Protection**: DOMPurify for user-generated content
- **Input Validation**: Client-side validation with server-side verification
- **HTTPS Enforcement**: Secure cookie transmission
- **Content Security Policy**: Implemented via Helmet.js on backend

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js v16+
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB v7.6.3 with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator v7.2.1 + Joi v17.13.3
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston v3.17.0
- **Email**: Nodemailer v6.9.7

### API Architecture

```
backend/
├── server.js            # Application entry point
├── config/              # Configuration management
│   ├── index.js
│   ├── development.js
│   └── production.js
├── controllers/         # Business logic
│   ├── contact.controller.js
│   ├── sellWhisky.controller.js
│   ├── admin.controller.js
│   └── auth.controller.js
├── models/              # Database schemas
│   ├── Contact.js
│   ├── SellWhisky.js
│   ├── User.js
│   └── BlogPost.js
├── routes/              # API endpoints
│   ├── contact.routes.js
│   ├── sellWhisky.routes.js
│   ├── admin.routes.js
│   └── auth.routes.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   ├── rateLimiter.js
│   └── errorHandler.js
├── utils/               # Utility functions
│   ├── logger.js
│   ├── email.js
│   └── appError.js
└── tests/               # Test suites
    ├── auth.test.js
    └── security.test.js
```

### Request Flow

```
1. Client Request
   ↓
2. Rate Limiting Middleware
   ↓
3. Security Headers (Helmet)
   ↓
4. CORS Validation
   ↓
5. Request Parsing (JSON/URL)
   ↓
6. Authentication Middleware (if required)
   ↓
7. Input Validation Middleware
   ↓
8. Route Handler (Controller)
   ↓
9. Database Operations (Mongoose)
   ↓
10. Response Formatting
    ↓
11. Error Handling (if errors)
    ↓
12. Client Response
```

### Security Architecture

#### Authentication Flow
```
1. User Login Request
   ↓
2. Credentials Validation
   ↓
3. bcrypt Password Verification
   ↓
4. JWT Token Generation
   ↓
5. HttpOnly Cookie Setting
   ↓
6. Secure Token Storage
   ↓
7. Subsequent Request Authentication
```

#### Middleware Stack
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: Request throttling
- **express-mongo-sanitize**: NoSQL injection prevention
- **xss-clean**: Cross-site scripting protection
- **hpp**: HTTP parameter pollution protection

### Database Design

#### MongoDB Collections

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  role: String (enum: ['admin', 'user']),
  name: String,
  active: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Contacts Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (indexed),
  phone: String,
  subject: String,
  message: String,
  preferredContactMethod: String,
  investmentAmount: String,
  timeframe: String,
  status: String (enum: ['new', 'contacted', 'resolved']),
  clientIp: String,
  userAgent: String,
  submittedAt: Date,
  processedAt: Date,
  assignedTo: ObjectId (ref: 'User')
}
```

**SellWhisky Collection**
```javascript
{
  _id: ObjectId,
  personalInfo: {
    name: String,
    email: String,
    phone: String
  },
  whiskyDetails: {
    brand: String,
    age: String,
    size: String,
    condition: String,
    packaging: String,
    purchaseYear: String,
    estimatedValue: String
  },
  additionalInfo: {
    description: String,
    images: [String],
    certificates: [String]
  },
  status: String (enum: ['submitted', 'reviewing', 'valued', 'offered', 'accepted', 'rejected']),
  valuation: {
    estimatedValue: Number,
    notes: String,
    valuedBy: ObjectId (ref: 'User'),
    valuedAt: Date
  },
  clientIp: String,
  submittedAt: Date,
  lastUpdated: Date
}
```

#### Indexing Strategy
- **Users**: email (unique), role
- **Contacts**: email, submittedAt, status
- **SellWhisky**: personalInfo.email, status, submittedAt
- **BlogPosts**: slug (unique), publishedAt, category

## Deployment Architecture

### Development Environment
```
Frontend (localhost:3000)
├── React Development Server
├── Hot Module Replacement
├── Source Maps Enabled
└── API Proxy to Backend

Backend (localhost:5001)
├── Nodemon Auto-restart
├── Morgan Request Logging
├── Debug Mode Enabled
└── Local MongoDB Connection
```

### Production Environment
```
Frontend (Static Files)
├── Nginx Web Server
├── Gzip Compression
├── Cache Headers
└── SSL Termination

Backend (Node.js Process)
├── PM2 Process Manager
├── Production Logging
├── Error Monitoring
└── MongoDB Atlas/VPS Connection
```

### Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name viticultwhisky.co.uk;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend static files
    location / {
        root /var/www/viticultwhisky/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'viticultwhisky-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2.log'
  }]
};
```

## API Design Patterns

### RESTful Conventions
- **GET** `/api/resource` - Retrieve collection
- **GET** `/api/resource/:id` - Retrieve single item
- **POST** `/api/resource` - Create new item
- **PUT** `/api/resource/:id` - Update entire item
- **PATCH** `/api/resource/:id` - Partial update
- **DELETE** `/api/resource/:id` - Remove item

### Response Format Standards
```javascript
// Success Response
{
  "status": "success",
  "data": {
    // Response data
  },
  "pagination": { // If applicable
    "page": 1,
    "limit": 10,
    "total": 100
  }
}

// Error Response
{
  "status": "error",
  "message": "Human readable error",
  "errors": [ // Validation errors
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "code": "ERROR_CODE" // Machine readable
}
```

### Error Handling Strategy
- **400 Bad Request**: Client errors, validation failures
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

## Security Architecture

### Data Protection
- **Encryption at Rest**: MongoDB encryption
- **Encryption in Transit**: TLS 1.2+ for all connections
- **Password Hashing**: bcrypt with salt rounds 12
- **JWT Tokens**: Short expiry with refresh mechanism
- **Input Sanitization**: Multiple layers of validation

### Network Security
- **Firewall Rules**: Only necessary ports open
- **DDoS Protection**: Rate limiting and request throttling
- **IP Whitelisting**: Admin access restrictions
- **SSL/TLS**: Strong cipher suites only

### Application Security
- **OWASP Top 10**: Protection against common vulnerabilities
- **SQL Injection**: MongoDB parameterized queries
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based validation
- **Session Security**: HttpOnly, Secure, SameSite cookies

## Monitoring and Logging

### Application Monitoring
- **Winston Logging**: Structured JSON logs
- **Error Tracking**: Automated error collection
- **Performance Metrics**: Response time monitoring
- **Health Checks**: Endpoint availability monitoring

### Infrastructure Monitoring
- **Server Metrics**: CPU, memory, disk usage
- **Database Monitoring**: Connection pools, query performance
- **Network Monitoring**: Bandwidth and latency
- **Security Monitoring**: Failed login attempts, unusual activity

### Log Management
```
logs/
├── access.log          # HTTP access logs
├── error.log           # Application errors
├── combined.log        # All application logs
├── exceptions.log      # Uncaught exceptions
└── rejections.log      # Unhandled promise rejections
```

## Performance Considerations

### Frontend Performance
- **Bundle Size**: Optimized webpack configuration
- **Image Optimization**: WebP with fallbacks
- **Code Splitting**: Route-based lazy loading
- **Caching Strategy**: Service worker implementation
- **3D Performance**: Efficient Three.js rendering

### Backend Performance
- **Database Queries**: Optimized indexes and aggregations
- **Caching**: Redis for session storage (future enhancement)
- **Connection Pooling**: MongoDB connection optimization
- **Response Compression**: Gzip enabled
- **Rate Limiting**: Prevents abuse and ensures fair usage

### Network Performance
- **CDN Integration**: Static asset delivery (future)
- **HTTP/2**: Modern protocol support
- **Compression**: All responses compressed
- **Keep-Alive**: Connection reuse
- **Minification**: CSS/JS optimization

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: No server-side session storage
- **Load Balancing**: Nginx upstream configuration
- **Database Clustering**: MongoDB replica sets
- **Microservices**: Potential service decomposition

### Vertical Scaling
- **Resource Optimization**: Memory and CPU efficiency
- **Database Optimization**: Query performance tuning
- **Caching Layers**: Redis integration planning
- **Asset Optimization**: CDN implementation

## Development Workflow

### Version Control
- **Git Flow**: Feature branches and releases
- **Code Review**: Pull request requirements
- **Automated Testing**: CI/CD pipeline integration
- **Documentation**: Inline and external docs

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Vulnerability scanning
- **Performance Tests**: Load testing protocols

### Deployment Pipeline
```
1. Development → Feature Branch
2. Code Review → Pull Request
3. Automated Tests → CI Pipeline
4. Security Scan → Vulnerability Check
5. Staging Deploy → QA Testing
6. Production Deploy → Blue/Green Strategy
7. Post-Deploy → Health Checks
```

---

*Architecture Documentation Version: 1.0.0*
*Last Updated: January 2025*
*Maintained by: ViticultWhisky Development Team*