const mongoose = require('mongoose');

const investmentInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  investmentType: {
    type: String,
    enum: ['cask', 'portfolio', 'both', 'not-sure'],
    default: 'not-sure'
  },
  budget: {
    type: String,
    enum: ['starter', 'premium', 'exclusive', 'custom'],
    default: 'not-sure'
  },
  timeline: {
    type: String,
    enum: ['immediate', '1-3-months', '3-6-months', '6-12-months', 'over-12-months'],
    default: 'immediate'
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'converted', 'closed'],
    default: 'new'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const InvestmentInquiry = mongoose.model('InvestmentInquiry', investmentInquirySchema);

module.exports = InvestmentInquiry;