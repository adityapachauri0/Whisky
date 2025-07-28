import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChartBarIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const BuySellWhisky: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const buyWhiskyCasks = [
    {
      id: 1,
      name: 'Highland Single Malt 2018',
      distillery: 'The Dalmore',
      age: '5 Years',
      price: '£12,500',
      image: '/whisky/shop-bottle-12.webp',
      description: 'Premium Highland single malt with exceptional aging potential',
      abv: '43%',
      caskType: 'Ex-Bourbon'
    },
    {
      id: 2,
      name: 'Islay Peated Cask 2019',
      distillery: 'Lagavulin',
      age: '4 Years',
      price: '£18,750',
      image: '/whisky/shop-bottle-3.webp',
      description: 'Heavily peated Islay whisky with strong investment growth',
      abv: '46%',
      caskType: 'First Fill Sherry'
    },
    {
      id: 3,
      name: 'Speyside Reserve 2017',
      distillery: 'The Macallan',
      age: '6 Years',
      price: '£45,000',
      image: '/whisky/shop-daftmill-2011.webp',
      description: 'Rare Speyside cask from renowned Macallan distillery',
      abv: '48%',
      caskType: 'European Oak'
    },
    {
      id: 4,
      name: 'Highland Park 2016',
      distillery: 'Highland Park',
      age: '7 Years',
      price: '£28,500',
      image: '/whisky/shop-bottle-7.webp',
      description: 'Exceptional Orkney single malt with complex character',
      abv: '45%',
      caskType: 'Sherry Butt'
    }
  ];

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

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-rich-brown/50 backdrop-blur-sm rounded-none p-1 border border-premium-gold/30">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold text-primary-black'
                  : 'text-text-secondary hover:text-premium-gold'
              }`}
            >
              Buy Whisky
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold text-primary-black'
                  : 'text-text-secondary hover:text-premium-gold'
              }`}
            >
              Sell Whisky
            </button>
          </div>
        </div>

        {/* Buy Section */}
        {activeTab === 'buy' && (
          <motion.div
            id="buy-casks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h3 className="font-serif text-3xl text-text-primary mb-4">
                Investment-Grade Whisky Casks
              </h3>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Carefully selected casks from Scotland's most prestigious distilleries with proven investment potential
              </p>
            </div>

            {/* Cask Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {buyWhiskyCasks.map((cask, index) => (
                <motion.div
                  key={cask.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="card-luxury h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={cask.image}
                        alt={cask.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-serif text-2xl text-text-primary mb-2 group-hover:text-premium-gold transition-colors">
                          {cask.name}
                        </h3>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-premium-gold font-medium tracking-wider uppercase text-sm">
                            {cask.distillery}
                          </span>
                          <span className="text-text-secondary text-sm">{cask.age}</span>
                        </div>
                        <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                          {cask.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mb-4">
                          <div>
                            <span className="text-premium-gold">ABV:</span> {cask.abv}
                          </div>
                          <div>
                            <span className="text-premium-gold">Cask:</span> {cask.caskType}
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-premium-gold/20 pt-4 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="font-serif text-3xl text-text-primary">{cask.price}</span>
                          <Link to="/contact" className="btn-premium-small group inline-flex items-center">
                            Enquire
                            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All CTA */}
            <div className="text-center">
              <Link to="/buy" className="btn-secondary inline-flex items-center group">
                View Full Collection
                <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}

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