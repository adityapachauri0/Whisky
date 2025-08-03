const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');
const { protect, restrictTo } = require('../middleware/auth');
const { verifyAdmin } = require('../controllers/admin.controller');

// Get public configuration (for frontend)
router.get('/public', async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    
    // Debug logging for GTM issue
    console.log('[GTM DEBUG] Full config from database:', JSON.stringify(config, null, 2));
    console.log('[GTM DEBUG] config.gtm:', config.gtm);
    console.log('[GTM DEBUG] config.gtm?.enabled:', config.gtm?.enabled);
    
    // Only send enabled services with safe property access
    const publicConfig = {
      gtm: (config.gtm && config.gtm.enabled) ? { containerId: config.gtm.containerId, enabled: true } : null,
      searchConsole: (config.searchConsole && config.searchConsole.enabled) ? { 
        verificationCode: config.searchConsole.verificationCode 
      } : null,
      googleAnalytics: (config.googleAnalytics && config.googleAnalytics.enabled) ? { 
        measurementId: config.googleAnalytics.measurementId 
      } : null,
      seo: {
        defaultTitle: config.seo?.defaultTitle || 'ViticultWhisky - Premium Cask Investment',
        defaultDescription: config.seo?.defaultDescription || 'Invest in premium Scottish whisky casks',
        defaultKeywords: config.seo?.defaultKeywords || ['whisky investment', 'cask investment']
      },
      socialMedia: config.socialMedia || {}
    };
    
    console.log('[GTM DEBUG] Final publicConfig.gtm:', publicConfig.gtm);
    
    res.json(publicConfig);
  } catch (error) {
    console.error('[GTM DEBUG] Error fetching public config:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Get robots.txt content
router.get('/robots.txt', async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    res.type('text/plain');
    res.send(config.seo.robotsTxt);
  } catch (error) {
    // console.error('Error fetching robots.txt:', error);
    res.status(500).send('User-agent: *\nDisallow: /admin');
  }
});

// Get sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://yourdomain.com';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/how-it-works</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/buy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/sell</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
    
    res.type('application/xml');
    res.send(sitemap);
  } catch (error) {
    // console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

// Admin routes (protected)
// Get full configuration
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    res.json(config);
  } catch (error) {
    // console.error('Error fetching admin config:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Update configuration
router.put('/admin', verifyAdmin, async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    
    // Update fields
    if (req.body.gtm) {
      config.gtm = { ...config.gtm, ...req.body.gtm };
    }
    if (req.body.searchConsole) {
      config.searchConsole = { ...config.searchConsole, ...req.body.searchConsole };
    }
    if (req.body.googleAnalytics) {
      config.googleAnalytics = { ...config.googleAnalytics, ...req.body.googleAnalytics };
    }
    if (req.body.seo) {
      config.seo = { ...config.seo, ...req.body.seo };
    }
    if (req.body.socialMedia) {
      config.socialMedia = { ...config.socialMedia, ...req.body.socialMedia };
    }
    
    config.updatedBy = req.user.username || 'admin';
    config.updatedAt = new Date();
    
    await config.save();
    
    res.json({ 
      message: 'Configuration updated successfully',
      config 
    });
  } catch (error) {
    // console.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Test GTM configuration
router.post('/admin/test-gtm', verifyAdmin, async (req, res) => {
  try {
    const { containerId } = req.body;
    
    // Basic validation
    if (!containerId || !containerId.match(/^GTM-[A-Z0-9]+$/)) {
      return res.status(400).json({ 
        error: 'Invalid GTM container ID format. Should be like GTM-XXXXXXX' 
      });
    }
    
    res.json({ 
      message: 'GTM container ID format is valid',
      containerId 
    });
  } catch (error) {
    // console.error('Error testing GTM:', error);
    res.status(500).json({ error: 'Failed to test GTM configuration' });
  }
});

// Generate Google Search Console verification file
router.get('/admin/search-console-file/:filename', async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    const { filename } = req.params;
    
    // Check if this matches the expected format
    if (filename.match(/^google[a-f0-9]+\.html$/)) {
      res.type('text/html');
      res.send(`google-site-verification: ${filename}`);
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    // console.error('Error generating verification file:', error);
    res.status(500).send('Error');
  }
});

module.exports = router;