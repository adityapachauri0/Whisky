const mongoose = require('mongoose');

const sellWhiskySchema = new mongoose.Schema({
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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  caskType: {
    type: String,
    required: [true, 'Cask type is required'],
    trim: true,
    enum: ['Ex-Bourbon', 'Ex-Sherry', 'Virgin Oak', 'Refill', 'Other'],
    maxlength: [50, 'Cask type cannot be more than 50 characters']
  },
  distillery: {
    type: String,
    required: [true, 'Distillery is required'],
    trim: true,
    maxlength: [100, 'Distillery name cannot be more than 100 characters']
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    match: [/^(19|20)\d{2}$/, 'Please provide a valid year']
  },
  litres: {
    type: String,
    trim: true
  },
  abv: {
    type: String,
    trim: true
  },
  askingPrice: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'evaluating', 'offer-made', 'sold', 'closed'],
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
sellWhiskySchema.index({ email: 1, createdAt: -1 });
sellWhiskySchema.index({ status: 1 });
sellWhiskySchema.index({ distillery: 1 });

module.exports = mongoose.model('SellWhisky', sellWhiskySchema);