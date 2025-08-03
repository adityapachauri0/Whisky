import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Buy & Sell', path: '/buy-sell' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-primary-black/90 backdrop-blur-md shadow-2xl py-4 border-b border-premium-gold/10'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-premium-gold relative z-50"
            >
              <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wider">
                VITICULT
                <span className="block text-xs md:text-sm font-sans font-light tracking-[0.3em] text-text-secondary uppercase">
                  Whisky
                </span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`text-sm font-medium tracking-wide uppercase transition-all duration-300 relative group ${
                    location.pathname === item.path
                      ? 'text-premium-gold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-px bg-premium-gold transform origin-left transition-transform duration-300 ${
                    location.pathname === item.path
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative"
            >
              {/* Fizzing bubble effect */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: [-10, -60, -100],
                    x: [
                      0, 
                      Math.sin(i * 0.8) * 20,
                      Math.sin(i * 0.8) * 30
                    ],
                    opacity: [0, 0.7, 0],
                    scale: [0.3, 0.6 + (i % 3) * 0.2, 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                  style={{
                    left: `${15 + (i * 10)}%`,
                    bottom: '0%',
                  }}
                >
                  <div className={`
                    ${i % 3 === 0 ? 'w-2 h-2' : i % 3 === 1 ? 'w-1.5 h-1.5' : 'w-1 h-1'}
                    bg-gradient-to-br from-amber-300 to-yellow-200 rounded-full
                    shadow-[0_0_6px_rgba(251,191,36,0.4)]
                  `} />
                </motion.div>
              ))}
              
              {/* Subtle carbonation glow */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-t from-amber-400/30 to-transparent rounded-full blur-xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <Link to="/contact" className="relative btn-premium text-sm group overflow-hidden">
                <span className="flex items-center gap-2">
                  {/* Icon transformation container */}
                  <motion.div
                    className="relative w-5 h-5"
                    whileHover={{ scale: 1.2 }}
                  >
                    {/* Wallet icon */}
                    <motion.svg
                      className="absolute inset-0 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ 
                        opacity: [1, 1, 0, 0, 0, 0, 1, 1],
                        scale: [1, 1.1, 0.8, 0.8, 0.8, 0.8, 1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.1, 0.2, 0.3, 0.7, 0.8, 0.9, 1],
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </motion.svg>
                    
                    {/* Currency icon - Pound Sterling */}
                    <motion.div
                      className="absolute inset-0 w-5 h-5 flex items-center justify-center text-amber-600 font-bold text-lg"
                      animate={{ 
                        opacity: [0, 0, 0, 1, 1, 0, 0, 0],
                        scale: [0.8, 0.8, 0.8, 1, 1.1, 0.8, 0.8, 0.8],
                        rotate: [0, 0, 0, 0, 360, 360, 360, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1],
                      }}
                    >
                      £
                    </motion.div>
                    
                    {/* Chart icon */}
                    <motion.svg
                      className="absolute inset-0 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ 
                        opacity: [0, 0, 1, 1, 0, 0, 0, 0],
                        scale: [0.8, 0.8, 1, 1.1, 0.8, 0.8, 0.8, 0.8],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.1, 0.2, 0.3, 0.4, 0.7, 0.8, 1],
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </motion.svg>
                    
                    {/* Glow effect on icon change */}
                    <motion.div
                      className="absolute inset-0 bg-amber-400 rounded-full blur-md"
                      animate={{
                        opacity: [0, 0.6, 0, 0.6, 0, 0.6, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
                      }}
                    />
                  </motion.div>
                  
                  <span>Start Investing</span>
                  
                  <motion.svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
                
                {/* Additional hover bubbles */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  whileHover="hover"
                  variants={{
                    hover: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`hover-${i}`}
                      className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-0"
                      variants={{
                        hover: {
                          opacity: [0, 0.6, 0],
                          y: [0, -30],
                          x: [(i - 2) * 10, (i - 2) * 15],
                          scale: [0.5, 1, 0.3],
                        },
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                      style={{
                        left: '50%',
                        bottom: '20%',
                      }}
                    />
                  ))}
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-premium-gold hover:bg-premium-gold/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-6 pb-6 border-t border-premium-gold/10 pt-6"
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-base font-medium uppercase tracking-wide transition-colors duration-300 ${
                      location.pathname === item.path
                        ? 'text-premium-gold'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="relative inline-block mt-4">
                  {/* Mobile floating particles */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
                      initial={{ 
                        x: 0, 
                        y: 0,
                        opacity: 0 
                      }}
                      animate={{
                        x: [0, (i % 2 ? 1 : -1) * 30],
                        y: [-15, -40],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                      style={{
                        left: `${25 + i * 20}%`,
                        bottom: '0%',
                      }}
                    />
                  ))}
                  
                  {/* Mobile subtle glow */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full opacity-40 blur-md"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.4, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                  
                  <Link to="/contact" className="relative btn-premium inline-flex items-center justify-center text-center group">
                    <span className="relative flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      <span>Start Investing</span>
                      <motion.svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;