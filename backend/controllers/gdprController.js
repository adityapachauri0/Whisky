const Visitor = require('../models/Visitor');
const Contact = require('../models/Contact');
const ConsentLog = require('../models/ConsentLog');
const crypto = require('crypto');

// Log consent preferences
exports.logConsent = async (req, res) => {
  try {
    const { preferences, method, timestamp, url, userAgent } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    // Hash IP for privacy
    const hashedIp = crypto.createHash('sha256').update(ip).digest('hex');
    
    const consentLog = new ConsentLog({
      preferences,
      method,
      timestamp,
      url,
      userAgent,
      hashedIp,
      rawIp: ip // Store temporarily for location lookup, then delete
    });
    
    await consentLog.save();
    
    // Remove raw IP after saving
    consentLog.rawIp = undefined;
    await consentLog.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Consent logging error:', error);
    res.status(200).json({ success: true }); // Don't fail consent
  }
};

// Handle data deletion request (Right to Erasure)
exports.deleteUserData = async (req, res) => {
  try {
    const { visitorId, email } = req.body;
    
    // Delete visitor tracking data
    if (visitorId) {
      await Visitor.findOneAndDelete({ visitorId });
    }
    
    // Delete contact form submissions if email provided
    if (email) {
      await Contact.updateMany(
        { email },
        { 
          $set: {
            name: 'DELETED',
            email: 'deleted@deleted.com',
            phone: 'DELETED',
            message: 'Data deleted per GDPR request',
            deleted: true,
            deletedAt: new Date()
          }
        }
      );
    }
    
    // Log the deletion request
    const deletionLog = {
      timestamp: new Date(),
      visitorId,
      email: email ? crypto.createHash('sha256').update(email).digest('hex') : null,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    
    console.log('GDPR Deletion Request:', deletionLog);
    
    res.json({ 
      success: true, 
      message: 'Your data has been deleted successfully' 
    });
  } catch (error) {
    console.error('GDPR deletion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing deletion request' 
    });
  }
};

// Export user data (Right to Data Portability)
exports.exportUserData = async (req, res) => {
  try {
    const { visitorId, email } = req.body;
    
    let userData = {
      exportDate: new Date().toISOString(),
      dataSubject: {},
      trackingData: null,
      contactSubmissions: [],
      consentHistory: []
    };
    
    // Get visitor tracking data
    if (visitorId) {
      const visitor = await Visitor.findOne({ visitorId }).lean();
      if (visitor) {
        // Remove sensitive fields
        delete visitor._id;
        delete visitor.__v;
        userData.trackingData = visitor;
      }
    }
    
    // Get contact submissions
    if (email) {
      const contacts = await Contact.find({ email, deleted: { $ne: true } })
        .select('-_id -__v')
        .lean();
      userData.contactSubmissions = contacts;
      
      // Get consent history
      const consents = await ConsentLog.find({ 
        'preferences.email': email 
      })
        .select('-_id -__v -rawIp -hashedIp')
        .lean();
      userData.consentHistory = consents;
    }
    
    // Add data subject info
    userData.dataSubject = {
      visitorId,
      email,
      exportRequestDate: new Date().toISOString(),
      ip: 'hidden for privacy'
    };
    
    res.json({
      success: true,
      data: userData,
      format: 'json',
      message: 'Your data has been exported successfully'
    });
  } catch (error) {
    console.error('GDPR export error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error exporting data' 
    });
  }
};

// Update user data (Right to Rectification)
exports.updateUserData = async (req, res) => {
  try {
    const { email, updates } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required for data update' 
      });
    }
    
    // Update contact records
    await Contact.updateMany(
      { email },
      { $set: updates }
    );
    
    // Log the update
    console.log('GDPR Update Request:', {
      email: crypto.createHash('sha256').update(email).digest('hex'),
      updates: Object.keys(updates),
      timestamp: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Your data has been updated successfully' 
    });
  } catch (error) {
    console.error('GDPR update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating data' 
    });
  }
};

// Get privacy rights based on location
exports.getPrivacyRights = async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);
    
    let rights = {
      gdpr: false,
      ccpa: false,
      rights: [],
      jurisdiction: 'Unknown'
    };
    
    if (geo) {
      // Check for GDPR (EU/UK/EEA)
      const gdprCountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO'
      ];
      
      if (gdprCountries.includes(geo.country)) {
        rights.gdpr = true;
        rights.jurisdiction = `${geo.country} (GDPR)`;
        rights.rights = [
          'Right to be informed',
          'Right of access',
          'Right to rectification',
          'Right to erasure',
          'Right to restrict processing',
          'Right to data portability',
          'Right to object',
          'Rights in relation to automated decision making'
        ];
      }
      
      // Check for CCPA (California)
      if (geo.country === 'US' && geo.region === 'CA') {
        rights.ccpa = true;
        rights.jurisdiction = 'California, USA (CCPA)';
        rights.rights = [
          'Right to know',
          'Right to delete',
          'Right to opt-out',
          'Right to non-discrimination'
        ];
      }
    }
    
    // Default rights for all users
    if (rights.rights.length === 0) {
      rights.rights = [
        'Right to access your data',
        'Right to correct your data',
        'Right to delete your data',
        'Right to opt-out of tracking'
      ];
      rights.jurisdiction = 'General';
    }
    
    res.json({
      success: true,
      ...rights,
      contactEmail: 'privacy@viticultwhisky.co.uk',
      dataProtectionOfficer: 'dpo@viticultwhisky.co.uk'
    });
  } catch (error) {
    console.error('Privacy rights error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error determining privacy rights' 
    });
  }
};

// Handle opt-out requests
exports.optOut = async (req, res) => {
  try {
    const { visitorId, email, optOutType } = req.body;
    
    // Create opt-out record
    const optOutRecord = {
      visitorId,
      email: email ? crypto.createHash('sha256').update(email).digest('hex') : null,
      optOutType, // 'all', 'marketing', 'analytics'
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    
    // Update visitor record
    if (visitorId) {
      await Visitor.findOneAndUpdate(
        { visitorId },
        { 
          $set: { 
            'marketingConsent.email': false,
            'marketingConsent.sms': false,
            'marketingConsent.phone': false,
            optedOut: true,
            optOutDate: new Date()
          }
        }
      );
    }
    
    // Update contact records
    if (email) {
      await Contact.updateMany(
        { email },
        { 
          $set: { 
            marketingConsent: false,
            optedOut: true 
          }
        }
      );
    }
    
    console.log('Opt-out request:', optOutRecord);
    
    res.json({ 
      success: true, 
      message: 'You have been successfully opted out' 
    });
  } catch (error) {
    console.error('Opt-out error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing opt-out request' 
    });
  }
};