import Cookies from 'js-cookie';

export interface ConsentPreferences {
  necessary: boolean; // Always true - required cookies
  analytics: boolean; // Google Analytics, visitor tracking
  marketing: boolean; // Marketing cookies, retargeting
  functional: boolean; // Preferences, language settings
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  version: string;
}

export interface ConsentAuditLog {
  action: 'granted' | 'denied' | 'updated' | 'withdrawn';
  preferences: ConsentPreferences;
  timestamp: string;
  method: 'banner' | 'preferences' | 'api' | 'implied';
}

class ConsentManager {
  private static instance: ConsentManager;
  private consentKey = 'whisky_consent';
  private auditKey = 'whisky_consent_audit';
  private consentVersion = '1.0.0';
  private callbacks: ((consent: ConsentPreferences) => void)[] = [];

  private constructor() {}

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  // Check if user has given consent
  hasConsent(): boolean {
    const consent = this.getConsent();
    return consent !== null;
  }

  // Get current consent preferences
  getConsent(): ConsentPreferences | null {
    const stored = localStorage.getItem(this.consentKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check specific consent category
  hasConsentFor(category: keyof Omit<ConsentPreferences, 'timestamp' | 'ipAddress' | 'userAgent' | 'version'>): boolean {
    const consent = this.getConsent();
    if (!consent) return false;
    return consent[category] === true;
  }

  // Save consent preferences
  saveConsent(preferences: Partial<ConsentPreferences>, method: ConsentAuditLog['method'] = 'banner'): void {
    const fullPreferences: ConsentPreferences = {
      necessary: true, // Always required
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      functional: preferences.functional || false,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      version: this.consentVersion
    };

    // Store in localStorage for persistence
    localStorage.setItem(this.consentKey, JSON.stringify(fullPreferences));

    // Set cookie for server-side access
    Cookies.set(this.consentKey, JSON.stringify(fullPreferences), {
      expires: 365, // 1 year
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });

    // Log the consent action
    this.logConsentAction(
      preferences.analytics || preferences.marketing || preferences.functional ? 'granted' : 'denied',
      fullPreferences,
      method
    );

    // Apply consent preferences
    this.applyConsentPreferences(fullPreferences);

    // Notify callbacks
    this.callbacks.forEach(callback => callback(fullPreferences));

    // Send to backend for record keeping
    this.sendConsentToBackend(fullPreferences, method);
  }

  // Update consent preferences
  updateConsent(preferences: Partial<ConsentPreferences>): void {
    const current = this.getConsent();
    if (current) {
      const updated = { ...current, ...preferences, timestamp: new Date().toISOString() };
      this.saveConsent(updated, 'preferences');
      this.logConsentAction('updated', updated, 'preferences');
    }
  }

  // Withdraw all consent
  withdrawConsent(): void {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      version: this.consentVersion
    };

    this.saveConsent(preferences, 'preferences');
    this.logConsentAction('withdrawn', preferences, 'preferences');
    this.clearTrackingData();
  }

  // Apply consent preferences to tracking scripts
  private applyConsentPreferences(preferences: ConsentPreferences): void {
    // Google Analytics
    if (preferences.analytics) {
      // Enable GA
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'granted'
      });
      // Enable custom tracking
      window.trackingEnabled = true;
    } else {
      // Disable GA
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'denied'
      });
      // Disable custom tracking
      window.trackingEnabled = false;
      // Clear GA cookies
      this.clearGoogleAnalyticsCookies();
    }

    // Marketing cookies
    if (preferences.marketing) {
      window.gtag?.('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    } else {
      window.gtag?.('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
      this.clearMarketingCookies();
    }

    // Functional cookies
    if (!preferences.functional) {
      this.clearFunctionalCookies();
    }
  }

  // Log consent action for audit trail
  private logConsentAction(action: ConsentAuditLog['action'], preferences: ConsentPreferences, method: ConsentAuditLog['method']): void {
    const log: ConsentAuditLog = {
      action,
      preferences,
      timestamp: new Date().toISOString(),
      method
    };

    // Get existing audit log
    const existingLog = localStorage.getItem(this.auditKey);
    const auditTrail: ConsentAuditLog[] = existingLog ? JSON.parse(existingLog) : [];
    
    // Add new log entry
    auditTrail.push(log);
    
    // Keep only last 50 entries
    if (auditTrail.length > 50) {
      auditTrail.shift();
    }

    localStorage.setItem(this.auditKey, JSON.stringify(auditTrail));
  }

  // Send consent to backend for compliance records
  private async sendConsentToBackend(preferences: ConsentPreferences, method: string): Promise<void> {
    try {
      await fetch('/api/consent/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preferences,
          method,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Failed to log consent:', error);
    }
  }

  // Clear tracking data when consent is withdrawn
  private clearTrackingData(): void {
    // Clear localStorage tracking data
    const keysToRemove = ['visitorId', 'firstVisit', 'sessionData', 'heatmap'];
    keysToRemove.forEach(key => {
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.includes(key)) {
          localStorage.removeItem(storageKey);
        }
      });
    });

    // Clear sessionStorage
    sessionStorage.clear();

    // Request data deletion from backend
    this.requestDataDeletion();
  }

  // Clear Google Analytics cookies
  private clearGoogleAnalyticsCookies(): void {
    const gaCookies = ['_ga', '_gid', '_gat', '_ga_'];
    gaCookies.forEach(cookieName => {
      document.cookie.split(';').forEach(cookie => {
        if (cookie.trim().startsWith(cookieName)) {
          const name = cookie.split('=')[0].trim();
          Cookies.remove(name, { path: '/' });
          Cookies.remove(name, { path: '/', domain: `.${window.location.hostname}` });
        }
      });
    });
  }

  // Clear marketing cookies
  private clearMarketingCookies(): void {
    const marketingCookies = ['_fbp', '_fbc', 'fr', '_gcl_au', '_gcl_aw', '_gcl_dc'];
    marketingCookies.forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
      Cookies.remove(cookieName, { path: '/', domain: `.${window.location.hostname}` });
    });
  }

  // Clear functional cookies
  private clearFunctionalCookies(): void {
    const functionalCookies = ['language', 'currency', 'theme'];
    functionalCookies.forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
    });
  }

  // Request data deletion from backend (GDPR right to erasure)
  private async requestDataDeletion(): Promise<void> {
    const visitorId = localStorage.getItem('visitorId');
    if (visitorId) {
      try {
        await fetch('/api/gdpr/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ visitorId })
        });
      } catch (error) {
        console.error('Failed to request data deletion:', error);
      }
    }
  }

  // Get consent audit trail
  getAuditTrail(): ConsentAuditLog[] {
    const stored = localStorage.getItem(this.auditKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Register callback for consent changes
  onConsentChange(callback: (consent: ConsentPreferences) => void): void {
    this.callbacks.push(callback);
  }

  // Check if consent is required based on user location
  async isConsentRequired(): Promise<boolean> {
    try {
      // Check user's location
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // GDPR countries (EU + UK + EEA)
      const gdprCountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO'
      ];
      
      // CCPA (California)
      const ccpaRegions = ['California'];
      
      return gdprCountries.includes(data.country_code) || 
             ccpaRegions.includes(data.region);
    } catch {
      // If we can't determine location, assume consent is required
      return true;
    }
  }

  // Get privacy rights based on location
  async getPrivacyRights(): Promise<string[]> {
    const rights: string[] = [];
    
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // GDPR rights
      const gdprCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO'];
      
      if (gdprCountries.includes(data.country_code)) {
        rights.push(
          'Right to access your data',
          'Right to rectification',
          'Right to erasure ("right to be forgotten")',
          'Right to restrict processing',
          'Right to data portability',
          'Right to object',
          'Rights related to automated decision making'
        );
      }
      
      // CCPA rights
      if (data.region === 'California' && data.country_code === 'US') {
        rights.push(
          'Right to know what personal information is collected',
          'Right to delete personal information',
          'Right to opt-out of the sale of personal information',
          'Right to non-discrimination'
        );
      }
    } catch {
      // Default rights
      rights.push(
        'Right to access your data',
        'Right to delete your data',
        'Right to opt-out of tracking'
      );
    }
    
    return rights;
  }

  // Initialize consent on page load
  async initialize(): Promise<void> {
    // Set default consent state for Google Analytics
    window.gtag?.('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'granted',
      'personalization_storage': 'granted',
      'security_storage': 'granted'
    });

    // Check if we have existing consent
    const consent = this.getConsent();
    if (consent) {
      this.applyConsentPreferences(consent);
    }
  }

  // Clear all consent (for testing)
  clearConsent(): void {
    Cookies.remove(this.consentKey);
    Cookies.remove(this.auditKey);
    localStorage.removeItem(this.consentKey);
    localStorage.removeItem(this.auditKey);
    console.log('All consent data cleared');
  }
}

// Extend window interface
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    trackingEnabled?: boolean;
  }
}

export default ConsentManager.getInstance();