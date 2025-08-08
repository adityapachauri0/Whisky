import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: string;
    currency: string;
  };
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  jsonLd?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = 'https://viticultwhisky.co.uk/whisky/hero/viticult_whisky_cask_investment43.webp',
  url = 'https://viticultwhisky.co.uk',
  type = 'website',
  author = 'ViticultWhisky',
  publishedTime,
  modifiedTime,
  section,
  tags,
  price,
  availability,
  brand = 'ViticultWhisky',
  jsonLd
}) => {
  const fullTitle = `${title} | ViticultWhisky - Premium Whisky Cask Investment`;
  const siteUrl = 'https://viticultwhisky.co.uk';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Default JSON-LD structured data
  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ViticultWhisky',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/viticultwhisky',
      'https://twitter.com/viticultwhisky',
      'https://instagram.com/viticultwhisky',
      'https://linkedin.com/company/viticultwhisky'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-20-1234-5678',
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: ['English']
    }
  };

  // Merge custom JSON-LD with default
  const structuredData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ViticultWhisky" />
      <meta property="og:locale" content="en_GB" />

      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
        </>
      )}

      {/* Product specific Open Graph tags */}
      {type === 'product' && (
        <>
          {price && (
            <>
              <meta property="product:price:amount" content={price.amount} />
              <meta property="product:price:currency" content={price.currency} />
            </>
          )}
          {availability && <meta property="product:availability" content={availability} />}
          {brand && <meta property="product:brand" content={brand} />}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@viticultwhisky" />
      <meta name="twitter:creator" content="@viticultwhisky" />

      {/* Additional SEO Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="ViticultWhisky" />

      {/* Geographic Tags */}
      <meta name="geo.region" content="GB-SCT" />
      <meta name="geo.placename" content="Scotland" />
      <meta name="geo.position" content="55.9533;-3.1883" />
      <meta name="ICBM" content="55.9533, -3.1883" />

      {/* Verification Tags (add your actual verification codes) */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;