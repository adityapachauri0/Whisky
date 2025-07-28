const session = require('express-session');
const MongoStore = require('connect-mongo');

// Ensure session secret is provided in production
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production environment');
}

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevents XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // Lazy session update
  })
};

// For production, ensure secure cookies
if (process.env.NODE_ENV === 'production') {
  sessionConfig.proxy = true; // Trust proxy
  sessionConfig.cookie.domain = '.viticultwhisky.co.uk'; // Set domain for cookies
}

module.exports = session(sessionConfig);