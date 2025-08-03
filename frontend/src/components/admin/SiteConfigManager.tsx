import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  InformationCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { buildApiEndpoint } from '../../config/api.config';
// import { toast } from 'react-hot-toast';
// Using console.log instead of toast for now

interface SiteConfig {
  gtm: {
    containerId: string;
    enabled: boolean;
  };
  searchConsole: {
    verificationCode: string;
    sitemapUrl: string;
    enabled: boolean;
  };
  googleAnalytics: {
    measurementId: string;
    enabled: boolean;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string[];
    robotsTxt: string;
  };
}

const SiteConfigManager: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingGTM, setTestingGTM] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(buildApiEndpoint('config/admin'), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch config');
      
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
      console.error('Failed to load configuration');
      
      // Set default config for demo purposes
      setConfig({
        gtm: {
          containerId: '',
          enabled: false
        },
        searchConsole: {
          verificationCode: '',
          sitemapUrl: '/sitemap.xml',
          enabled: false
        },
        googleAnalytics: {
          measurementId: '',
          enabled: false
        },
        seo: {
          defaultTitle: 'ViticultWhisky - Premium Cask Investment',
          defaultDescription: 'Invest in premium Scottish whisky casks. Secure, sustainable, and profitable alternative investments.',
          defaultKeywords: ['whisky investment', 'cask investment', 'scottish whisky', 'alternative investment'],
          robotsTxt: 'User-agent: *\nDisallow: /admin\nDisallow: /api/\nAllow: /\n\nSitemap: https://yourdomain.com/sitemap.xml'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    // Validate GTM ID if provided and enabled
    if (config.gtm.enabled && config.gtm.containerId && !validateGTMId(config.gtm.containerId)) {
      alert('Invalid GTM container ID format. Should be like GTM-XXXXXXX (e.g., GTM-ABC1234)');
      return;
    }

    // Validate GA4 ID if provided and enabled
    if (config.googleAnalytics.enabled && config.googleAnalytics.measurementId && !validateGA4Id(config.googleAnalytics.measurementId)) {
      alert('Invalid Google Analytics Measurement ID format. Should be like G-XXXXXXXXXX (e.g., G-ABC1234567)');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(buildApiEndpoint('config/admin'), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) throw new Error('Failed to save config');
      
      alert('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  // GTM ID validation function
  const validateGTMId = (gtmId: string): boolean => {
    const gtmPattern = /^GTM-[A-Z0-9]{7,10}$/;
    return gtmPattern.test(gtmId);
  };

  // GA4 Measurement ID validation function
  const validateGA4Id = (measurementId: string): boolean => {
    const ga4Pattern = /^G-[A-Z0-9]{10}$/;
    return ga4Pattern.test(measurementId);
  };

  const testGTM = async () => {
    if (!config?.gtm.containerId) {
      alert('Please enter a GTM container ID');
      return;
    }

    // Validate GTM ID format
    if (!validateGTMId(config.gtm.containerId)) {
      alert('Invalid GTM container ID format. Should be like GTM-XXXXXXX (e.g., GTM-ABC1234)');
      return;
    }

    setTestingGTM(true);
    try {
      const response = await fetch(buildApiEndpoint('config/admin/test-gtm'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ containerId: config.gtm.containerId })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error testing GTM:', error);
      alert('Failed to test GTM configuration');
    } finally {
      setTestingGTM(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <CogIcon className="w-8 h-8 text-premium-gold mr-3" />
        <h2 className="text-2xl font-bold">Site Configuration</h2>
      </div>

      <div className="space-y-8">
        {/* Google Tag Manager Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg p-6 bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Google Tag Manager</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.gtm.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  gtm: { ...config.gtm, enabled: e.target.checked }
                })}
                className="mr-2"
              />
              <span className="text-sm">Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Container ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.gtm.containerId}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase(); // Auto-convert to uppercase
                    setConfig({
                      ...config,
                      gtm: { ...config.gtm, containerId: value }
                    });
                  }}
                  placeholder="GTM-XXXXXXX"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-premium-gold focus:border-premium-gold bg-white text-gray-900 placeholder-gray-500"
                />
                <button
                  onClick={testGTM}
                  disabled={testingGTM}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {testingGTM ? 'Testing...' : 'Test GTM'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Get your container ID from Google Tag Manager dashboard
              </p>
            </div>

            {config.gtm.enabled && config.gtm.containerId && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Implementation Status</p>
                    <p className="text-blue-700 mt-1">
                      GTM will be automatically added to all pages when enabled.
                      Container ID: <code className="bg-blue-100 px-1 rounded">{config.gtm.containerId}</code>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Google Search Console Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border rounded-lg p-6 bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Google Search Console</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.searchConsole.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  searchConsole: { ...config.searchConsole, enabled: e.target.checked }
                })}
                className="mr-2"
              />
              <span className="text-sm">Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code (HTML Tag)
              </label>
              <input
                type="text"
                value={config.searchConsole.verificationCode}
                onChange={(e) => setConfig({
                  ...config,
                  searchConsole: { ...config.searchConsole, verificationCode: e.target.value }
                })}
                placeholder="verification code (e.g. abc123def456)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-premium-gold focus:border-premium-gold bg-white text-gray-900 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only the content value from the meta tag (not the full tag)
              </p>
            </div>

            {config.searchConsole.enabled && config.searchConsole.verificationCode && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    Verification meta tag will be added:
                  </p>
                  <code className="text-xs bg-green-100 p-2 rounded block mt-2 overflow-x-auto">
                    &lt;meta name="google-site-verification" content="{config.searchConsole.verificationCode}" /&gt;
                  </code>
                </div>

                <div className="bg-gray-100 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Sitemap URL:</p>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/api/config/sitemap.xml`)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                      Copy
                    </button>
                  </div>
                  <code className="text-xs bg-white p-2 rounded block">
                    {window.location.origin}/api/config/sitemap.xml
                  </code>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Google Analytics 4 Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border rounded-lg p-6 bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Google Analytics 4</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.googleAnalytics.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  googleAnalytics: { ...config.googleAnalytics, enabled: e.target.checked }
                })}
                className="mr-2"
              />
              <span className="text-sm">Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Measurement ID
            </label>
            <input
              type="text"
              value={config.googleAnalytics.measurementId}
              onChange={(e) => setConfig({
                ...config,
                googleAnalytics: { ...config.googleAnalytics, measurementId: e.target.value }
              })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-premium-gold focus:border-premium-gold bg-white text-gray-900 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Found in GA4 Admin → Data Streams → Web Stream Details
            </p>
          </div>
        </motion.div>

        {/* SEO Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border rounded-lg p-6 bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Title
              </label>
              <input
                type="text"
                value={config.seo.defaultTitle}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, defaultTitle: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-premium-gold focus:border-premium-gold bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Description
              </label>
              <textarea
                value={config.seo.defaultDescription}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, defaultDescription: e.target.value }
                })}
                placeholder="Default meta description for SEO"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-premium-gold focus:border-premium-gold bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                robots.txt Content
              </label>
              <textarea
                value={config.seo.robotsTxt}
                onChange={(e) => setConfig({
                  ...config,
                  seo: { ...config.seo, robotsTxt: e.target.value }
                })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:ring-premium-gold focus:border-premium-gold bg-white text-gray-900 placeholder-gray-500"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Accessible at: /api/config/robots.txt
                </p>
                <button
                  onClick={() => window.open('/api/config/robots.txt', '_blank')}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-premium-gold text-white rounded-lg hover:bg-antique-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteConfigManager;