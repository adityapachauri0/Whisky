import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon, PauseIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Hero image configurations with responsive sources
const heroImageSets = [
  {
    base: 'resized_winery_Viticult-7513835-1',
    alt: 'Premium whisky cask investment opportunity'
  },
  {
    base: 'viticult_whisky_cask_investment43',
    alt: 'Rare whisky cask collection'
  },
  {
    base: 'viticult_whisky_cask_investment46',
    alt: 'Whisky distillery and cask storage'
  },
  {
    base: 'whiskey-2382370',
    alt: 'Premium whisky pouring and tasting'
  },
  {
    base: 'dalmore-21-lifestyle',
    alt: 'Dalmore 21 year old luxury whisky'
  },
  {
    base: 'dalmore-18-lifestyle',
    alt: 'Dalmore 18 year old premium whisky'
  }
];

interface HeroProps {
  videoUrl?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preload function with error handling
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }, []);

  // Preload first image set immediately
  useEffect(() => {
    const firstSet = heroImageSets[0];
    const imagesToPreload = [
      `/whisky/hero/optimized/${firstSet.base}-640w.webp`,
      `/whisky/hero/optimized/${firstSet.base}-768w.webp`,
      `/whisky/hero/optimized/${firstSet.base}-1280w.webp`
    ];
    
    Promise.all(imagesToPreload.map(src => preloadImage(src)))
      .then(() => {
        setIsFirstImageLoaded(true);
        setImagesLoaded(new Set([0]));
      })
      .catch(err => {
        console.error('Failed to load first image set:', err);
        setIsFirstImageLoaded(true); // Show content anyway
      });
  }, [preloadImage]);

  // Preload next image set
  const preloadNextImageSet = useCallback((index: number) => {
    if (!imagesLoaded.has(index)) {
      const imageSet = heroImageSets[index];
      const imagesToPreload = [
        `/whisky/hero/optimized/${imageSet.base}-640w.webp`,
        `/whisky/hero/optimized/${imageSet.base}-768w.webp`
      ];
      
      Promise.all(imagesToPreload.map(src => preloadImage(src)))
        .then(() => {
          setImagesLoaded(prev => new Set(prev).add(index));
        })
        .catch(err => {
          console.error(`Failed to preload image set ${index}:`, err);
        });
    }
  }, [imagesLoaded, preloadImage]);

  // Image rotation with pause support
  useEffect(() => {
    if (!isPaused && !prefersReducedMotion) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => {
          const next = (prev + 1) % heroImageSets.length;
          // Preload the image after next for smooth transitions
          const afterNext = (next + 1) % heroImageSets.length;
          preloadNextImageSet(afterNext);
          return next;
        });
      }, 6000); // 6 seconds for better viewing experience
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, prefersReducedMotion, preloadNextImageSet]);

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Current image set
  const currentImageSet = useMemo(() => heroImageSets[currentImageIndex], [currentImageIndex]);

  return (
    <section className="relative h-screen min-h-[800px] overflow-hidden bg-gradient-to-br from-premium-gold/5 to-primary-dark">
      {/* Loading placeholder */}
      {!isFirstImageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-primary-dark animate-pulse" />
      )}
      
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.2 }}
            className="absolute inset-0"
          >
            <picture>
              <source
                media="(max-width: 640px)"
                srcSet={`/whisky/hero/optimized/${currentImageSet.base}-640w.webp`}
              />
              <source
                media="(max-width: 768px)"
                srcSet={`/whisky/hero/optimized/${currentImageSet.base}-768w.webp`}
              />
              <source
                media="(max-width: 1280px)"
                srcSet={`/whisky/hero/optimized/${currentImageSet.base}-1280w.webp`}
              />
              <img
                src={`/whisky/hero/optimized/${currentImageSet.base}-1920w.webp`}
                srcSet={`
                  /whisky/hero/optimized/${currentImageSet.base}-640w.webp 640w,
                  /whisky/hero/optimized/${currentImageSet.base}-768w.webp 768w,
                  /whisky/hero/optimized/${currentImageSet.base}-1280w.webp 1280w,
                  /whisky/hero/optimized/${currentImageSet.base}-1920w.webp 1920w
                `}
                sizes="100vw"
                alt={currentImageSet.alt}
                className="w-full h-full object-cover object-center"
                loading={currentImageIndex === 0 ? "eager" : "lazy"}
              />
            </picture>
          </motion.div>
        </AnimatePresence>
        
        {/* Improved overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Carousel Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={togglePause}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label={isPaused ? "Resume carousel" : "Pause carousel"}
        >
          {isPaused ? (
            <PlayIcon className="w-5 h-5" />
          ) : (
            <PauseIcon className="w-5 h-5" />
          )}
        </button>
        
        {/* Carousel indicators */}
        <div className="flex gap-2">
          {heroImageSets.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-premium-gold w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pt-24 md:pt-28 lg:pt-0">
          <div className="max-w-5xl mx-auto lg:mx-0 lg:ml-28">
            {/* Hero Text with improved contrast */}
            <motion.h1
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-white drop-shadow-lg mb-8"
            >
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                INVEST IN
              </span>
              <span className="block text-gradient-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-tight leading-none my-4">
                RARE
              </span>
              <span className="block text-gradient-luxury text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                WHISKY CASKS
              </span>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl tracking-wide drop-shadow"
            >
              For over 180 years, whisky has proven itself as a high-performing alternative asset. 
              Access exclusive casks from Scotland's most prestigious distilleries with proven investment potential.
            </motion.p>

            {/* CTA Buttons with aria labels */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link 
                to="/contact" 
                className="btn-premium group inline-flex"
                aria-label="Start investing in whisky casks"
              >
                <span>Start Investing</span>
                <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="/Viticult-Whisky-2025-Brochure.pdf" 
                download="Viticult-Whisky-2025-Brochure.pdf"
                type="application/pdf"
                className="btn-secondary group inline-flex"
                aria-label="Download Viticult Whisky 2025 brochure"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DocumentArrowDownIcon className="mr-3 h-5 w-5" />
                <span>Download Brochure</span>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-16 flex flex-wrap gap-8 text-white/80"
            >
              {[
                { icon: '🌍', text: '100% Carbon-Neutral Distilleries', color: 'text-eco-green' },
                { icon: '✓', text: 'Trusted by 1,000+ Investors', color: 'text-premium-gold' },
                { icon: '📈', text: '12.5% Avg. Annual Returns', color: 'text-eco-green' },
                { icon: '💷', text: 'Min. Investment £3,000', color: 'text-premium-gold' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className={`text-2xl ${item.color} drop-shadow`}>{item.icon}</span>
                  <span className="text-sm font-medium tracking-wide uppercase drop-shadow">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-3">
          <span className="text-white/70 text-sm uppercase tracking-widest drop-shadow">Scroll to explore</span>
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
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