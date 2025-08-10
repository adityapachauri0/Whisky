import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  XMarkIcon, 
  CogIcon, 
  ShieldCheckIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  MegaphoneIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';
import consentManager from '../../services/consentManager';
import { Link } from 'react-router-dom';

interface UnifiedConsentModalProps {
  onAutoSaveConsent?: (consent: boolean) => void;
  showAutoSaveOption?: boolean;
}

const UnifiedConsentModal: React.FC<UnifiedConsentModalProps> = ({ 
  onAutoSaveConsent,
  showAutoSaveOption = false 
}) => {
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetailedPreferences, setShowDetailedPreferences] = useState(false);
  const [isOnContactPage, setIsOnContactPage] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
    formAutoSave: false // New preference for form auto-save
  });

  // Check if we're on the contact page
  useEffect(() => {
    setIsOnContactPage(location.pathname === '/contact');
  }, [location]);

  // Initialize and check existing consent
  useEffect(() => {
    // Initialize consent manager
    consentManager.initialize();

    // Check if general consent is already given
    const existingConsent = consentManager.getConsent();
    
    if (!existingConsent) {
      // No consent given yet - show banner
      setShowBanner(true);
    } else {
      // Consent already given - check if we need to ask for auto-save on contact page
      const hasAutoSaveConsent = localStorage.getItem('formAutoSaveConsent');
      
      // Only show if:
      // 1. We're on contact page
      // 2. Auto-save consent hasn't been decided yet
      // 3. But general consent was already given
      if (isOnContactPage && !hasAutoSaveConsent && existingConsent) {
        // Don't show the full banner, auto-save is handled by the contact page itself
        // Call the callback if provided
        if (onAutoSaveConsent) {
          const savedConsent = localStorage.getItem('formAutoSaveConsent');
          if (savedConsent === 'true') {
            onAutoSaveConsent(true);
          }
        }
      }
    }
  }, [isOnContactPage, onAutoSaveConsent]);

  // Notify parent component about auto-save consent when it changes
  useEffect(() => {
    if (onAutoSaveConsent && preferences.formAutoSave) {
      onAutoSaveConsent(preferences.formAutoSave);
    }
  }, [preferences.formAutoSave, onAutoSaveConsent]);

  const handleAcceptAll = () => {
    // Save all consents including auto-save
    consentManager.saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }, 'banner');

    // Save auto-save consent
    localStorage.setItem('formAutoSaveConsent', 'true');
    if (onAutoSaveConsent) {
      onAutoSaveConsent(true);
    }

    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    // Only accept necessary cookies
    consentManager.saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }, 'banner');

    // Don't enable auto-save by default
    localStorage.setItem('formAutoSaveConsent', 'false');
    if (onAutoSaveConsent) {
      onAutoSaveConsent(false);
    }

    setShowBanner(false);
  };

  const handleSaveCustomPreferences = () => {
    // Save custom preferences
    consentManager.saveConsent({
      necessary: preferences.necessary,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      functional: preferences.functional
    }, 'preferences');

    // Save auto-save preference
    localStorage.setItem('formAutoSaveConsent', preferences.formAutoSave.toString());
    if (onAutoSaveConsent) {
      onAutoSaveConsent(preferences.formAutoSave);
    }

    setShowDetailedPreferences(false);
    setShowBanner(false);
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Reset consent for testing (development only)
  const resetConsent = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      consentManager.clearConsent();
      localStorage.removeItem('formAutoSaveConsent');
      setShowBanner(true);
      console.log('Consent reset for testing');
    }
  }, []);

  // Don't render anything if banner shouldn't be shown
  if (!showBanner) {
    // Add debug button in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="fixed bottom-4 left-4 z-[10000]">
          <button
            onClick={resetConsent}
            className="bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
            title="Reset consent for testing"
          >
            Reset Consent
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* Main Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm"
          >
            <motion.div 
              className="max-w-2xl w-full mx-auto mt-20 sm:mt-28 px-4 sm:px-0"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl border-2 border-premium-gold overflow-hidden ring-1 ring-black/5">
                <div className="p-4 sm:p-5">
                  {/* Modal Header */}
                  <div className="text-center mb-3 sm:mb-4">
                    <ShieldCheckIcon className="h-8 sm:h-10 w-8 sm:w-10 text-premium-gold mx-auto mb-2" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      Privacy & Consent Settings
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 px-2 sm:px-0">
                      We use cookies to enhance your experience & auto-save your form progress
                    </p>
                  </div>

                  {/* Quick Toggle Categories - Compact */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 mb-3">
                    {/* Essential Cookies */}
                    <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 border border-gray-200">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-3 w-3 text-gray-600 mr-0.5 sm:mr-1" />
                        <span className="text-[10px] sm:text-xs font-medium">Essential</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Always on</p>
                    </div>

                    {/* Analytics */}
                    <div 
                      className="bg-white rounded-lg p-1.5 sm:p-2 border border-gray-200 cursor-pointer hover:border-premium-gold transition-colors"
                      onClick={() => handleTogglePreference('analytics')}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleTogglePreference('analytics')}
                          className="mr-0.5 sm:mr-1 h-3 w-3 accent-premium-gold"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <ChartBarIcon className="h-3 w-3 text-gray-600 mr-0.5 sm:mr-1" />
                        <span className="text-[10px] sm:text-xs font-medium">Analytics</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Usage data</p>
                    </div>

                    {/* Marketing */}
                    <div 
                      className="bg-white rounded-lg p-1.5 sm:p-2 border border-gray-200 cursor-pointer hover:border-premium-gold transition-colors"
                      onClick={() => handleTogglePreference('marketing')}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleTogglePreference('marketing')}
                          className="mr-0.5 sm:mr-1 h-3 w-3 accent-premium-gold"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <MegaphoneIcon className="h-3 w-3 text-gray-600 mr-0.5 sm:mr-1" />
                        <span className="text-[10px] sm:text-xs font-medium">Marketing</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Targeted ads</p>
                    </div>

                    {/* Functional */}
                    <div 
                      className="bg-white rounded-lg p-1.5 sm:p-2 border border-gray-200 cursor-pointer hover:border-premium-gold transition-colors"
                      onClick={() => handleTogglePreference('functional')}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={() => handleTogglePreference('functional')}
                          className="mr-0.5 sm:mr-1 h-3 w-3 accent-premium-gold"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <WrenchIcon className="h-3 w-3 text-gray-600 mr-0.5 sm:mr-1" />
                        <span className="text-[10px] sm:text-xs font-medium">Functional</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Preferences</p>
                    </div>

                    {/* Form Auto-Save (available on all pages) */}
                    <div 
                      className="bg-amber-50 rounded-lg p-1.5 sm:p-2 border border-amber-300 cursor-pointer hover:border-premium-gold transition-colors col-span-2 sm:col-span-1"
                      onClick={() => handleTogglePreference('formAutoSave')}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.formAutoSave}
                          onChange={() => handleTogglePreference('formAutoSave')}
                          className="mr-0.5 sm:mr-1 h-3 w-3 accent-premium-gold"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <DocumentCheckIcon className="h-3 w-3 text-amber-600 mr-0.5 sm:mr-1" />
                        <span className="text-[10px] sm:text-xs font-medium text-amber-800">Auto-Save</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-amber-600 mt-0.5 sm:mt-1">Forms</p>
                    </div>
                  </div>

                  {/* Action Buttons - Modal style */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={handleAcceptEssential}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex-1 sm:flex-initial"
                      >
                        Reject All
                      </button>
                      
                      <button
                        onClick={() => setShowDetailedPreferences(true)}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center flex-1 sm:flex-initial"
                      >
                        <CogIcon className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                        Customize
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCustomPreferences}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors font-medium flex-1 sm:flex-initial"
                      >
                        Save Selection
                      </button>

                      <button
                        onClick={handleAcceptAll}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-premium-gold to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-bold flex-1"
                      >
                        Accept All
                      </button>
                    </div>
                  </div>

                  {/* Compact Compliance Footer */}
                  <div className="mt-2 sm:mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      <ShieldCheckIcon className="inline h-3 w-3 mr-0.5 sm:mr-1" />
                      <span className="hidden sm:inline">GDPR Compliant</span>
                      <span className="sm:hidden">GDPR</span>
                    </p>
                    <div className="text-[10px] sm:text-xs">
                      <Link to="/privacy-policy" className="text-gray-600 hover:text-premium-gold mr-2">
                        Privacy
                      </Link>
                      <Link to="/cookie-policy" className="text-gray-600 hover:text-premium-gold">
                        Cookies
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Preferences Modal */}
      <AnimatePresence>
        {showDetailedPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detailed Privacy Preferences
                  </h2>
                  <button
                    onClick={() => setShowDetailedPreferences(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Categories Detail */}
                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          Essential Cookies
                        </h3>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      These cookies are required for the website to function properly. 
                      They enable basic functions like page navigation and access to secure areas.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Examples:</strong> Session cookies, security tokens, CSRF protection
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          Analytics & Performance
                        </h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleTogglePreference('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-gold"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Cookies used:</strong> _ga, _gid, _gat, visitorId, sessionData
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <MegaphoneIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          Marketing & Advertising
                        </h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleTogglePreference('marketing')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-gold"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Used to deliver advertisements more relevant to you and measure 
                      the effectiveness of advertising campaigns.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Cookies used:</strong> _fbp, _gcl_au, IDE, fr
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <WrenchIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          Functional Cookies
                        </h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={() => handleTogglePreference('functional')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-gold"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Enable enhanced functionality and personalization, such as 
                      remembering your preferences and language selection.
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Cookies used:</strong> language, currency, theme, preferences
                    </div>
                  </div>

                  {/* Form Auto-Save */}
                  <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <DocumentCheckIcon className="h-5 w-5 text-amber-600 mr-2" />
                        <h3 className="font-semibold text-amber-900">
                          Form Auto-Save Feature
                        </h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.formAutoSave}
                          onChange={() => handleTogglePreference('formAutoSave')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                    <p className="text-sm text-amber-800 mb-2">
                      Automatically saves your form progress as you type across all forms on our website, 
                      ensuring you never lose your information if you navigate away or experience a connection issue.
                    </p>
                    <div className="text-xs text-amber-700">
                      <strong>Features:</strong> Real-time saving • Encrypted storage • 
                      30-day retention • Automatic cleanup • Resume anytime • Works on all forms
                    </div>
                  </div>
                </div>

                {/* Privacy Rights */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Privacy Rights
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• You can withdraw consent at any time</li>
                    <li>• You have the right to access your personal data</li>
                    <li>• You can request deletion of your data</li>
                    <li>• You can opt-out of marketing communications</li>
                    <li>• Contact: privacy@viticultwhisky.co.uk</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowDetailedPreferences(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCustomPreferences}
                    className="px-6 py-3 bg-gradient-to-r from-premium-gold to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-bold flex-1"
                  >
                    Save My Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UnifiedConsentModal;