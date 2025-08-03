import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import BuySellWhisky from '../components/sections/BuySellWhisky';

const BuySell: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Buy & Sell Whisky Casks | Premium Investment Opportunities</title>
        <meta name="description" content="Buy premium whisky casks or sell your existing investments through our expert network." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 hero-zoom">
          <img
            src="/whisky/buy-sell/hero-buysell.webp"
            alt="Premium whisky investment marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/60 to-charcoal/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 via-transparent to-charcoal/30" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 bg-premium-gold/20 backdrop-blur-sm rounded-full text-premium-gold font-semibold tracking-wider text-sm uppercase">
              Premium Cask Investment
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8"
          >
            Buy & Sell
            <span className="block text-gradient-gold italic mt-2">Whisky Casks</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto mb-10 leading-relaxed"
          >
            Access rare cask opportunities from Scotland's most prestigious distilleries
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Buy casks button temporarily disabled */}
            <a
              href="#sell-casks"
              className="btn-primary group"
            >
              Value Your Cask
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/contact"
              className="btn-secondary"
            >
              Contact Us
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-sm uppercase tracking-wider mb-2">Scroll to explore</span>
            <svg className="w-6 h-6 text-premium-gold animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Buy & Sell Section */}
      <BuySellWhisky />

      {/* Additional Info Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Trade With Us?
              </h2>
              <p className="text-xl text-gray-600">
                Over 20 years of expertise in the whisky investment market
              </p>
            </motion.div>

            {/* Buy functionality temporarily disabled - focusing on selling services */}
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                  Selling Your Whisky Casks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Competitive market valuations</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Quick and secure transaction process</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Access to global buyer network</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Professional marketing of your cask</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuySell;