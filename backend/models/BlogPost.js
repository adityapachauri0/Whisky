const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  featuredImage: {
    url: String,
    alt: String
  },
  category: {
    type: String,
    required: true,
    enum: ['investment-guide', 'market-insights', 'whisky-education', 'company-news', 'case-studies']
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  author: {
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title should be under 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description should be under 160 characters']
    },
    focusKeyword: String
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });

// Virtual for URL
blogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Pre-save middleware to generate slug
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);