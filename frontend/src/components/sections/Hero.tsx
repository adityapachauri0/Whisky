import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '../common/OptimizedImage';

interface HeroProps {
  videoUrl?: string;
  imageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  videoUrl = 'https://cdn.coverr.co/videos/coverr-pouring-whisky-into-a-glass-4066/1080p.mp4',
  imageUrl = '/whisky-barrels.jpg'
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  const heroImages = [
    '/images/hero/hero-1.jpg',
    '/images/hero/hero-2.jpg',
    '/images/hero/hero-3.jpg',
    '/images/hero/hero-4.jpg'
  ];
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  React.useEffect(() => {
    console.log('Hero component mounted, current image:', heroImages[currentImageIndex]);
  }, [currentImageIndex, heroImages]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-primary-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={heroImages[currentImageIndex]}
          alt="Premium whisky collection"
          className="w-full h-full object-cover transition-opacity duration-1000"
          width="100%"
          height="100%"
          effect="opacity"
          threshold={0}
          onLoad={() => {
            console.log('Image loaded successfully:', heroImages[currentImageIndex]);
            setImageLoaded(true);
          }}
          onError={() => {
            console.error('Image failed to load:', heroImages[currentImageIndex]);
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-20 2xl:px-32">
          <div className="max-w-5xl mx-auto lg:mx-0 lg:ml-auto lg:mr-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-text-primary mb-8 leading-tight text-shadow-luxury">
                In Every Cask Lies a{' '}
                <span className="text-gradient-gold">Story</span>
                <br />
                And a Smart{' '}
                <span className="text-gradient-gold">Investment</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-2xl"
            >
              Join the exclusive world of whisky investment. 
              Build a portfolio of premium casks with potential returns that mature like fine whisky.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link to="/contact" className="btn-premium group">
                Start Investing
                <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/how-it-works" className="btn-secondary group">
                <PlayIcon className="mr-3 h-5 w-5" />
                Watch How It Works
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-16 flex flex-wrap gap-8 text-text-secondary"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-premium-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">Trusted by 1,000+ Investors</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-premium-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">Fully Insured & Secured</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-premium-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span className="text-sm font-medium tracking-wide uppercase">12.5% Avg. Annual Returns</span>
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