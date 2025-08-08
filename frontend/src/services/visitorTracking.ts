import FingerprintJS from '@fingerprintjs/fingerprintjs';
import ReactGA from 'react-ga4';
import api from './api';
import consentManager from './consentManager';

interface VisitorData {
  visitorId: string;
  fingerprint: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
  };
  device: {
    type: string;
    os: string;
    browser: string;
    screenResolution: string;
    language: string;
    platform: string;
  };
  referrer: {
    source: string;
    medium?: string;
    campaign?: string;
  };
  session: {
    startTime: Date;
    lastActivity: Date;
    pageViews: number;
    totalTimeSpent: number;
  };
  behavior: {
    pagesVisited: Array<{
      url: string;
      title: string;
      timeSpent: number;
      scrollDepth: number;
      clicks: number;
      timestamp: Date;
    }>;
    interests: string[];
    engagementScore: number;
  };
}

class VisitorTrackingService {
  private visitorId: string | null = null;
  private fingerprint: string | null = null;
  private sessionStartTime: Date = new Date();
  private pageStartTime: Date = new Date();
  private currentPageData: any = {};
  private scrollDepth: number = 0;
  private clicks: number = 0;
  private visitorData: Partial<VisitorData> = {};

  async initialize() {
    // Always start minimal tracking for form capture functionality
    // Full analytics tracking still requires consent
    await this.startMinimalTracking();
    
    // Check if we have consent for full analytics
    if (consentManager.hasConsentFor('analytics')) {
      console.log('Analytics consent granted. Starting full tracking.');
      await this.startFullTracking();
    } else {
      console.log('Analytics consent not granted. Using minimal tracking for form capture only.');
    }
    
    // Listen for consent changes
    consentManager.onConsentChange((consent) => {
      if (consent.analytics) {
        this.startFullTracking();
      } else {
        this.stopFullTracking();
      }
    });
  }

  private async startTracking() {
    // Initialize Google Analytics
    ReactGA.initialize('G-XXXXXXXXXX'); // Replace with actual GA4 ID in production
    
    // Generate visitor fingerprint
    await this.generateFingerprint();
    
    // Capture initial visitor data
    await this.captureVisitorData();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start session tracking
    this.startSessionTracking();
    
    // Send initial data to backend
    await this.sendVisitorData();
  }

  private stopTracking() {
    // Remove event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('scroll', this.throttle(this.handleScroll.bind(this), 500));
    document.removeEventListener('click', this.handleClick.bind(this));
    document.removeEventListener('focus', this.handleFormFocus.bind(this), true);
    document.removeEventListener('change', this.handleFormChange.bind(this), true);
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // Clear any tracking data
    this.visitorId = null;
    this.fingerprint = null;
    this.visitorData = {};
  }

  private async startMinimalTracking() {
    // Generate visitor fingerprint for form identification
    await this.generateFingerprint();
    
    // Capture basic visitor data (no analytics)
    await this.captureBasicVisitorData();
    
    // Only set up form event listeners, no analytics tracking
    this.setupFormEventListeners();
  }

  private async startFullTracking() {
    // Initialize Google Analytics
    ReactGA.initialize('G-XXXXXXXXXX'); // Replace with actual GA4 ID in production
    
    // Generate visitor fingerprint
    await this.generateFingerprint();
    
    // Capture full visitor data
    await this.captureVisitorData();
    
    // Set up all event listeners including analytics
    this.setupEventListeners();
    
    // Start session tracking
    this.startSessionTracking();
    
    // Send initial data to backend
    await this.sendVisitorData();
  }

  private stopFullTracking() {
    // Remove analytics-specific event listeners while keeping form listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('scroll', this.throttle(this.handleScroll.bind(this), 500));
    document.removeEventListener('click', this.handleClick.bind(this));
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    document.removeEventListener('mousemove', this.throttle(this.handleMouseMove.bind(this), 1000));
    
    // Keep form listeners for capture functionality
    // Don't clear visitor ID as we need it for form capture
  }

  private async captureBasicVisitorData() {
    // Minimal data capture for form functionality only
    this.visitorData = {
      visitorId: this.visitorId!,
      fingerprint: this.fingerprint!,
      session: {
        startTime: this.sessionStartTime,
        lastActivity: new Date(),
        pageViews: 1,
        totalTimeSpent: 0
      },
      behavior: {
        pagesVisited: [],
        interests: [],
        engagementScore: 0
      }
    };
  }

  private setupFormEventListeners() {
    // Only set up form-related event listeners for capture functionality
    document.addEventListener('focus', this.handleFormFocus.bind(this), true);
    document.addEventListener('change', this.handleFormChange.bind(this), true);
  }

  private async generateFingerprint() {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.fingerprint = result.visitorId;
      this.visitorId = `visitor_${this.fingerprint}_${Date.now()}`;
      
      // Store in localStorage for returning visitor identification
      const storedVisitorId = localStorage.getItem('visitorId');
      if (!storedVisitorId) {
        localStorage.setItem('visitorId', this.visitorId);
        localStorage.setItem('firstVisit', new Date().toISOString());
      } else {
        this.visitorId = storedVisitorId;
      }
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      this.visitorId = `visitor_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    }
  }

  private async captureVisitorData() {
    // Get IP and location data (would need backend API or service)
    const ipData = await this.getIPData();
    
    // Capture device information
    const deviceData = this.getDeviceInfo();
    
    // Capture referrer information
    const referrerData = this.getReferrerInfo();
    
    // Initialize visitor data
    this.visitorData = {
      visitorId: this.visitorId!,
      fingerprint: this.fingerprint!,
      location: ipData?.location,
      device: deviceData,
      referrer: referrerData,
      session: {
        startTime: this.sessionStartTime,
        lastActivity: new Date(),
        pageViews: 1,
        totalTimeSpent: 0
      },
      behavior: {
        pagesVisited: [],
        interests: [],
        engagementScore: 0
      }
    };
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    
    // Detect device type
    let deviceType = 'desktop';
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      deviceType = /iPad/i.test(ua) ? 'tablet' : 'mobile';
    }
    
    // Detect OS
    let os = 'Unknown';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'MacOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iOS|iPhone|iPad/i.test(ua)) os = 'iOS';
    
    // Detect browser
    let browser = 'Unknown';
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Edge/i.test(ua)) browser = 'Edge';
    
    return {
      type: deviceType,
      os,
      browser,
      screenResolution: screenRes,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  private getReferrerInfo() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    let source = 'direct';
    let medium = undefined;
    let campaign = undefined;
    
    if (referrer) {
      const referrerUrl = new URL(referrer);
      const hostname = referrerUrl.hostname;
      
      // Detect source
      if (hostname.includes('google')) source = 'google';
      else if (hostname.includes('facebook')) source = 'facebook';
      else if (hostname.includes('twitter')) source = 'twitter';
      else if (hostname.includes('linkedin')) source = 'linkedin';
      else if (hostname.includes('instagram')) source = 'instagram';
      else source = hostname;
      
      // Check for organic vs paid
      medium = 'organic';
    }
    
    // Check UTM parameters
    if (urlParams.get('utm_source')) {
      source = urlParams.get('utm_source')!;
      medium = urlParams.get('utm_medium') || undefined;
      campaign = urlParams.get('utm_campaign') || undefined;
    }
    
    return { source, medium, campaign };
  }

  private async getIPData() {
    try {
      // In production, this would call your backend API which uses a service like ipapi or maxmind
      // For now, we'll use a free service for demo (replace with your backend endpoint)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ipAddress: data.ip,
        location: {
          country: data.country_name,
          city: data.city,
          region: data.region,
          timezone: data.timezone
        }
      };
    } catch (error) {
      console.error('Error getting IP data:', error);
      return null;
    }
  }

  private setupEventListeners() {
    // Track page visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Track scroll depth
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 500));
    
    // Track clicks
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Track form interactions (without submission)
    document.addEventListener('focus', this.handleFormFocus.bind(this), true);
    document.addEventListener('change', this.handleFormChange.bind(this), true);
    
    // Track before page unload
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // Track mouse movement for heat mapping
    document.addEventListener('mousemove', this.throttle(this.handleMouseMove.bind(this), 1000));
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause tracking
      this.updatePageTime();
    } else {
      // Page is visible again
      this.pageStartTime = new Date();
    }
  }

  private handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const currentScrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    
    if (currentScrollDepth > this.scrollDepth) {
      this.scrollDepth = currentScrollDepth;
      
      // Track scroll milestones
      if ([25, 50, 75, 90, 100].includes(this.scrollDepth)) {
        this.trackEvent('Scroll Depth', `${this.scrollDepth}%`, window.location.pathname);
      }
    }
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    this.clicks++;
    
    // Track specific elements
    const clickData = {
      element: target.tagName,
      className: target.className,
      id: target.id,
      text: target.innerText?.substring(0, 50),
      x: event.pageX,
      y: event.pageY,
      timestamp: new Date()
    };
    
    // Identify interest based on clicks
    this.identifyInterest(clickData);
    
    // Send click data
    this.trackEvent('Click', `${target.tagName}`, JSON.stringify(clickData));
  }

  private handleFormFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      this.trackEvent('Form Interaction', 'Field Focus', target.getAttribute('name') || target.id);
      
      // Mark as engaged visitor
      if (this.visitorData.behavior) {
        this.visitorData.behavior.engagementScore = Math.min(100, (this.visitorData.behavior.engagementScore || 0) + 10);
      }
    }
  }

  private handleFormChange(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      const fieldName = target.getAttribute('name') || target.id;
      
      // Track field interaction without capturing actual data
      this.trackEvent('Form Interaction', 'Field Change', fieldName);
      
      // Identify interest based on form field
      if (fieldName?.includes('investment') || fieldName?.includes('budget')) {
        this.addInterest('investment');
      }
      if (fieldName?.includes('cask') || fieldName?.includes('whisky')) {
        this.addInterest('whisky-cask');
      }
    }
  }

  private handleBeforeUnload() {
    // Send final tracking data before leaving
    this.updatePageTime();
    this.sendVisitorData(true);
  }

  private handleMouseMove(event: MouseEvent) {
    // Store mouse positions for heat mapping (sample every second)
    const heatMapData = {
      x: event.pageX,
      y: event.pageY,
      timestamp: Date.now()
    };
    
    // In production, batch these and send periodically
    this.storeHeatMapData(heatMapData);
  }

  private identifyInterest(clickData: any) {
    const text = (clickData.text || '').toLowerCase();
    
    if (text.includes('investment') || text.includes('invest')) {
      this.addInterest('investment');
    }
    if (text.includes('cask') || text.includes('whisky')) {
      this.addInterest('whisky-cask');
    }
    if (text.includes('premium') || text.includes('exclusive')) {
      this.addInterest('premium-investment');
    }
    if (text.includes('consultation') || text.includes('expert')) {
      this.addInterest('consultation');
    }
  }

  private addInterest(interest: string) {
    if (this.visitorData.behavior && !this.visitorData.behavior.interests.includes(interest)) {
      this.visitorData.behavior.interests.push(interest);
      this.visitorData.behavior.engagementScore = Math.min(100, (this.visitorData.behavior.engagementScore || 0) + 5);
    }
  }

  private updatePageTime() {
    const timeSpent = Math.round((new Date().getTime() - this.pageStartTime.getTime()) / 1000);
    
    if (this.visitorData.session) {
      this.visitorData.session.totalTimeSpent += timeSpent;
      this.visitorData.session.lastActivity = new Date();
    }
    
    return timeSpent;
  }

  private startSessionTracking() {
    // Update session every 30 seconds
    setInterval(() => {
      if (!document.hidden) {
        this.sendVisitorData();
      }
    }, 30000);
  }

  private storeHeatMapData(data: any) {
    // Store in memory or IndexedDB for batch sending
    // This is a placeholder - implement actual storage logic
    const heatMapKey = `heatmap_${this.visitorId}_${window.location.pathname}`;
    const existingData = JSON.parse(sessionStorage.getItem(heatMapKey) || '[]');
    existingData.push(data);
    
    // Keep only last 100 points per page
    if (existingData.length > 100) {
      existingData.shift();
    }
    
    sessionStorage.setItem(heatMapKey, JSON.stringify(existingData));
  }

  public trackPageView(pagePath?: string, pageTitle?: string) {
    const path = pagePath || window.location.pathname;
    const title = pageTitle || document.title;
    
    // Update page time for previous page
    if (this.currentPageData.url) {
      const timeSpent = this.updatePageTime();
      
      if (this.visitorData.behavior) {
        this.visitorData.behavior.pagesVisited.push({
          url: this.currentPageData.url,
          title: this.currentPageData.title,
          timeSpent,
          scrollDepth: this.scrollDepth,
          clicks: this.clicks,
          timestamp: this.pageStartTime
        });
      }
    }
    
    // Reset for new page
    this.pageStartTime = new Date();
    this.scrollDepth = 0;
    this.clicks = 0;
    this.currentPageData = { url: path, title };
    
    // Increment page views
    if (this.visitorData.session) {
      this.visitorData.session.pageViews++;
    }
    
    // Track in GA
    ReactGA.send({ hitType: 'pageview', page: path, title });
    
    // Send to backend
    this.sendVisitorData();
  }

  public trackEvent(category: string, action: string, label?: string, value?: number) {
    // Track in GA
    ReactGA.event({
      category,
      action,
      label,
      value
    });
    
    // Also send to our backend
    this.sendEventData({ category, action, label, value });
  }

  private async sendVisitorData(immediate: boolean = false) {
    try {
      const dataToSend = {
        ...this.visitorData,
        currentPage: this.currentPageData,
        timestamp: new Date()
      };
      
      // Use beacon API for immediate sends (page unload)
      if (immediate && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(dataToSend)], { type: 'application/json' });
        navigator.sendBeacon('/api/tracking/visitor', blob);
      } else {
        // Regular API call
        await api.post('/tracking/visitor', dataToSend);
      }
    } catch (error) {
      console.error('Error sending visitor data:', error);
    }
  }

  private async sendEventData(eventData: any) {
    try {
      await api.post('/tracking/event', {
        visitorId: this.visitorId,
        ...eventData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending event data:', error);
    }
  }

  private throttle(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    let previous = 0;
    
    return function(...args: any[]) {
      const now = Date.now();
      const remaining = wait - (now - previous);
      
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(null, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          timeout = null;
          func.apply(null, args);
        }, remaining);
      }
    };
  }

  // Public method to get current visitor data
  public getVisitorData() {
    return this.visitorData;
  }

  // Public method to manually identify a visitor (e.g., after they provide email)
  public identifyVisitor(userData: { email?: string; name?: string; phone?: string }) {
    this.visitorData = {
      ...this.visitorData,
      ...userData
    };
    
    // Update engagement score
    if (this.visitorData.behavior) {
      this.visitorData.behavior.engagementScore = Math.min(100, (this.visitorData.behavior.engagementScore || 0) + 20);
    }
    
    // Send updated data
    this.sendVisitorData();
  }
}

// Create singleton instance
const visitorTracking = new VisitorTrackingService();

export default visitorTracking;