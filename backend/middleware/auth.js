const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from header or cookie
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to access this resource.', 401));
    }

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please log in again.', 401));
      } else if (error.name === 'TokenExpiredError') {
        return next(new AppError('Your token has expired. Please log in again.', 401));
      }
      return next(error);
    }

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user is active
    if (!user.active) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // 5) Check if user changed password after token was issued
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('Password recently changed. Please log in again.', 401));
      }
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

// Check if user is logged in (for rendering pages)
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user || !user.active) {
        return next();
      }

      // User is logged in
      res.locals.user = user;
      return next();
    }
  } catch (error) {
    // Token is invalid, continue without user
    return next();
  }
  
  next();
};

// Verify email is verified
exports.verifyEmailVerified = async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return next(new AppError('Please verify your email address to access this resource.', 403));
  }
  next();
};

// Verify KYC is completed (for investment features)
exports.verifyKYC = async (req, res, next) => {
  if (!req.user.investorProfile || !req.user.investorProfile.kycCompleted) {
    return next(new AppError('Please complete KYC verification to access investment features.', 403));
  }
  next();
};

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
    
    // Clean up old entries
    if (Math.random() < 0.01) {
      for (const [userId, timestamps] of requests.entries()) {
        const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
        if (validTimestamps.length === 0) {
          requests.delete(userId);
        } else {
          requests.set(userId, validTimestamps);
        }
      }
    }
    
    next();
  };
};