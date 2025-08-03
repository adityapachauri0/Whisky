import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChartBarIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const BuySellWhisky: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('sell');

  // Buy whisky casks data temporarily commented out
  // const buyWhiskyCasks = [ ... ];

  const sellBenefits = [
    {
      icon: ChartBarIcon,
      title: 'Expert Valuation',
      description: 'Get accurate market valuations from our whisky investment specialists'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Network',
      description: 'Access our worldwide network of serious collectors and investors'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Process',
      description: 'Safe, transparent, and fully insured transaction handling'
    }
  ];

  const sellProcess = [
    {
      step: '01',
      title: 'Submit Details',
      description: 'Provide information about your whisky cask including age, distillery, and cask type'
    },
    {
      step: '02',
      title: 'Expert Valuation',
      description: 'Our specialists will evaluate your cask and provide a comprehensive market valuation'
    },
    {
      step: '03',
      title: 'Market Listing',
      description: 'We list your cask to our exclusive network of collectors and investors'
    },
    {
      step: '04',
      title: 'Secure Sale',
      description: 'Complete the sale with full legal protection and guaranteed payment'
    }
  ];

  return (
    <section className="section-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 175, 55, 0.1) 35px, rgba(212, 175, 55, 0.1) 70px)`
        }} />
      </div>
      
      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
            Buy & Sell <span className="text-gradient-gold">Premium Whisky</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Whether you're looking to invest or liquidate, we provide expert guidance and access to the finest whisky casks
          </p>
          <div className="divider-gold mt-8" />
        </motion.div>

        {/* Tab Navigation - Buy section disabled */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-rich-brown/50 backdrop-blur-sm rounded-none p-1 border border-premium-gold/30">
            {/* Buy Whisky tab hidden - section temporarily disabled */}
            <button
              onClick={() => setActiveTab('sell')}
              className="px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold text-primary-black"
            >
              Sell Whisky
            </button>
          </div>
        </div>

        {/* Buy Section - TEMPORARILY DISABLED */}
        {/* 
        {activeTab === 'buy' && (
          // Buy section content commented out - will be re-enabled when requested
        )}
        */}

        {/* Sell Section */}
        {activeTab === 'sell' && (
          <motion.div
            id="sell-casks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              {/* Sell Header */}
              <div className="text-center mb-12">
                <h3 className="font-serif text-3xl text-text-primary mb-4">
                  Turn Your Whisky Investment Into Profit
                </h3>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Our expert team helps you achieve the best possible return on your whisky cask investment
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {sellBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="card-dark p-8 text-center"
                  >
                    <benefit.icon className="h-12 w-12 text-premium-gold mb-4 mx-auto" />
                    <h4 className="font-serif text-xl text-text-primary mb-2">{benefit.title}</h4>
                    <p className="text-text-secondary text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Selling Process */}
              <div className="mb-16">
                <h4 className="font-serif text-2xl text-text-primary text-center mb-12">
                  Our Simple 4-Step Process
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {sellProcess.map((process, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold rounded-full flex items-center justify-center">
                        <span className="font-serif text-2xl text-primary-black">{process.step}</span>
                      </div>
                      <h5 className="font-medium text-text-primary mb-2">{process.title}</h5>
                      <p className="text-text-secondary text-sm">{process.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  to="/sell-whisky"
                  className="btn-premium inline-flex items-center group"
                >
                  Start Selling Now
                  <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BuySellWhisky;