# Backend API Documentation

## Overview

This document provides comprehensive documentation for the ViticultWhisky backend API. The backend is built with Node.js, Express.js, and MongoDB, providing RESTful APIs for managing whisky investment platform operations.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with httpOnly cookies for enhanced security.

### Headers

```
Content-Type: application/json
Cookie: authToken=<jwt_token>
```

### Alternative Header Authentication

```
Authorization: Bearer <jwt_token>
```

---

## Admin Authentication Endpoints

### Admin Login

**Endpoint**: `POST /api/admin/login`

**Description**: Authenticate admin user and receive JWT token

**Request Body**:
```json
{
  "email": "admin@viticult.co.uk",
  "password": "admin123"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "admin@viticult.co.uk",
      "role": "admin",
      "firstName": "Admin",
      "lastName": "User"
    }
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Response** (Account Locked - 423):
```json
{
  "success": false,
  "message": "Account is locked due to too many failed login attempts. Please try again later."
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticult.co.uk","password":"admin123"}'
```

---

### Admin Logout

**Endpoint**: `POST /api/admin/logout`

**Description**: Logout admin user and clear authentication cookie

**Headers**: Requires authentication

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/admin/logout \
  -H "Content-Type: application/json" \
  --cookie "authToken=your_jwt_token"
```

---

### Change Admin Password

**Endpoint**: `POST /api/admin/change-password`

**Description**: Change admin user password

**Headers**: Requires authentication + CSRF token

**Request Body**:
```json
{
  "currentPassword": "current_password",
  "newPassword": "new_secure_password123!"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Password changed successfully. The change is effective immediately.",
  "note": "Your new password is now active. Please use it for your next login."
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/admin/change-password \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: csrf_token_here" \
  --cookie "authToken=your_jwt_token" \
  -d '{"currentPassword":"old_pass","newPassword":"NewSecure123!"}'
```

---

## Data Management Endpoints

### Get Contact Submissions

**Endpoint**: `GET /api/admin/contact-submissions`

**Description**: Retrieve all contact form submissions

**Headers**: Requires authentication

**Query Parameters**: None

**Response** (Success - 200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "654abc123def456789",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+44 20 1234 5678",
      "subject": "Investment Inquiry",
      "message": "I'm interested in whisky cask investment...",
      "investmentInterest": "premium",
      "preferredContactMethod": "email",
      "status": "new",
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/admin/contact-submissions \
  --cookie "authToken=your_jwt_token"
```

---

### Get Sell Whisky Submissions

**Endpoint**: `GET /api/admin/sell-submissions`

**Description**: Retrieve all sell whisky form submissions

**Headers**: Requires authentication

**Response** (Success - 200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "654def123abc456789",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+44 20 9876 5432",
      "distillery": "Macallan",
      "caskType": "Sherry Hogshead",
      "year": "2010",
      "litres": "250",
      "abv": "63.5",
      "askingPrice": "15000",
      "message": "Premium cask in excellent condition...",
      "status": "new",
      "ipAddress": "192.168.1.101",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/admin/sell-submissions \
  --cookie "authToken=your_jwt_token"
```

---

### Get Consultation Requests

**Endpoint**: `GET /api/admin/consultation-requests`

**Description**: Retrieve all consultation booking requests

**Headers**: Requires authentication

**Response** (Success - 200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "654ghi123jkl456789",
      "name": "Bob Wilson",
      "email": "bob@example.com",
      "phone": "+44 20 5555 1234",
      "preferredDate": "2024-02-01",
      "preferredTime": "14:00",
      "consultationType": "investment_strategy",
      "message": "Would like to discuss portfolio diversification...",
      "status": "new",
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

---

## Export and Communication

### Export Submissions to Excel

**Endpoint**: `GET /api/admin/export`

**Description**: Export all form submissions to Excel file

**Headers**: Requires authentication

**Query Parameters**:
- `format=excel` (required)

**Response**: Binary Excel file (.xlsx)

**Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

**Content-Disposition**: `attachment; filename="whisky-submissions-YYYY-MM-DD.xlsx"`

**Excel Sheets**:
1. **Contact Inquiries** - All contact form data
2. **Investment Inquiries** - Investment-specific data
3. **Sell Whisky Requests** - Sell whisky form data

**Columns Include**:
- All form fields
- IP addresses
- User agent strings
- Timestamps (created/updated)
- Status information

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/admin/export?format=excel" \
  --cookie "authToken=your_jwt_token" \
  -o "whisky-submissions.xlsx"
```

---

### Preview Email Template

**Endpoint**: `POST /api/admin/preview-email`

**Description**: Generate email preview for customer communication

**Headers**: Requires authentication

**Request Body**:
```json
{
  "contact": {
    "_id": "654abc123def456789",
    "name": "John Smith",
    "email": "john@example.com",
    "subject": "Investment Inquiry",
    "investmentInterest": "premium"
  }
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "subject": "Re: Investment Inquiry - Your Whisky Investment Journey Begins",
  "html": "<html>... beautifully formatted HTML email ...",
  "text": "Dear John Smith, Thank you for your interest..."
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/admin/preview-email \
  -H "Content-Type: application/json" \
  --cookie "authToken=your_jwt_token" \
  -d '{"contact":{"name":"John Smith","email":"john@example.com","subject":"Investment Inquiry"}}'
```

---

### Send Email to Contact

**Endpoint**: `POST /api/admin/send-email`

**Description**: Send email to customer using template

**Headers**: Requires authentication

**Request Body**:
```json
{
  "contact": {
    "_id": "654abc123def456789",
    "name": "John Smith",
    "email": "john@example.com",
    "investmentInterest": "premium"
  },
  "subject": "Re: Investment Inquiry - Your Whisky Investment Journey Begins",
  "html": "<html>... email content ..."
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Side Effects**:
- Email is sent to customer
- Contact status updated to 'contacted'
- `lastContactedAt` timestamp updated

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/admin/send-email \
  -H "Content-Type: application/json" \
  --cookie "authToken=your_jwt_token" \
  -d '{"contact":{"email":"john@example.com","name":"John Smith"},"subject":"Test","html":"<p>Hello</p>"}'
```

---

## Delete Operations

### Delete Contact

**Endpoint**: `DELETE /api/admin/contact/:id`

**Description**: Delete a specific contact submission

**Headers**: Requires authentication

**URL Parameters**:
- `id` (string) - Contact ID

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/admin/contact/654abc123def456789 \
  --cookie "authToken=your_jwt_token"
```

---

### Delete Sell Submission

**Endpoint**: `DELETE /api/admin/sell-submissions/:id`

**Description**: Delete a specific sell whisky submission

**Headers**: Requires authentication

**URL Parameters**:
- `id` (string) - Submission ID

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Sell submission deleted successfully"
}
```

---

### Bulk Delete Contacts

**Endpoint**: `POST /api/admin/contact/bulk-delete`

**Description**: Delete multiple contacts in one operation

**Headers**: Requires authentication

**Request Body**:
```json
{
  "ids": [
    "654abc123def456789",
    "654def123abc456789",
    "654ghi123jkl456789"
  ]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "deletedCount": 3,
  "message": "3 contacts deleted successfully"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/admin/contact/bulk-delete \
  -H "Content-Type: application/json" \
  --cookie "authToken=your_jwt_token" \
  -d '{"ids":["654abc123def456789","654def123abc456789"]}'
```

---

### Bulk Delete Sell Submissions

**Endpoint**: `POST /api/admin/sell-submissions/bulk-delete`

**Description**: Delete multiple sell submissions in one operation

**Headers**: Requires authentication

**Request Body**:
```json
{
  "ids": [
    "654def123abc456789",
    "654ghi123jkl456789"
  ]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "deletedCount": 2,
  "message": "2 submissions deleted successfully"
}
```

---

## CSRF Protection

### Get CSRF Token

**Endpoint**: `GET /api/admin/csrf-token`

**Description**: Get CSRF token for state-changing operations

**Response** (Success - 200):
```json
{
  "csrfToken": "abc123def456ghi789"
}
```

**Usage**: Include token in `X-CSRF-Token` header for POST/PUT/DELETE requests

---

## Public Form Submission Endpoints

### Submit Contact Form

**Endpoint**: `POST /api/contact`

**Description**: Submit contact inquiry form (public endpoint)

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+44 20 1234 5678",
  "subject": "Investment Inquiry",
  "message": "I'm interested in whisky cask investment...",
  "investmentInterest": "premium",
  "preferredContactMethod": "email"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "654abc123def456789",
    "status": "new"
  }
}
```

---

### Submit Sell Whisky Form

**Endpoint**: `POST /api/sell-whisky`

**Description**: Submit sell whisky form (public endpoint)

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+44 20 9876 5432",
  "distillery": "Macallan",
  "caskType": "Sherry Hogshead",
  "year": "2010",
  "litres": "250",
  "abv": "63.5",
  "askingPrice": "15000",
  "message": "Premium cask in excellent condition..."
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Sell whisky form submitted successfully",
  "data": {
    "id": "654def123abc456789",
    "status": "new"
  }
}
```

---

## Error Responses

### Common Error Codes

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**401 - Unauthorized** 
```json
{
  "success": false,
  "message": "No token provided"
}
```

**403 - Forbidden**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**423 - Locked**
```json
{
  "success": false,
  "message": "Account is locked due to too many failed login attempts. Please try again later."
}
```

**429 - Too Many Requests**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

**500 - Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

**Login Attempts**: 5 attempts per IP per 15 minutes
**Account Lockout**: 5 failed attempts = 2 hour lockout
**General API**: 100 requests per IP per 15 minutes

---

## Security Features

1. **JWT Authentication** with httpOnly cookies
2. **CSRF Protection** for state-changing operations
3. **Account Lockout** after failed login attempts
4. **Rate Limiting** on all endpoints
5. **Input Validation** and sanitization
6. **Password Hashing** with bcrypt (12 salt rounds)
7. **IP Address Logging** for audit trails
8. **Role-based Access Control**

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/whisky-investment

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_EMAIL=admin@viticult.co.uk
ADMIN_PASSWORD_HASH=$2a$12$hashed.password.here

# Email Service
EMAIL_FROM=noreply@viticult.co.uk
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
CSRF_SECRET=your-csrf-secret-key
SESSION_SECRET=your-session-secret-key

# Server
PORT=5000
NODE_ENV=production
```

---

## Testing

Use the provided test scripts:

```bash
# Test admin features
cd backend
node test-admin-features.js

# Run test suite
npm test

# Security tests
npm run test:security
```

---

## Postman Collection

A Postman collection is available with all endpoints pre-configured:
- Import the collection from `/docs/postman-collection.json`
- Set environment variables for base URL and auth token
- Use the login endpoint to get authentication token
- Copy the token to other requests

---

*Last Updated: January 2024*
*Version: 1.0*