# ViticultWhisky - Premium Scottish Whisky Cask Investment Platform

A full-stack web application for whisky cask investment, connecting investors with Scotland's finest distilleries. Built with React, TypeScript, Node.js, and MongoDB.

## 🥃 Features

### Frontend Features
- **Investment Platform**: Complete whisky cask investment interface
- **Interactive Calculator**: ROI calculator with market projections
- **Contact & Sell Forms**: User engagement with proper validation
- **Admin Dashboard**: Contact management and analytics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags, sitemaps, structured data
- **Performance**: Image optimization, lazy loading, caching

### Backend Features
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based admin authentication
- **Form Handling**: Contact and sell whisky form processing
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Helmet.js, CORS, rate limiting, MongoDB sanitization
- **Logging**: Comprehensive error and access logging
- **Health Monitoring**: Health check endpoints for monitoring

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **React Router** for navigation
- **Helmet** for SEO management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Express Validator** for input validation
- **Helmet.js** for security headers
- **Morgan** for logging
- **Compression** and performance optimization

## 📁 Project Structure

```
Whisky/
├── frontend/           # React TypeScript frontend
│   ├── public/        # Static assets and images
│   ├── src/           # Source code
│   └── build/         # Production build (generated)
├── backend/           # Node.js Express backend
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   ├── middleware/    # Express middleware
│   └── logs/          # Log files (generated)
└── PROJECT_STRUCTURE.md  # Detailed structure guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 4.4+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd viticult-whisky
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Edit with your configuration
   npm start
   ```

3. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Admin: http://localhost:3000/admin/login

### Production Build

```bash
# Frontend production build
cd frontend
npm run build

# Backend production
cd backend
NODE_ENV=production npm start
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories. See `PROJECT_STRUCTURE.md` for complete configuration details.

**Backend (.env)**
```bash
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/viticult-whisky
JWT_SECRET=your-secure-secret
ADMIN_EMAIL=admin@viticultwhisky.co.uk
# ... see PROJECT_STRUCTURE.md for complete list
```

**Frontend (.env)** (optional)
```bash
REACT_APP_API_URL=http://localhost:5001/api
```

## 📊 Features Overview

### Investment Platform
- **Cask Selection**: Browse and select premium whisky casks
- **ROI Calculator**: Interactive investment return calculator
- **Market Insights**: Market growth charts and projections
- **Angels' Share**: Understanding evaporation and tax benefits

### Contact Management
- **Contact Forms**: Lead capture with validation
- **Sell Whisky**: Collection valuation requests
- **Admin Dashboard**: Contact management and analytics
- **Email Integration**: Automated notifications

### Security & Performance
- **Rate Limiting**: 500 requests/15min (business-friendly)
- **Input Validation**: Comprehensive validation and sanitization
- **CORS Protection**: Configured for production domains
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Browser and API response caching

## 🔐 Security Features

- **Authentication**: JWT-based admin authentication
- **Rate Limiting**: Business-friendly rate limiting
- **Input Validation**: Express-validator with custom rules
- **MongoDB Sanitization**: Protection against NoSQL injection
- **Security Headers**: Helmet.js with business-friendly settings
- **CORS Configuration**: Properly configured for production domains

## 📱 API Endpoints

```
GET  /api/health              # Health check
POST /api/contact             # Contact form submission
POST /api/sell-whisky         # Sell whisky form submission
POST /api/auth/admin/login    # Admin authentication
GET  /api/admin/contacts      # Get all contacts (admin)
```

See `PROJECT_STRUCTURE.md` for complete API documentation.

## 🎨 Design System

### Color Palette
- **Primary Gold**: #D4AF37 (premium-gold)
- **Charcoal**: #2D3748 (primary text)
- **Rich Brown**: #8B4513 (accent)
- **Eco Green**: #10B981 (success states)

### Typography
- **Headings**: Custom serif font stack
- **Body**: Inter font family
- **Code**: Fira Code for code blocks

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: WebP format with lazy loading
- **Code Splitting**: Dynamic imports for optimal loading
- **Compression**: Gzip compression enabled
- **Caching**: Proper cache headers and strategies

## 🚀 Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Configure MongoDB connection
- [ ] Set up email SMTP
- [ ] Configure domain in CORS settings
- [ ] Set up reverse proxy (nginx)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging

### Recommended Stack
- **VPS**: Ubuntu 20.04+ with 2GB+ RAM
- **Process Manager**: PM2 for production
- **Reverse Proxy**: Nginx
- **Database**: MongoDB 4.4+
- **SSL**: Let's Encrypt certificates

## 📞 Contact & Support

- **Email**: admin@viticult.co.uk
- **Phone**: 020 3595 3910
- **Address**: 3rd Floor, 35 Artillery Lane, London, E1 7LP

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For internal development guidelines, see the development documentation.

---

**Built with ❤️ for whisky investment enthusiasts**