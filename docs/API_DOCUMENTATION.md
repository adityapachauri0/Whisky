# ViticultWhisky API Documentation

## Overview

The ViticultWhisky backend API provides comprehensive endpoints for a premium whisky investment platform. Built with Express.js, MongoDB, and featuring advanced security, rate limiting, and validation.

### Base URL
- **Development**: `http://localhost:5001/api`
- **Production**: `https://viticultwhisky.co.uk/api`

### API Version
- **Current Version**: v1.0.0
- **Express.js**: v4.18.2
- **Node.js**: Compatible with v16+

## Authentication

### Admin Authentication
JWT-based authentication with httpOnly cookies for enhanced security.

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@viticultwhisky.co.uk",
  "password": "admin123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Admin login successful",
  "user": {
    "id": "user_id",
    "email": "admin@viticultwhisky.co.uk",
    "role": "admin",
    "name": "Admin User"
  }
}
```

#### Admin Logout
```http
POST /auth/admin/logout
Authorization: Bearer <token>
```

## Core Endpoints

### Contact Form Submission

Submit contact form inquiries with comprehensive validation and rate limiting.

```http
POST /contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+44 20 7946 0958",
  "subject": "Investment Inquiry",
  "message": "I'm interested in whisky cask investment opportunities.",
  "preferredContactMethod": "email",
  "investmentAmount": "£50,000",
  "timeframe": "1-2 years"
}
```

**Validation Rules:**
- `name`: 2-100 characters, letters, spaces, hyphens, apostrophes
- `email`: Valid email format
- `phone`: Valid international phone format
- `subject`: 5-200 characters (optional)
- `message`: 10-5000 characters (optional)
- `preferredContactMethod`: "email" | "phone" | "both"
- `investmentAmount`: Optional investment range
- `timeframe`: Optional investment timeframe

**Response:**
```json
{
  "status": "success",
  "message": "Contact form submitted successfully",
  "submissionId": "unique_submission_id"
}
```

**Rate Limiting:**
- 15 requests per 15 minutes per IP
- Enhanced rate limiting for production environments

### Sell Whisky Form

Submit whisky selling requests with detailed bottle information.

```http
POST /sell-whisky
Content-Type: application/json
```

**Request Body:**
```json
{
  "personalInfo": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+44 20 7946 0958"
  },
  "whiskyDetails": {
    "brand": "Macallan",
    "age": "25",
    "size": "700ml",
    "condition": "Excellent",
    "packaging": "Original box and papers",
    "purchaseYear": "2010",
    "estimatedValue": "£2,500"
  },
  "additionalInfo": {
    "description": "Rare 25-year-old Macallan in pristine condition",
    "images": ["image1.jpg", "image2.jpg"],
    "certificates": ["certificate1.pdf"]
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Whisky submission received successfully",
  "submissionId": "unique_submission_id",
  "estimatedProcessingTime": "2-3 business days"
}
```

### Blog Management

#### Get All Blog Posts
```http
GET /blog/posts?page=1&limit=10&category=investment
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10, max: 50)
- `category`: Filter by category
- `published`: Filter published posts (true/false)

**Response:**
```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": "post_id",
        "title": "Whisky Investment Guide 2025",
        "slug": "whisky-investment-guide-2025",
        "excerpt": "Complete guide to whisky cask investments...",
        "content": "Full article content...",
        "author": "Investment Team",
        "publishedAt": "2025-01-15T10:00:00Z",
        "category": "investment",
        "tags": ["investment", "guide", "whisky"],
        "readTime": 8,
        "featured": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 48,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Single Blog Post
```http
GET /blog/posts/:slug
```

### Admin Dashboard Endpoints

#### Get Dashboard Statistics
```http
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "contacts": {
      "total": 156,
      "thisMonth": 23,
      "growth": "+15%"
    },
    "sellSubmissions": {
      "total": 42,
      "pending": 8,
      "processed": 34
    },
    "blogPosts": {
      "published": 15,
      "drafts": 3
    },
    "systemHealth": {
      "status": "healthy",
      "uptime": "99.9%",
      "lastBackup": "2025-01-20T02:00:00Z"
    }
  }
}
```

#### Get Contact Submissions
```http
GET /admin/contacts?page=1&limit=20&status=all
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number
- `limit`: Results per page
- `status`: "all" | "new" | "contacted" | "resolved"
- `dateFrom`: Start date filter (ISO format)
- `dateTo`: End date filter (ISO format)

#### Export Contact Data
```http
GET /admin/contacts/export?format=xlsx
Authorization: Bearer <token>
```

**Supported Formats:**
- `xlsx`: Excel format
- `csv`: CSV format

## Rate Limiting

### Global Rate Limits
- **General API**: 300 requests per 15 minutes
- **Authentication**: 9 attempts per 15 minutes
- **Contact Form**: 15 submissions per 15 minutes
- **Sell Whisky**: 15 submissions per hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1642680000
```

## Error Handling

### Standard Error Response
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email",
      "location": "body"
    }
  ],
  "timestamp": "2025-01-20T10:30:00Z",
  "requestId": "req_unique_id"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

### Common Error Types

#### Validation Errors (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be between 2 and 100 characters",
      "value": "A",
      "location": "body"
    }
  ]
}
```

#### Rate Limit Exceeded (429)
```json
{
  "status": "error",
  "message": "Too many requests, please try again later",
  "retryAfter": 900
}
```

#### Authentication Required (401)
```json
{
  "status": "error",
  "message": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

## Security Features

### Input Sanitization
- **MongoDB Injection Protection**: `express-mongo-sanitize`
- **XSS Protection**: `xss-clean`
- **HTML Parameter Pollution**: `hpp`
- **Request Size Limiting**: 10mb max payload

### Headers Security
- **Helmet.js**: Comprehensive security headers
- **CORS**: Configured for frontend domains
- **HTTPS Enforcement**: Production redirect to HTTPS

### Data Validation
- **express-validator**: Server-side validation
- **Joi**: Schema validation for complex objects
- **Input Trimming**: Automatic whitespace removal

## API Testing

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00Z",
  "version": "1.0.0",
  "environment": "production",
  "database": "connected",
  "memory": {
    "used": "245MB",
    "free": "3.2GB"
  }
}
```

### Database Status
```http
GET /admin/system/database
Authorization: Bearer <token>
```

## SDKs and Libraries

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.6.3",
  "express-validator": "^7.2.1",
  "express-rate-limit": "^7.5.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "helmet": "^7.2.0",
  "cors": "^2.8.5",
  "winston": "^3.17.0",
  "nodemailer": "^6.9.7"
}
```

### Frontend Integration
```javascript
// API Configuration
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contact Form Submission
const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

## Monitoring and Logging

### Winston Logging
- **Error Logs**: `/logs/error.log`
- **Combined Logs**: `/logs/combined.log`
- **Access Logs**: `/logs/access.log`

### Log Levels
- `error`: System errors and exceptions
- `warn`: Warning conditions
- `info`: General information
- `debug`: Debug information (development only)

### Performance Monitoring
- Request duration tracking
- Memory usage monitoring
- Database query performance
- Rate limiting metrics

## Deployment

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/viticultwhisky
MONGODB_URI_PRODUCTION=mongodb://production-host/viticultwhisky

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your-cookie-secret

# Email (Nodemailer)
EMAIL_FROM=noreply@viticultwhisky.co.uk
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5001
NODE_ENV=production

# Admin Credentials
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD=secure-admin-password
```

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection secured
- [ ] SSL certificates installed
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Admin user created
- [ ] CORS domains whitelisted
- [ ] Security headers enabled

## API Changelog

### Version 1.0.0 (Current)
- Initial API release
- Contact form endpoints
- Sell whisky functionality
- Admin authentication
- Blog management
- Rate limiting implementation
- Comprehensive validation
- Export functionality

---

*Last Updated: January 2025*
*API Version: 1.0.0*
*Documentation maintained by ViticultWhisky Development Team*