const mongoose = require('mongoose');

const consentLogSchema = new mongoose.Schema({
  preferences: {
    necessary: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    functional: { type: Boolean, default: false },
    timestamp: String,
    ipAddress: String,
    userAgent: String,
    version: String
  },
  method: {
    type: String,
    enum: ['banner', 'preferences', 'api', 'implied'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  url: String,
  userAgent: String,
  hashedIp: String,
  rawIp: String, // Temporarily store for location, then delete
  location: {
    country: String,
    region: String,
    city: String
  },
  visitorId: String,
  email: String, // Hashed
  action: {
    type: String,
    enum: ['granted', 'denied', 'updated', 'withdrawn'],
    default: 'granted'
  }
}, {
  timestamps: true
});

// Index for compliance reporting
consentLogSchema.index({ timestamp: -1 });
consentLogSchema.index({ 'preferences.analytics': 1 });
consentLogSchema.index({ 'preferences.marketing': 1 });
consentLogSchema.index({ method: 1 });
consentLogSchema.index({ action: 1 });

module.exports = mongoose.model('ConsentLog', consentLogSchema);