import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import { useLazyLoad } from '../components/common/LazyComponent';
import SchemaMarkup from '../components/common/SchemaMarkup';
import SEOOptimizations from '../components/common/SEOOptimizations';

// Lazy load sections that are below the fold
const Features = lazy(() => import('../components/sections/Features'));
const HowItWorksSection = lazy(() => import('../components/sections/HowItWorksSection'));
const InvestmentOptions = lazy(() => import('../components/sections/InvestmentOptions'));
const OurWhisky = lazy(() => import('../components/sections/OurWhisky'));
const DistilleryPartners = lazy(() => import('../components/sections/DistilleryPartners'));
const BuySellWhisky = lazy(() => import('../components/sections/BuySellWhisky'));
const WhiskyGallery = lazy(() => import('../components/sections/WhiskyGallery'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));
const BlogPreview = lazy(() => import('../components/sections/BlogPreview'));
const CTA = lazy(() => import('../components/sections/CTA'));

// Section loader component
const SectionLoader: React.FC = () => (
  <div className="py-16 flex justify-center">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-premium-gold border-t-transparent"></div>
  </div>
);

// Lazy section wrapper with intersection observer
const LazySection: React.FC<{ component: React.LazyExoticComponent<React.FC> }> = ({ component: Component }) => {
  const { ref, isIntersecting } = useLazyLoad(0.1);
  
  return (
    <div ref={ref}>
      {isIntersecting ? (
        <Suspense fallback={<SectionLoader />}>
          <Component />
        </Suspense>
      ) : (
        <div className="min-h-[400px]" /> // Placeholder to maintain scroll position
      )}
    </div>
  );
};

const Home: React.FC = () => {
  // Prefetch critical components after initial render
  React.useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      // Prefetch next sections
      import('../components/sections/Features');
      import('../components/sections/HowItWorksSection');
    }, 2000);
    
    return () => clearTimeout(prefetchTimer);
  }, []);

  return (
    <>
      <Helmet>
        <title>ViticultWhisky - Premium Scottish Whisky Cask Investment Platform | Expert-Curated Returns</title>
        <meta 
          name="description" 
          content="Discover exclusive Scottish whisky cask investments with ViticultWhisky. Expert-curated portfolio opportunities from premium distilleries with secure bonded storage and exceptional returns. Start from £5,000." 
        />
        <meta name="keywords" content="whisky investment, Scottish whisky casks, cask investment, alternative investments, premium spirits investment, distillery investment, bonded warehouse storage, whisky portfolio" />
        
        {/* Enhanced SEO Meta Tags */}
        <meta property="og:title" content="ViticultWhisky - Premium Scottish Whisky Cask Investment" />
        <meta property="og:description" content="Expert-curated Scottish whisky cask investments from premium distilleries. Secure storage, authenticated provenance, exceptional returns." />
        <meta property="og:url" content="https://viticultwhisky.co.uk" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/hero/hero-1.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ViticultWhisky" />
        <meta property="og:locale" content="en_GB" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ViticultWhisky - Premium Scottish Whisky Cask Investment" />
        <meta name="twitter:description" content="Expert-curated Scottish whisky cask investments with secure bonded storage and exceptional returns." />
        <meta name="twitter:image" content="https://viticultwhisky.co.uk/whisky/hero/hero-1.webp" />
        <meta name="twitter:site" content="@viticultwhisky" />
        
        {/* Geo targeting */}
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="United Kingdom" />
        <meta name="geo.position" content="55.9533;-3.1883" />
        <meta name="ICBM" content="55.9533, -3.1883" />
        
        {/* Preload critical resources */}
        <link rel="preload" as="image" href="/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp" />
        <link rel="preload" as="font" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" crossOrigin="anonymous" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://viticultwhisky.co.uk/" />
        
        {/* Alternate language versions */}
        <link rel="alternate" hrefLang="en-gb" href="https://viticultwhisky.co.uk/" />
        <link rel="alternate" hrefLang="en" href="https://viticultwhisky.co.uk/" />
        
        {/* Additional meta tags */}
        <meta name="author" content="ViticultWhisky Expert Team" />
        <meta name="copyright" content="ViticultWhisky Ltd" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Business information */}
        <meta name="business:contact_data:street_address" content="123 Whisky Lane" />
        <meta name="business:contact_data:locality" content="Edinburgh" />
        <meta name="business:contact_data:region" content="Scotland" />
        <meta name="business:contact_data:postal_code" content="EH1 1AA" />
        <meta name="business:contact_data:country_name" content="United Kingdom" />
        <meta name="business:contact_data:phone_number" content="+44-20-3595-3910" />
        <meta name="business:contact_data:website" content="https://viticultwhisky.co.uk" />
      </Helmet>

      {/* SEO Performance Optimizations */}
      <SEOOptimizations
        preloadImages={[
          '/whisky/hero/optimized/resized_winery_Viticult-7513835-1-1280w.webp',
          '/whisky/hero/optimized/viticult_whisky_cask_investment43-1280w.webp'
        ]}
        prefetchUrls={[
          '/about',
          '/how-it-works',
          '/contact'
        ]}
      />

      {/* Comprehensive Schema Markup */}
      <SchemaMarkup type="organization" />
      <SchemaMarkup type="website" />
      <SchemaMarkup type="service" data={{
        name: "Premium Whisky Cask Investment Services",
        description: "Expert-curated Scottish whisky cask investment opportunities with authenticated provenance, secure bonded storage, and portfolio management services for discerning investors seeking alternative investment opportunities."
      }} />
      <SchemaMarkup type="breadcrumb" data={{
        breadcrumbs: [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://viticultwhisky.co.uk"
          }
        ]
      }} />

      {/* Hero is loaded immediately */}
      <Hero />
      
      {/* Other sections are lazy loaded as user scrolls */}
      <LazySection component={Features} />
      <LazySection component={HowItWorksSection} />
      <LazySection component={OurWhisky} />
      <LazySection component={DistilleryPartners} />
      <LazySection component={WhiskyGallery} />
      <LazySection component={BuySellWhisky} />
      <LazySection component={InvestmentOptions} />
      <LazySection component={Testimonials} />
      <LazySection component={BlogPreview} />
      <LazySection component={CTA} />
    </>
  );
};

export default Home;