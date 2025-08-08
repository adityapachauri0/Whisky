import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import consentManager, { ConsentPreferences } from '../../services/consentManager';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isRequired, setIsRequired] = useState(true);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  // Debug function to reset consent (only in development)
  const resetConsent = () => {
    if (process.env.NODE_ENV === 'development') {
      consentManager.clearConsent();
      setShowBanner(true);
      console.log('Consent reset for testing');
    }
  };

  useEffect(() => {
    // Initialize consent manager
    consentManager.initialize();

    // Check if consent is already given
    const existingConsent = consentManager.getConsent();
    console.log('Existing consent:', existingConsent);
    
    if (!existingConsent) {
      // Show banner after a short delay to avoid conflicts with other modals
      const timer = setTimeout(() => {
        setIsRequired(true);
        setShowBanner(true);
        console.log('Showing consent banner');
      }, 1000); // 1 second delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    console.log('Accepting all cookies');
    consentManager.saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }, 'banner');
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    consentManager.saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }, 'banner');
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    consentManager.saveConsent(preferences, 'preferences');
    setShowPreferences(false);
    setShowBanner(false);
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Debug controls in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-[10000] space-y-2">
          <button
            onClick={resetConsent}
            className="block w-full bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
            title="Reset consent for testing"
          >
            Reset Consent
          </button>
          <button
            onClick={() => setShowBanner(true)}
            className="block w-full bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
            title="Force show banner"
          >
            Show Banner
          </button>
          <div className="bg-gray-800 text-white px-3 py-1 text-xs rounded">
            Banner: {showBanner ? '✅' : '❌'}
          </div>
        </div>
      )}

      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-8 w-8 text-premium-gold mr-3" />
                      <h3 className="text-xl font-bold text-gray-900">
                        Privacy & Cookie Settings
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowBanner(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    We use cookies and similar technologies to enhance your browsing experience, 
                    analyze site traffic, and understand where our visitors are coming from. 
                    By clicking "Accept All", you consent to our use of cookies. You can manage 
                    your preferences or learn more in our{' '}
                    <Link to="/privacy-policy" className="text-premium-gold hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>

                  {/* Quick Cookie Categories */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">Essential</span>
                      </div>
                      <p className="text-xs text-gray-500">Always active</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleTogglePreference('analytics')}
                          className="mr-2 accent-premium-gold"
                        />
                        <span className="text-sm font-medium">Analytics</span>
                      </div>
                      <p className="text-xs text-gray-500">Performance data</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleTogglePreference('marketing')}
                          className="mr-2 accent-premium-gold"
                        />
                        <span className="text-sm font-medium">Marketing</span>
                      </div>
                      <p className="text-xs text-gray-500">Personalized ads</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={() => handleTogglePreference('functional')}
                          className="mr-2 accent-premium-gold"
                        />
                        <span className="text-sm font-medium">Functional</span>
                      </div>
                      <p className="text-xs text-gray-500">Enhanced features</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleRejectAll}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="px-6 py-3 bg-white border-2 border-premium-gold text-premium-gold rounded-lg hover:bg-amber-50 transition-colors font-medium flex items-center justify-center"
                    >
                      <CogIcon className="h-5 w-5 mr-2" />
                      Manage Preferences
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-6 py-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors font-medium"
                    >
                      Save My Choices
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-3 bg-premium-gold text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex-1"
                    >
                      Accept All
                    </button>
                  </div>

                  {/* Legal Compliance Notice */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {isRequired ? (
                        <>
                          <ShieldCheckIcon className="inline h-4 w-4 mr-1" />
                          GDPR/CCPA Compliant • Your privacy rights are protected by law
                        </>
                      ) : (
                        'We respect your privacy and comply with applicable data protection laws'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Privacy Preference Center
                  </h2>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  When you visit our website, we may store or retrieve information on your browser, 
                  mostly in the form of cookies. This information might be about you, your preferences, 
                  or your device and is mostly used to make the site work as you expect it to.
                </p>

                {/* Cookie Categories Detail */}
                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Strictly Necessary Cookies
                      </h3>
                      <span className="text-sm text-green-600 font-medium">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      These cookies are essential for the website to function properly. 
                      They enable basic functions like page navigation, secure area access, 
                      and GDPR consent management. The website cannot function properly without these cookies.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Analytics & Performance Cookies
                      </h3>
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
                    <p className="text-sm text-gray-600">
                      These cookies help us understand how visitors interact with our website 
                      by collecting and reporting information anonymously. This includes Google Analytics, 
                      visitor tracking, and performance monitoring tools.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Cookies used:</strong> _ga, _gid, _gat, visitorId, sessionData
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Marketing & Advertising Cookies
                      </h3>
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
                    <p className="text-sm text-gray-600">
                      These cookies are used to deliver advertisements more relevant to you 
                      and your interests. They are also used to limit the number of times you 
                      see an advertisement and help measure the effectiveness of advertising campaigns.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Cookies used:</strong> _fbp, _gcl_au, IDE, fr
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Functional Cookies
                      </h3>
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
                    <p className="text-sm text-gray-600">
                      These cookies enable enhanced functionality and personalization, 
                      such as remembering your preferences, language selection, or region. 
                      They may be set by us or by third-party providers whose services we use.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Cookies used:</strong> language, currency, theme, preferences
                    </div>
                  </div>
                </div>

                {/* Your Privacy Rights */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Privacy Rights
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• You can withdraw consent at any time</li>
                    <li>• You have the right to access your personal data</li>
                    <li>• You can request deletion of your data</li>
                    <li>• You can opt-out of marketing communications</li>
                    <li>• You can file a complaint with supervisory authorities</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    For more information, please read our{' '}
                    <Link to="/privacy-policy" className="text-premium-gold hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    or contact our Data Protection Officer at privacy@viticultwhisky.co.uk
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-3 bg-premium-gold text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex-1"
                  >
                    Save Preferences
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

export default CookieConsent;