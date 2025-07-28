const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  // Google Tag Manager
  gtm: {
    containerId: {
      type: String,
      default: '',
      match: [/^GTM-[A-Z0-9]+$/, 'Invalid GTM container ID format']
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  
  // Google Search Console
  searchConsole: {
    verificationCode: {
      type: String,
      default: '',
      description: 'HTML tag content value for verification'
    },
    sitemapUrl: {
      type: String,
      default: '/sitemap.xml'
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  
  // Google Analytics
  googleAnalytics: {
    measurementId: {
      type: String,
      default: '',
      match: [/^G-[A-Z0-9]+$/, 'Invalid GA4 Measurement ID format']
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  
  // SEO Settings
  seo: {
    defaultTitle: {
      type: String,
      default: 'ViticultWhisky - Premium Cask Investment'
    },
    defaultDescription: {
      type: String,
      default: 'Invest in premium Scottish whisky casks. Secure, sustainable, and profitable alternative investments.'
    },
    defaultKeywords: {
      type: [String],
      default: ['whisky investment', 'cask investment', 'scottish whisky', 'alternative investment']
    },
    robotsTxt: {
      type: String,
      default: `User-agent: *
Disallow: /admin
Disallow: /api/
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`
    }
  },
  
  // Social Media
  socialMedia: {
    ogImage: {
      type: String,
      default: '/whisky/hero/viticult_whisky_cask_investment43.webp'
    },
    twitterHandle: {
      type: String,
      default: ''
    },
    facebookAppId: {
      type: String,
      default: ''
    }
  },
  
  // Last updated
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  collection: 'siteconfig',
  timestamps: true
});

// Ensure only one config document exists
siteConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('SiteConfig', siteConfigSchema);