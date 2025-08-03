# ViticultWhisky Project Structure & Configuration Guide

## Project Overview
Full-stack whisky investment platform with React frontend and Node.js backend.

## Repository Structure
```
Whisky/
├── frontend/                    # React TypeScript frontend
├── backend/                     # Node.js Express backend
├── PROJECT_STRUCTURE.md         # This file
└── README.md                   # Project documentation
```

## Frontend Structure (/frontend)
```
frontend/
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt              # SEO robots file
│   ├── sitemap.xml             # SEO sitemap
│   ├── Viticult-Whisky-2025-Brochure.pdf  # Downloadable brochure
│   └── whisky/                 # All images organized by category
│       ├── about/              # About page images
│       ├── blog/               # Blog post images
│       ├── buy-sell/           # Buy/sell page images
│       ├── casks/              # Cask images
│       ├── distilleries/       # Distillery images
│       ├── hero/               # Hero section images
│       ├── regions/            # Whisky region images
│       └── testimonials/       # Customer testimonial images
├── src/
│   ├── components/             # Reusable React components
│   │   ├── auth/               # Authentication components
│   │   ├── common/             # Common UI components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   └── sections/           # Page section components
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   │   └── Admin/              # Admin dashboard pages
│   ├── services/               # API services and utilities
│   ├── styles/                 # CSS and styling files
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main App component with routing
│   └── index.tsx               # React app entry point
├── package.json                # Frontend dependencies
├── tsconfig.json               # TypeScript configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## Backend Structure (/backend)
```
backend/
├── config/                     # Configuration files
├── controllers/                # Route controllers
├── middleware/                 # Express middleware
│   ├── auth.js                 # Authentication middleware
│   ├── errorHandler.js         # Global error handling
│   ├── httpsEnforce.js         # HTTPS enforcement
│   └── validation.js           # Input validation rules
├── models/                     # Database models (Mongoose)
├── routes/                     # API route definitions
│   ├── admin.routes.js         # Admin endpoints
│   ├── auth.routes.js          # Authentication endpoints
│   ├── blog.routes.js          # Blog endpoints
│   ├── config.js               # Configuration endpoints
│   ├── contact.routes.js       # Contact form endpoints
│   ├── consultation.routes.js  # Consultation endpoints
│   └── sellWhisky.routes.js    # Sell whisky form endpoints
├── utils/                      # Utility functions
│   └── logger.js               # Logging configuration
├── logs/                       # Log files (created at runtime)
├── server.js                   # Main server file
├── package.json                # Backend dependencies
├── .env                        # Environment variables (development)
└── .env.production             # Production environment variables
```

## Key Configuration Files

### Frontend Configuration
- **package.json**: Dependencies, scripts, proxy settings
- **tsconfig.json**: TypeScript compiler configuration
- **tailwind.config.js**: Tailwind CSS theming and configuration
- **public/manifest.json**: PWA configuration

### Backend Configuration
- **server.js**: Main server configuration, middleware setup, routes
- **.env**: Development environment variables
- **.env.production**: Production environment variables
- **package.json**: Dependencies and npm scripts

## Environment Variables

### Frontend (.env in frontend/)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ENVIRONMENT=development

# Analytics (Optional)
REACT_APP_GTM_ID=your-gtm-id
REACT_APP_GA_ID=your-ga-id
```

### Backend (.env in backend/)
```bash
# Environment
NODE_ENV=development

# Server
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/viticult-whisky

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1

# Admin Authentication
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@viticultwhisky.co.uk
EMAIL_FROM_NAME=ViticultWhisky

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=10

# Security
ENCRYPTION_KEY=your-32-char-encryption-key-here
COOKIE_SECRET=your-cookie-secret-here
SESSION_SECRET=your-session-secret-here

# Logging
LOG_LEVEL=info
LOG_TO_FILE=false
```

### Production Environment (.env.production in backend/)
```bash
# Environment
NODE_ENV=production

# Server
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/viticult-whisky

# JWT Configuration
JWT_SECRET=production-jwt-secret-here
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1

# Admin Authentication
ADMIN_EMAIL=admin@viticultwhisky.co.uk
ADMIN_PASSWORD_HASH=production-bcrypt-hash-here

# Email Configuration (Production SMTP)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=production-email@gmail.com
EMAIL_PASSWORD=production-app-password
EMAIL_FROM=noreply@viticultwhisky.co.uk
EMAIL_FROM_NAME=ViticultWhisky

# Frontend Configuration
FRONTEND_URL=https://viticultwhisky.co.uk
ALLOWED_ORIGINS=https://viticultwhisky.co.uk,https://www.viticultwhisky.co.uk,https://viticult.co.uk,https://www.viticult.co.uk

# Rate Limiting - Business Friendly
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=500
AUTH_RATE_LIMIT_MAX=50

# Security
ENCRYPTION_KEY=production-32-char-encryption-key
COOKIE_SECRET=production-cookie-secret-here
SESSION_SECRET=production-session-secret-here

# Logging
LOG_LEVEL=error
LOG_TO_FILE=true
```

## Deployment Configuration

### Prerequisites
- Node.js 18+ and npm
- MongoDB running on localhost:27017
- Git for cloning repository

### Clone and Setup Commands
```bash
# Clone repository
git clone <repository-url> viticult-whisky
cd viticult-whisky

# Backend setup
cd backend
npm install
cp .env.production .env  # Copy production env
# Edit .env with your production values
npm start

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run build  # For production build
# Or npm start for development
```

### Port Configuration
- **Frontend Development**: http://localhost:3000
- **Frontend Production**: Served via nginx or static server
- **Backend API**: http://localhost:5001
- **MongoDB**: mongodb://localhost:27017

### Important File Paths for VPS

#### Static Assets
- **Frontend Build**: `/frontend/build/` (after `npm run build`)
- **Images**: `/frontend/public/whisky/` (all organized by category)
- **Brochure PDF**: `/frontend/public/Viticult-Whisky-2025-Brochure.pdf`

#### Configuration Files to Edit
- `/backend/.env` - Main environment configuration
- `/frontend/.env` - Frontend API configuration (if needed)

#### Log Files (Created at Runtime)
- `/backend/logs/access.log` - Access logs (production)
- `/backend/logs/error.log` - Error logs (production)

### Database Collections
- `contacts` - Contact form submissions
- `sell_whiskies` - Sell whisky form submissions
- `users` - Admin users
- `blog_posts` - Blog posts (if implemented)

### API Endpoints Structure
```
/api/health                     # Health check
/api/auth/*                     # Authentication endpoints
/api/contact                    # Contact form submission
/api/sell-whisky               # Sell whisky form submission
/api/consultation              # Consultation requests
/api/blog/*                    # Blog endpoints
/api/admin/*                   # Admin dashboard endpoints
```

### Security Features Enabled
- Helmet.js with business-friendly settings
- CORS configured for production domains
- Rate limiting (500 requests/15min globally)
- Authentication rate limiting (50 attempts/15min)
- MongoDB sanitization
- Parameter pollution protection
- Compression enabled
- HTTPS enforcement (configurable)

### Production Checklist
1. ✅ Update .env.production with real values
2. ✅ Set up MongoDB connection
3. ✅ Configure email SMTP settings
4. ✅ Set strong JWT secrets
5. ✅ Configure domain in ALLOWED_ORIGINS
6. ✅ Set up reverse proxy (nginx recommended)
7. ✅ Configure SSL certificates
8. ✅ Set up log rotation
9. ✅ Configure firewall rules
10. ✅ Set up monitoring

### Troubleshooting Common Issues

#### Frontend Issues
- **Build fails**: Check Node.js version (18+), run `npm install`
- **Images not loading**: Verify images are in `/frontend/public/whisky/`
- **API calls fail**: Check REACT_APP_API_URL in .env

#### Backend Issues
- **Server won't start**: Check PORT not in use, MongoDB connection
- **Database errors**: Verify MONGODB_URI, MongoDB service running
- **CORS errors**: Check ALLOWED_ORIGINS includes frontend domain
- **Rate limiting issues**: Adjust RATE_LIMIT_MAX_REQUESTS if needed

#### VPS Deployment Issues
- **Permission errors**: Check file permissions, user ownership
- **Port conflicts**: Verify ports 3000, 5001 available
- **Memory issues**: Monitor with `htop`, consider PM2 for process management

### Recommended PM2 Configuration
```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "viticult-backend"

# Start frontend (if serving with Node)
cd ../frontend
pm2 serve build/ 3000 --name "viticult-frontend" --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

This structure ensures all components are properly organized and documented for easy deployment and maintenance on any VPS environment.