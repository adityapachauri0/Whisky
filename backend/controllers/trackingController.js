const Visitor = require('../models/Visitor');
const geoip = require('geoip-lite');
const getClientIp = require('../utils/getClientIp');

// Capture form field data in real-time
exports.captureFieldData = async (req, res) => {
  try {
    const { visitorId, fieldName, fieldValue, formType, timestamp, pageUrl } = req.body;
    const ipAddress = await getClientIp(req);
    console.log('🔍 CAPTURE REQUEST:', { visitorId, fieldName, fieldValue, formType, ipAddress });
    
    // Find or create visitor
    let visitor = await Visitor.findOne({ visitorId });
    console.log('🔍 EXISTING VISITOR:', visitor ? 'Found' : 'Not found');
    
    if (!visitor) {
      console.log('🔍 CREATING NEW VISITOR');
      visitor = new Visitor({
        visitorId,
        fingerprint: 'unknown', // Required field
        status: 'prospect',
        ipAddress: ipAddress,
        formInteractions: [],
        behavior: {
          totalPageViews: 0,
          totalTimeSpent: 0,
          interests: [],
          engagementScore: 0,
          leadScore: 0
        }
      });
    }
    
    // Update visitor status to identified if we get personal data
    if (fieldName === 'email' && fieldValue) {
      visitor.email = fieldValue;
      visitor.status = 'identified';
    }
    
    if (fieldName === 'name' && fieldValue) {
      visitor.name = fieldValue;
      // Extract first and last name
      const nameParts = fieldValue.split(' ');
      visitor.firstName = nameParts[0];
      visitor.lastName = nameParts.slice(1).join(' ');
    }
    
    if (fieldName === 'phone' && fieldValue) {
      visitor.phone = fieldValue;
    }
    
    // Track form interaction
    const formInteraction = visitor.formInteractions.find(f => f.formId === formType);
    if (formInteraction) {
      const field = formInteraction.fields.find(f => f.name === fieldName);
      if (field) {
        field.interacted = true;
        field.completed = true;
        field.lastValue = fieldValue;
        field.lastUpdated = new Date();
      } else {
        formInteraction.fields.push({
          name: fieldName,
          interacted: true,
          completed: true,
          lastValue: fieldValue,
          lastUpdated: new Date()
        });
      }
    } else {
      visitor.formInteractions.push({
        formId: formType,
        fields: [{
          name: fieldName,
          interacted: true,
          completed: true,
          lastValue: fieldValue,
          lastUpdated: new Date()
        }],
        abandoned: false,
        timestamp: new Date()
      });
    }
    
    // Update engagement score
    console.log('🔍 UPDATING ENGAGEMENT SCORE');
    // Ensure behavior object exists
    if (!visitor.behavior) {
      visitor.behavior = {
        totalPageViews: 0,
        totalTimeSpent: 0,
        interests: [],
        engagementScore: 0,
        leadScore: 0
      };
    }
    visitor.behavior.engagementScore = Math.min(100, (visitor.behavior.engagementScore || 0) + 5);
    
    // Calculate lead score
    console.log('🔍 CALCULATING LEAD SCORE');
    try {
      visitor.calculateLeadScore();
      console.log('✅ LEAD SCORE CALCULATED:', visitor.behavior.leadScore);
    } catch (scoreError) {
      console.error('❌ LEAD SCORE ERROR:', scoreError);
      // Set default score if calculation fails
      visitor.behavior.leadScore = 10;
    }
    
    console.log('🔍 SAVING VISITOR...');
    await visitor.save();
    console.log('✅ VISITOR SAVED SUCCESSFULLY');
    
    console.log(`📝 Captured ${fieldName} for visitor ${visitorId}`);
    
    res.status(200).json({
      success: true,
      message: `Field ${fieldName} captured`,
      visitorStatus: visitor.status,
      leadScore: visitor.behavior.leadScore
    });
  } catch (error) {
    console.error('❌ FIELD CAPTURE ERROR:', error);
    console.error('❌ ERROR STACK:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to capture field data',
      details: error.message 
    });
  }
};

// Track visitor data
exports.trackVisitor = async (req, res) => {
  try {
    const visitorData = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    // Add server-side IP geolocation if not provided
    if (!visitorData.location && ip) {
      const geo = geoip.lookup(ip);
      if (geo) {
        visitorData.location = {
          country: geo.country,
          city: geo.city,
          region: geo.region,
          timezone: geo.timezone,
          coordinates: {
            lat: geo.ll[0],
            lng: geo.ll[1]
          }
        };
      }
    }

    // Find or create visitor
    let visitor = await Visitor.findOne({ visitorId: visitorData.visitorId });
    
    if (!visitor) {
      // New visitor
      visitor = new Visitor({
        ...visitorData,
        ipAddress: ip,
        sessions: [{
          sessionId: `session_${Date.now()}`,
          startTime: visitorData.session?.startTime || new Date(),
          pageViews: visitorData.session?.pageViews || 1,
          referrer: visitorData.referrer
        }]
      });
    } else {
      // Returning visitor
      visitor.lastVisit = new Date();
      visitor.totalVisits += 1;
      
      // Update location if changed
      if (visitorData.location) {
        visitor.location = visitorData.location;
      }
      
      // Update device info
      if (visitorData.device) {
        visitor.device = visitorData.device;
      }
      
      // Update behavior data
      if (visitorData.behavior) {
        visitor.behavior.totalPageViews += visitorData.session?.pageViews || 0;
        visitor.behavior.totalTimeSpent += visitorData.session?.totalTimeSpent || 0;
        
        // Merge interests
        const newInterests = visitorData.behavior.interests || [];
        newInterests.forEach(interest => {
          if (!visitor.behavior.interests.includes(interest)) {
            visitor.behavior.interests.push(interest);
          }
        });
      }
      
      // Update pages visited
      if (visitorData.behavior?.pagesVisited) {
        visitorData.behavior.pagesVisited.forEach(newPage => {
          const existingPage = visitor.pagesVisited.find(p => p.url === newPage.url);
          if (existingPage) {
            existingPage.visits += 1;
            existingPage.totalTimeSpent += newPage.timeSpent;
            existingPage.averageTimeSpent = existingPage.totalTimeSpent / existingPage.visits;
            existingPage.maxScrollDepth = Math.max(existingPage.maxScrollDepth, newPage.scrollDepth);
            existingPage.clicks += newPage.clicks;
            existingPage.lastVisited = new Date();
          } else {
            visitor.pagesVisited.push({
              ...newPage,
              visits: 1,
              totalTimeSpent: newPage.timeSpent,
              averageTimeSpent: newPage.timeSpent,
              maxScrollDepth: newPage.scrollDepth,
              lastVisited: new Date()
            });
          }
        });
      }
      
      // Check if this is a new session (more than 30 minutes since last activity)
      const lastSession = visitor.sessions[visitor.sessions.length - 1];
      const timeSinceLastActivity = Date.now() - new Date(lastSession.endTime || lastSession.startTime).getTime();
      
      if (timeSinceLastActivity > 30 * 60 * 1000) {
        // New session
        visitor.sessions.push({
          sessionId: `session_${Date.now()}`,
          startTime: new Date(),
          pageViews: visitorData.session?.pageViews || 1,
          referrer: visitorData.referrer
        });
      } else {
        // Update current session
        lastSession.endTime = new Date();
        lastSession.pageViews += visitorData.session?.pageViews || 0;
        lastSession.duration = (new Date().getTime() - new Date(lastSession.startTime).getTime()) / 1000;
      }
    }
    
    // Update engagement and lead scores
    visitor.updateEngagement();
    visitor.calculateLeadScore();
    
    // Check if visitor should be upgraded to prospect
    if (visitor.behavior.leadScore > 30 && visitor.status === 'anonymous') {
      visitor.status = 'prospect';
    }
    
    await visitor.save();
    
    res.status(200).json({
      success: true,
      visitorId: visitor.visitorId,
      status: visitor.status,
      engagementScore: visitor.behavior.engagementScore,
      leadScore: visitor.behavior.leadScore
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(200).json({ success: true }); // Don't fail tracking
  }
};

// Track events
exports.trackEvent = async (req, res) => {
  try {
    const { visitorId, category, action, label, value } = req.body;
    
    const visitor = await Visitor.findOne({ visitorId });
    if (visitor) {
      visitor.events.push({
        category,
        action,
        label,
        value,
        timestamp: new Date()
      });
      
      // Update engagement based on event
      if (category === 'Form Interaction') {
        visitor.behavior.engagementScore = Math.min(100, visitor.behavior.engagementScore + 5);
      }
      
      await visitor.save();
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(200).json({ success: true });
  }
};

// Identify visitor (when they provide contact info)
exports.identifyVisitor = async (req, res) => {
  try {
    const { visitorId, email, name, phone } = req.body;
    
    const visitor = await Visitor.findOne({ visitorId });
    if (visitor) {
      if (email) visitor.email = email;
      if (name) visitor.name = name;
      if (phone) visitor.phone = phone;
      
      // Upgrade status
      if (visitor.status === 'anonymous' || visitor.status === 'prospect') {
        visitor.status = 'identified';
      }
      
      // Boost lead score
      visitor.calculateLeadScore();
      
      await visitor.save();
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Identify visitor error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get visitor analytics for admin
exports.getVisitorAnalytics = async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // Calculate date range
    let dateFilter = {};
    const now = new Date();
    switch (timeframe) {
      case '24h':
        dateFilter = { lastVisit: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { lastVisit: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { lastVisit: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }
    
    // Get overview stats
    const totalVisitors = await Visitor.countDocuments(dateFilter);
    const identifiedVisitors = await Visitor.countDocuments({ ...dateFilter, status: { $ne: 'anonymous' } });
    const highEngagement = await Visitor.countDocuments({ ...dateFilter, 'behavior.engagementScore': { $gte: 50 } });
    const qualifiedLeads = await Visitor.countDocuments({ ...dateFilter, 'behavior.leadScore': { $gte: 50 } });
    
    // Get top pages
    const topPages = await Visitor.aggregate([
      { $match: dateFilter },
      { $unwind: '$pagesVisited' },
      {
        $group: {
          _id: '$pagesVisited.url',
          title: { $first: '$pagesVisited.title' },
          totalVisits: { $sum: '$pagesVisited.visits' },
          avgTimeSpent: { $avg: '$pagesVisited.averageTimeSpent' },
          avgScrollDepth: { $avg: '$pagesVisited.maxScrollDepth' }
        }
      },
      { $sort: { totalVisits: -1 } },
      { $limit: 10 }
    ]);
    
    // Get visitor sources
    const sources = await Visitor.aggregate([
      { $match: dateFilter },
      { $unwind: '$sessions' },
      {
        $group: {
          _id: '$sessions.referrer.source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get device breakdown
    const devices = await Visitor.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$device.type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get location breakdown
    const locations = await Visitor.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent visitors with high engagement
    const recentEngaged = await Visitor.find({
      ...dateFilter,
      'behavior.engagementScore': { $gte: 30 }
    })
      .sort({ lastVisit: -1 })
      .limit(20)
      .select('visitorId email name status behavior.engagementScore behavior.leadScore lastVisit totalVisits behavior.interests');
    
    res.json({
      overview: {
        totalVisitors,
        identifiedVisitors,
        identificationRate: totalVisitors > 0 ? (identifiedVisitors / totalVisitors * 100).toFixed(1) : 0,
        highEngagement,
        engagementRate: totalVisitors > 0 ? (highEngagement / totalVisitors * 100).toFixed(1) : 0,
        qualifiedLeads
      },
      topPages,
      sources,
      devices,
      locations,
      recentEngaged
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get visitors with captured form data
exports.getCapturedFormData = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      $or: [
        { email: { $exists: true, $ne: null } },
        { name: { $exists: true, $ne: null } },
        { phone: { $exists: true, $ne: null } }
      ]
    })
      .select('visitorId email name firstName lastName phone ipAddress status behavior.leadScore behavior.engagementScore formInteractions lastVisit createdAt')
      .sort({ lastVisit: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: visitors.length,
      visitors: visitors.map(v => ({
        visitorId: v.visitorId,
        email: v.email,
        name: v.name,
        firstName: v.firstName,
        lastName: v.lastName,
        phone: v.phone,
        ipAddress: v.ipAddress,
        status: v.status,
        leadScore: v.behavior?.leadScore || 0,
        engagementScore: v.behavior?.engagementScore || 0,
        formFields: v.formInteractions?.flatMap(f => 
          f.fields.filter(field => field.lastValue).map(field => ({
            form: f.formId,
            field: field.name,
            value: field.lastValue,
            updated: field.lastUpdated
          }))
        ) || [],
        lastVisit: v.lastVisit,
        firstSeen: v.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching captured data:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get individual visitor details
exports.getVisitorDetails = async (req, res) => {
  try {
    const { visitorId } = req.params;
    
    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    res.json(visitor);
  } catch (error) {
    console.error('Get visitor error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export visitors data
exports.exportVisitors = async (req, res) => {
  try {
    const { status, minLeadScore } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (minLeadScore) filter['behavior.leadScore'] = { $gte: parseInt(minLeadScore) };
    
    const visitors = await Visitor.find(filter)
      .select('visitorId email name phone status behavior.leadScore behavior.engagementScore behavior.interests firstVisit lastVisit totalVisits')
      .sort({ 'behavior.leadScore': -1 });
    
    res.json(visitors);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk delete visitors
exports.bulkDeleteVisitors = async (req, res) => {
  try {
    const { visitorIds } = req.body;
    
    if (!visitorIds || !Array.isArray(visitorIds) || visitorIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'visitorIds array is required' 
      });
    }
    
    console.log(`🗑️ Bulk deleting ${visitorIds.length} visitors:`, visitorIds);
    
    const result = await Visitor.deleteMany({
      visitorId: { $in: visitorIds }
    });
    
    console.log(`✅ Successfully deleted ${result.deletedCount} visitors`);
    
    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} visitors`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};