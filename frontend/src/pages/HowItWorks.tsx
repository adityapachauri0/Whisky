import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HowItWorks: React.FC = () => {
  const threeStepProcess = [
    {
      number: '01',
      title: 'Select Your Cask',
      description: 'Browse our curated selection of premium whisky casks from Scotland\'s finest distilleries. Each cask is carefully vetted for quality, provenance, and investment potential.',
      image: '/whisky/casks/dalmore-premium-casks.webp',
      features: [
        'Expert cask recommendations',
        'Detailed provenance reports',
        'Historical performance data',
        'Risk assessment profiles'
      ]
    },
    {
      number: '02',
      title: 'Secure Ownership',
      description: 'Complete your purchase with full legal protection and documentation. Your cask remains safely stored in government-bonded warehouses while it matures.',
      image: '/whisky/casks/dalmore-warehouse-casks.webp',
      features: [
        'Legal ownership transfer',
        'Bonded warehouse storage',
        'Comprehensive insurance',
        'Digital ownership certificate'
      ]
    },
    {
      number: '03',
      title: 'Monitor & Exit',
      description: 'Track your investment\'s performance with regular valuations and market insights. When ready, we facilitate the sale through our global network.',
      image: '/whisky/hero/dalmore-principal-collection.webp',
      features: [
        'Quarterly valuations',
        'Market performance reports',
        'Exit strategy planning',
        'Global buyer network access'
      ]
    }
  ];

  const timeline = [
    { year: 'Year 0', event: 'Initial Investment', description: 'Purchase your first cask' },
    { year: 'Year 1-3', event: 'Early Maturation', description: 'Monitor growth and market trends' },
    { year: 'Year 3-5', event: 'Value Appreciation', description: 'Significant value increase typical' },
    { year: 'Year 5-10', event: 'Premium Returns', description: 'Optimal exit window for most casks' },
    { year: 'Year 10+', event: 'Rare & Exceptional', description: 'Ultra-premium status achieved' },
  ];

  return (
    <>
      <Helmet>
        <title>How Whisky Cask Investment Works | 3-Step Process | ViticultWhisky</title>
        <meta 
          name="description" 
          content="Discover how whisky cask investment works with our simple 3-step process. From cask selection to ownership and exit strategies. Start investing today." 
        />
        <meta name="keywords" content="how whisky investment works, cask investment process, whisky investment steps, Scottish cask investment guide" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://viticultwhisky.co.uk/how-it-works" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How Whisky Cask Investment Works | 3-Step Process" />
        <meta property="og:description" content="Learn the simple 3-step process for investing in premium Scottish whisky casks with guaranteed returns." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://viticultwhisky.co.uk/how-it-works" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/hero/dalmore-principal-collection.webp" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Whisky Cask Investment Works | 3-Step Process" />
        <meta name="twitter:description" content="Learn the simple 3-step process for investing in premium Scottish whisky casks." />
        <meta name="twitter:image" content="https://viticultwhisky.co.uk/whisky/hero/dalmore-principal-collection.webp" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/videos/hero-video-new.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/70 to-gray-900" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                How It Works
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-light mb-8">
                Your whisky investment journey in three simple steps
              </p>
              <div className="w-32 h-1 bg-amber-600 mx-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Three Steps to Ownership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've simplified whisky cask investment into a straightforward process that takes the complexity out of alternative asset ownership.
            </p>
          </motion.div>

          <div className="space-y-32">
            {threeStepProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative">
                    <span className="text-8xl font-bold text-amber-600/10 absolute -top-12 -left-8">
                      {step.number}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 relative z-10">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-4">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative overflow-hidden rounded-2xl shadow-2xl"
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Timeline */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/whisky/casks/dalmore-oak-barrels.webp"
            alt="Aged whisky barrels"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/85" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Investment Timeline
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch your investment mature and appreciate over time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-amber-600 text-white p-6 rounded-lg mb-4">
                  <h3 className="text-2xl font-bold mb-2">{item.year}</h3>
                  <p className="text-sm">{item.event}</p>
                </div>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of investors who have discovered the rewards of whisky cask ownership
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/buy-sell" className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/30">
                Browse Available Casks
              </Link>
              <Link to="/contact" className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 group">
                Book Free Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;