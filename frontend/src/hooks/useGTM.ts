import { useEffect } from 'react';
import logger from '../utils/logger';
import { GTMEvents } from '../utils/gtm';

interface GTMConfig {
  containerId: string;
  enabled: boolean;
}

export const useGTM = () => {
  useEffect(() => {
    const loadGTM = async () => {
      try {
        // Fetch public config
        const response = await fetch('/api/config/public');
        if (!response.ok) return;
        
        const config = await response.json();
        const gtmConfig: GTMConfig = config.gtm;
        
        if (!gtmConfig || !gtmConfig.enabled || !gtmConfig.containerId) {
          logger.log('GTM not enabled or configured');
          return;
        }
        
        // Check if GTM is already loaded
        if (window.dataLayer && window.dataLayer.find((item: any) => item['gtm.start'])) {
          logger.log('GTM already loaded');
          return;
        }
        
        // Load GTM script
        (function(w: any, d: any, s: string, l: string, i: string) {
          w[l] = w[l] || [];
          w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
          const f = d.getElementsByTagName(s)[0];
          const j = d.createElement(s);
          const dl = l !== 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', gtmConfig.containerId);
        
        // Add noscript iframe for GTM
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmConfig.containerId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
        
        logger.log(`GTM loaded with container ID: ${gtmConfig.containerId}`);
        
        // Track initial page view
        GTMEvents.pageView(window.location.pathname);
        
      } catch (error) {
        logger.error('Error loading GTM config:', error);
      }
    };
    
    loadGTM();
  }, []);
};

// Also load Google Search Console verification
export const useSearchConsole = () => {
  useEffect(() => {
    const loadSearchConsole = async () => {
      try {
        const response = await fetch('/api/config/public');
        if (!response.ok) return;
        
        const config = await response.json();
        const searchConsoleConfig = config.searchConsole;
        
        if (!searchConsoleConfig || !searchConsoleConfig.enabled || !searchConsoleConfig.verificationCode) {
          return;
        }
        
        // Check if verification meta tag already exists
        const existingMeta = document.querySelector('meta[name="google-site-verification"]');
        if (existingMeta) {
          existingMeta.setAttribute('content', searchConsoleConfig.verificationCode);
        } else {
          // Add verification meta tag
          const meta = document.createElement('meta');
          meta.name = 'google-site-verification';
          meta.content = searchConsoleConfig.verificationCode;
          document.head.appendChild(meta);
        }
        
        logger.log('Google Search Console verification added');
        
      } catch (error) {
        logger.error('Error loading Search Console config:', error);
      }
    };
    
    loadSearchConsole();
  }, []);
};

// Combined hook for all analytics
export const useAnalytics = () => {
  useGTM();
  useSearchConsole();
};