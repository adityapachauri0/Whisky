import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizationsProps {
  preloadImages?: string[];
  preconnectDomains?: string[];
  prefetchUrls?: string[];
  criticalCSS?: string;
}

const SEOOptimizations: React.FC<SEOOptimizationsProps> = ({
  preloadImages = [],
  preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  prefetchUrls = [],
  criticalCSS
}) => {
  return (
    <Helmet>
      {/* DNS Prefetch and Preconnect */}
      {preconnectDomains.map((domain, index) => (
        <React.Fragment key={domain}>
          <link rel="dns-prefetch" href={domain} />
          <link rel="preconnect" href={domain} crossOrigin="" />
        </React.Fragment>
      ))}

      {/* Preload Critical Images */}
      {preloadImages.map((image, index) => (
        <link
          key={image}
          rel="preload"
          as="image"
          href={image}
          imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          type="image/webp"
        />
      ))}

      {/* Prefetch Next Pages */}
      {prefetchUrls.map((url, index) => (
        <link key={url} rel="prefetch" href={url} />
      ))}

      {/* Critical CSS */}
      {criticalCSS && (
        <style type="text/css">
          {criticalCSS}
        </style>
      )}

      {/* Performance Optimizations */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Cache Control */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
      
      {/* Resource Hints */}
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      <link rel="dns-prefetch" href="//unpkg.com" />
      
      {/* Font Optimizations */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
      
      {/* Favicon handled in index.html */}
      
      {/* Critical Path CSS */}
      <style>
        {`
          /* Critical CSS for above-the-fold content */
          html { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          body { margin: 0; padding: 0; }
          .hero-section { min-height: 100vh; }
          .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}
      </style>
    </Helmet>
  );
};

export default SEOOptimizations;