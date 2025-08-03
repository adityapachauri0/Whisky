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
        // PRODUCTION DEBUG: Force console logging for GTM debugging
        console.log('[GTM DEBUG] Starting GTM initialization...');
        
        // Fetch public config
        const response = await fetch('/api/config/public');
        console.log('[GTM DEBUG] API response status:', response.status);
        
        if (!response.ok) {
          console.error('[GTM DEBUG] API request failed:', response.status, response.statusText);
          return;
        }
        
        const config = await response.json();
        console.log('[GTM DEBUG] Full API response:', JSON.stringify(config, null, 2));
        
        const gtmConfig: GTMConfig = config.gtm;
        console.log('[GTM DEBUG] Parsed GTM config:', JSON.stringify(gtmConfig, null, 2));
        
        if (!gtmConfig) {
          console.log('[GTM DEBUG] No GTM config found in response');
          return;
        }
        
        if (!gtmConfig.enabled) {
          console.log('[GTM DEBUG] GTM is disabled:', gtmConfig.enabled);
          return;
        }
        
        if (!gtmConfig.containerId) {
          console.log('[GTM DEBUG] No container ID found:', gtmConfig.containerId);
          return;
        }
        
        console.log('[GTM DEBUG] GTM config validation passed, container ID:', gtmConfig.containerId);
        
        // Check if GTM is already loaded
        if (window.dataLayer && window.dataLayer.find((item: any) => item['gtm.start'])) {
          console.log('[GTM DEBUG] GTM already loaded, skipping initialization');
          return;
        }
        
        console.log('[GTM DEBUG] Loading GTM script for container:', gtmConfig.containerId);
        
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
          j.onload = () => {
            console.log('[GTM DEBUG] GTM script loaded successfully');
          };
          j.onerror = (error: Event | string) => {
            console.error('[GTM DEBUG] GTM script failed to load:', error);
          };
          f.parentNode.insertBefore(j, f);
          console.log('[GTM DEBUG] GTM script element created and inserted');
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
        
        console.log('[GTM DEBUG] GTM noscript iframe added');
        console.log('[GTM DEBUG] GTM initialization completed for container:', gtmConfig.containerId);
        
        // Track initial page view
        setTimeout(() => {
          console.log('[GTM DEBUG] Tracking initial page view');
          GTMEvents.pageView(window.location.pathname);
        }, 1000); // Small delay to ensure GTM is fully loaded
        
      } catch (error) {
        console.error('[GTM DEBUG] Error loading GTM config:', error);
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