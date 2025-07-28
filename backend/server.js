const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Validate environment variables - DISABLED FOR PRODUCTION STABILITY
// const validateEnvironment = require('./config/validateEnv');
// validateEnvironment();

// Import utils
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const httpsEnforce = require('./middleware/httpsEnforce');

// Import routes
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const consultationRoutes = require('./routes/consultation.routes');
const blogRoutes = require('./routes/blog.routes');
const sellWhiskyRoutes = require('./routes/sellWhisky.routes');
const adminRoutes = require('./routes/admin.routes');
const configRoutes = require('./routes/config');

const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// HTTPS enforcement - DISABLED FOR TESTING
// app.use(httpsEnforce);

// Security middleware - MINIMAL FOR TESTING
// app.use(helmet());

// CORS configuration - Permissive for production
app.use(cors({ 
  origin: true,  // Allow all origins
  credentials: true 
}));

// Body parsing middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit']
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Create a write stream for access logs
  const accessLogStream = require('fs').createWriteStream(
    require('path').join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Global rate limiting - DISABLED FOR TESTING
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 270 : 450, // Increased by 1.5x
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
//   skipSuccessfulRequests: false,
//   handler: (req, res) => {
//     logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
//     res.status(429).json({
//       status: 'error',
//       message: 'Too many requests. Please try again later.'
//     });
//   }
// });

// Apply rate limiting to all routes - DISABLED FOR TESTING
// app.use(globalLimiter);

// Strict rate limiting for auth routes - ENHANCED
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 23, // Increased by 1.5x (15 * 1.5 = 22.5, rounded to 23)
//   skipSuccessfulRequests: true,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: 'Too many authentication attempts. Please try again later.',
//   handler: (req, res) => {
//     logger.error(`Auth rate limit exceeded for IP: ${req.ip}, Email: ${req.body.email}`);
//     res.status(429).json({
//       status: 'error',
//       message: 'Too many authentication attempts. Account temporarily locked.'
//     });
//   }
// });

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whisky-investment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  logger.info('MongoDB connected successfully');
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  // Don't exit, just log the error
  logger.warn('Running without MongoDB connection');
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Health check endpoint - MUST be before routes to avoid auth middleware
app.get('/api/health', (req, res) => {
  logger.info('Health endpoint accessed');
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  res.status(200).json(health);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/config', configRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/sell-whisky', sellWhiskyRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'ViticultWhisky API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'PATCH /api/auth/reset-password/:token',
        verifyEmail: 'GET /api/auth/verify-email/:token',
        getMe: 'GET /api/auth/me',
        updatePassword: 'PATCH /api/auth/update-password',
        updateProfile: 'PATCH /api/auth/update-me',
        deleteAccount: 'DELETE /api/auth/delete-me',
        adminLogin: 'POST /api/auth/admin/login',
        adminChangePassword: 'POST /api/auth/admin/change-password (admin)',
        adminExportSubmissions: 'GET /api/auth/admin/export-submissions (admin)'
      },
      contact: {
        submit: 'POST /api/contact',
        getAll: 'GET /api/contact (admin)',
        getOne: 'GET /api/contact/:id (admin)',
        updateStatus: 'PATCH /api/contact/:id/status (admin)',
        delete: 'DELETE /api/contact/:id (admin)'
      },
      consultation: 'POST /api/consultation',
      blog: {
        getAll: 'GET /api/blog/posts',
        getOne: 'GET /api/blog/posts/:slug',
        getCategories: 'GET /api/blog/categories'
      },
      sellWhisky: 'POST /api/sell-whisky'
    }
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  // console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // console.error('Error:', err);
  // console.error('Stack:', err.stack);
  process.exit(1);
});

module.exports = app;