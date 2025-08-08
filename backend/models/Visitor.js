const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fingerprint: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    sparse: true,
    index: true
  },
  name: String,
  firstName: String,
  lastName: String,
  phone: String,
  ipAddress: String,
  location: {
    country: String,
    city: String,
    region: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  device: {
    type: {
      type: String
    },
    os: String,
    browser: String,
    screenResolution: String,
    language: String,
    platform: String
  },
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  totalVisits: {
    type: Number,
    default: 1
  },
  sessions: [{
    sessionId: String,
    startTime: Date,
    endTime: Date,
    duration: Number, // in seconds
    pageViews: Number,
    events: Number,
    referrer: {
      source: String,
      medium: String,
      campaign: String
    },
    exitPage: String,
    bounced: Boolean
  }],
  behavior: {
    totalPageViews: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    averageSessionDuration: Number,
    interests: [String],
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    leadScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  pagesVisited: [{
    url: String,
    title: String,
    visits: Number,
    totalTimeSpent: Number,
    averageTimeSpent: Number,
    maxScrollDepth: Number,
    clicks: Number,
    lastVisited: Date
  }],
  events: [{
    category: String,
    action: String,
    label: String,
    value: Number,
    timestamp: Date
  }],
  formInteractions: [{
    formId: String,
    fields: [{
      name: String,
      interacted: Boolean,
      completed: Boolean,
      lastValue: String,
      lastUpdated: Date
    }],
    abandoned: Boolean,
    timestamp: Date
  }],
  heatMapData: [{
    page: String,
    data: mongoose.Schema.Types.Mixed, // Store coordinate data
    timestamp: Date
  }],
  conversions: [{
    type: String, // 'form_submission', 'consultation_booking', etc.
    value: mongoose.Schema.Types.Mixed,
    timestamp: Date
  }],
  tags: [String],
  notes: String,
  status: {
    type: String,
    enum: ['anonymous', 'identified', 'prospect', 'lead', 'customer'],
    default: 'anonymous'
  },
  marketingConsent: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    phone: { type: Boolean, default: false }
  },
  gdprConsent: {
    given: { type: Boolean, default: false },
    timestamp: Date,
    ip: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
visitorSchema.index({ 'location.country': 1 });
visitorSchema.index({ 'device.type': 1 });
visitorSchema.index({ 'behavior.engagementScore': -1 });
visitorSchema.index({ 'behavior.leadScore': -1 });
visitorSchema.index({ lastVisit: -1 });
visitorSchema.index({ status: 1 });

// Methods
visitorSchema.methods.calculateLeadScore = function() {
  let score = 0;
  
  // Engagement factors
  if (this.behavior.engagementScore > 50) score += 20;
  if (this.behavior.totalPageViews > 5) score += 15;
  if (this.behavior.totalTimeSpent > 300) score += 15; // 5+ minutes
  
  // Interest factors
  if (this.behavior.interests.includes('investment')) score += 20;
  if (this.behavior.interests.includes('premium-investment')) score += 10;
  
  // Identification factors
  if (this.email) score += 15;
  if (this.phone) score += 5;
  
  // Form interaction
  if (this.formInteractions.length > 0) score += 10;
  
  this.behavior.leadScore = Math.min(100, score);
  return this.behavior.leadScore;
};

visitorSchema.methods.updateEngagement = function() {
  // Calculate average session duration
  if (this.sessions.length > 0) {
    const totalDuration = this.sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    this.behavior.averageSessionDuration = totalDuration / this.sessions.length;
  }
  
  // Update engagement score based on various factors
  let engagement = 0;
  
  // Recency (last visit within 7 days)
  const daysSinceLastVisit = (Date.now() - this.lastVisit) / (1000 * 60 * 60 * 24);
  if (daysSinceLastVisit < 1) engagement += 30;
  else if (daysSinceLastVisit < 7) engagement += 20;
  else if (daysSinceLastVisit < 30) engagement += 10;
  
  // Frequency
  if (this.totalVisits > 5) engagement += 20;
  else if (this.totalVisits > 2) engagement += 10;
  
  // Duration
  if (this.behavior.averageSessionDuration > 180) engagement += 20; // 3+ minutes average
  else if (this.behavior.averageSessionDuration > 60) engagement += 10;
  
  // Depth
  if (this.behavior.totalPageViews / this.totalVisits > 3) engagement += 15;
  
  // Interests
  if (this.behavior.interests.length > 2) engagement += 15;
  
  this.behavior.engagementScore = Math.min(100, engagement);
  return this.behavior.engagementScore;
};

module.exports = mongoose.model('Visitor', visitorSchema);