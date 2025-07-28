const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
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
    required: [true, 'Phone number is required for consultations'],
    trim: true,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred consultation date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Consultation date must be in the future'
    }
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required'],
    enum: ['morning', 'afternoon', 'evening']
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    default: 'UTC'
  },
  investmentBudget: {
    type: String,
    enum: ['under-10k', '10k-25k', '25k-50k', '50k-100k', 'above-100k'],
    required: [true, 'Investment budget range is required']
  },
  investmentExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'experienced', 'expert'],
    required: [true, 'Investment experience level is required']
  },
  interestedIn: [{
    type: String,
    enum: ['single-casks', 'cask-portfolios', 'rare-bottles', 'investment-advice', 'market-insights']
  }],
  additionalInfo: {
    type: String,
    maxlength: [1000, 'Additional information cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  consultantAssigned: {
    type: String
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

// Index for efficient querying
consultationSchema.index({ preferredDate: 1, status: 1 });
consultationSchema.index({ email: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);