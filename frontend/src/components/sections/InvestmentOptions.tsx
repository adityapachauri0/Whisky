import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const InvestmentOptions: React.FC = () => {
  const packages = [
    {
      name: 'Starter',
      price: '£5,000',
      description: 'Perfect for beginners looking to explore sustainable whisky investment',
      features: [
        'Single cask ownership',
        'Carbon-neutral distilleries',
        'Annual portfolio review',
        'Basic market insights',
        'Email support',
        'Quarterly updates',
      ],
      featured: false,
      color: 'border-eco-green',
    },
    {
      name: 'Premium',
      price: '£25,000',
      description: 'Ideal for serious investors seeking sustainable portfolio diversification',
      features: [
        'Multiple cask portfolio',
        'Exclusively carbon-neutral',
        'Quarterly portfolio review',
        'Advanced market analytics',
        'Priority phone support',
        'Monthly updates',
        'Exit strategy planning',
        'VIP eco-distillery tours',
      ],
      featured: true,
      color: 'border-gold',
    },
    {
      name: 'Exclusive',
      price: '£50,000+',
      description: 'For connoisseurs seeking rare and exceptional sustainable opportunities',
      features: [
        'Rare & vintage eco-casks',
        'Carbon-negative options',
        'Monthly portfolio review',
        'Personal investment advisor',
        '24/7 concierge support',
        'Weekly market reports',
        'Private tastings',
        'First access to new releases',
        'Bespoke exit strategies',
      ],
      featured: false,
      color: 'border-carbon-neutral',
    },
  ];

  return (
    <section className="section relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/whisky/distillery.webp" 
          alt="Distillery background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/95 via-charcoal-light/90 to-charcoal/95" />
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="heading-2 text-white mb-4">
            <span className="text-eco-green">Sustainable</span> Investment Packages
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Choose the investment level that matches your goals and commitment to carbon-neutral whisky
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative ${pkg.featured ? 'lg:-mt-8' : ''}`}
            >
              {pkg.featured && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gold text-charcoal px-6 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div
                className={`h-full bg-white rounded-2xl shadow-xl border-2 ${pkg.color} 
                  ${pkg.featured ? 'border-4' : ''} overflow-hidden transform transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl`}
              >
                <div className="p-8">
                  <h3 className="heading-3 text-charcoal mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-charcoal">{pkg.price}</span>
                    <span className="text-charcoal/60 ml-2">minimum</span>
                  </div>
                  <p className="text-charcoal/70 mb-8">{pkg.description}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-gold mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-charcoal/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/contact"
                    className={`w-full ${
                      pkg.featured ? 'btn-primary' : 'btn-secondary'
                    } text-center`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-white/70">
            Need a custom investment plan?{' '}
            <Link to="/contact" className="text-gold hover:text-gold-light transition-colors font-semibold">
              Contact our advisors
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentOptions;