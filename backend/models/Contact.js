const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  investmentInterest: {
    type: String,
    enum: ['starter', 'premium', 'exclusive', 'not-sure'],
    default: 'not-sure'
  },
  // Interest selection checkboxes (inspired by Bunnahabhain form)
  investmentPurposes: {
    type: Boolean,
    default: false
  },
  ownCask: {
    type: Boolean,
    default: false
  },
  giftPurpose: {
    type: Boolean,
    default: false
  },
  otherInterest: {
    type: Boolean,
    default: false
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'both'],
    default: 'email'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'converted', 'closed'],
    default: 'new'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for efficient querying
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);