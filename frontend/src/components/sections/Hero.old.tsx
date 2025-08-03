import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '../common/OptimizedImage';

interface HeroProps {
  videoUrl?: string;
  imageUrl?: string;
}

// Image sources with WebP support
const heroImageSources = [
  {
    webp: '/whisky/hero/resized_winery_Viticult-7513835 (1).webp',
    fallback: '/whisky/hero/resized_winery_Viticult-7513835 (1).webp'
  },
  {
    webp: '/whisky/hero/viticult_whisky_cask_investment43.webp',
    fallback: '/whisky/hero/viticult_whisky_cask_investment43.webp'
  },
  {
    webp: '/whisky/hero/viticult_whisky_cask_investment46.webp',
    fallback: '/whisky/hero/viticult_whisky_cask_investment46.webp'
  },
  {
    webp: '/whisky/hero/whiskey-2382370.webp',
    fallback: '/whisky/hero/whiskey-2382370.webp'
  },
  {
    webp: '/whisky/hero/dalmore-21-lifestyle.webp',
    fallback: '/whisky/hero/dalmore-21-lifestyle.webp'
  },
  {
    webp: '/whisky/hero/dalmore-18-lifestyle.webp',
    fallback: '/whisky/hero/dalmore-18-lifestyle.webp'
  }
];

const Hero: React.FC<HeroProps> = ({ 
  videoUrl = 'https://cdn.coverr.co/videos/coverr-pouring-whisky-into-a-glass-4066/1080p.mp4',
  imageUrl = '/whisky-barrels.webp'
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [loadedImages, setLoadedImages] = React.useState<Set<number>>(new Set());
  
  // Check WebP support
  const [supportsWebP, setSupportsWebP] = React.useState(false);
  
  React.useEffect(() => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      setSupportsWebP(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, []);
  
  // Sequential preloading for large images
  React.useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= heroImageSources.length) return;
      
      const img = new Image();
      const source = heroImageSources[index];
      
      img.onload = () => {
        setLoadedImages(prev => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
        // Preload next image after current one loads
        preloadImage(index + 1);
      };
      img.onerror = () => {
        // If WebP fails, try fallback
        if (supportsWebP && img.src.includes('.webp')) {
          img.src = source.fallback;
        } else {
          console.error(`Failed to load image: ${img.src}`);
          // Continue with next image even if one fails
          preloadImage(index + 1);
        }
      };
      
      // Load WebP if supported, otherwise fallback
      img.src = supportsWebP ? source.webp : source.fallback;
    };
    
    // Start preloading from first image
    if (supportsWebP !== null) {
      preloadImage(0);
    }
  }, [supportsWebP]);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        let nextIndex = (prev + 1) % heroImageSources.length;
        // Skip to next loaded image if current one isn't loaded
        let attempts = 0;
        while (!loadedImages.has(nextIndex) && attempts < heroImageSources.length) {
          nextIndex = (nextIndex + 1) % heroImageSources.length;
          attempts++;
        }
        return nextIndex;
      });
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [loadedImages]); // Re-run when loaded images change
  

  return (
    <section className="relative h-screen min-h-[800px] overflow-hidden bg-primary-black">
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse" />
      )}
      {/* Background Image with smooth transitions */}
      <div className="absolute inset-0">
        {heroImageSources.map((source, index) => (
          <div
            key={source.webp}
            className={`hero-image-wrapper transition-opacity duration-3000 ease-in-out ${
              index === currentImageIndex && loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {loadedImages.has(index) && (
              <picture>
                {supportsWebP && (
                  <source srcSet={source.webp} type="image/webp" />
                )}
                <img
                  src={source.webp}
                  alt="Premium whisky collection"
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                  onLoad={() => {
                    if (index === 0) setImageLoaded(true);
                  }}
                />
              </picture>
            )}
          </div>
        ))}
        {/* Lighter overlay for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pt-24 md:pt-28 lg:pt-0">
          <div className="max-w-5xl mx-auto lg:mx-0 lg:ml-28">
            <h1 className="font-serif text-text-primary mb-8 text-shadow-luxury relative">
              {/* 3D Text Container */}
              <motion.div
                className="relative"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* INVEST IN */}
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(50px)"
                  }}
                >
                  INVEST IN
                </motion.span>

                {/* RARE - Main 3D element */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotateX: [-5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.3,
                    ease: [0.68, -0.55, 0.265, 1.55]
                  }}
                  className="block text-gradient-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-tight leading-none cursor-default"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(100px)",
                    textShadow: `
                      0 1px 0 #ccc,
                      0 2px 0 #c9c9c9,
                      0 3px 0 #bbb,
                      0 4px 0 #b9b9b9,
                      0 5px 0 #aaa,
                      0 6px 1px rgba(0,0,0,.1),
                      0 0 5px rgba(0,0,0,.1),
                      0 1px 3px rgba(0,0,0,.3),
                      0 3px 5px rgba(0,0,0,.2),
                      0 5px 10px rgba(0,0,0,.25),
                      0 10px 10px rgba(0,0,0,.2),
                      0 20px 20px rgba(0,0,0,.15),
                      0 0 30px rgba(251,191,36,0.5)
                    `
                  }}
                >
                  <motion.span
                    animate={{ 
                      y: [0, -15, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block"
                  >
                    RARE
                  </motion.span>
                </motion.span>

                {/* WHISKY CASKS */}
                <motion.span
                  initial={{ opacity: 0, x: -100, rotateY: -45 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  className="block text-gradient-luxury text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(50px)"
                  }}
                >
                  WHISKY CASKS
                </motion.span>
              </motion.div>

            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
              className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-3xl tracking-wide"
            >
              For over 180 years, whisky has proven itself as a high-performing alternative asset. 
              Access exclusive casks from Scotland's most prestigious distilleries with proven investment potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to="/contact" className="btn-premium group inline-flex relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Start Investing</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="ml-3 relative z-10"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to="/how-it-works" className="btn-secondary group inline-flex relative">
                  <motion.span
                    className="mr-3 relative"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-premium-gold/20 rounded-full blur-md"
                    />
                    <PlayIcon className="h-5 w-5 relative z-10" />
                  </motion.span>
                  <span className="group-hover:text-primary-black transition-colors">Watch How It Works</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
              className="mt-16 flex flex-wrap gap-8 text-text-secondary"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-eco-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">100% Carbon-Neutral Distilleries</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-premium-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">Trusted by 1,000+ Investors</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-eco-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">12.5% Avg. Annual Returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-premium-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">Min. Investment £3,000</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-3">
          <span className="text-text-secondary text-sm uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-premium-gold/30 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-3 bg-premium-gold rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;