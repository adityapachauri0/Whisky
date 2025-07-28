import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const BarrelShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-primary-black to-amber-950/20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5lg lg:text-6xl text-text-primary mb-6">
            Discover Our <span className="text-gradient-gold">Aged Collection</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Explore premium whisky casks from Scotland's finest distilleries, 
            each with its own story and investment potential.
          </p>
        </motion.div>

        {/* Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-amber-700/30 
                          group-hover:border-premium-gold/50 transition-all duration-300">
              <div className="text-center">
                <div className="text-6xl font-bold text-premium-gold mb-2">12</div>
                <div className="text-xl text-amber-100 mb-4">Years</div>
                <h3 className="font-serif text-2xl text-text-primary mb-2">Highland Reserve</h3>
                <p className="text-text-secondary">Entry-level investment with strong growth potential</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-amber-700/30 
                          group-hover:border-premium-gold/50 transition-all duration-300">
              <div className="text-center">
                <div className="text-6xl font-bold text-premium-gold mb-2">18</div>
                <div className="text-xl text-amber-100 mb-4">Years</div>
                <h3 className="font-serif text-2xl text-text-primary mb-2">Speyside Elite</h3>
                <p className="text-text-secondary">Premium casks with exceptional complexity</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-amber-700/30 
                          group-hover:border-premium-gold/50 transition-all duration-300">
              <div className="text-center">
                <div className="text-6xl font-bold text-premium-gold mb-2">25</div>
                <div className="text-xl text-amber-100 mb-4">Years</div>
                <h3 className="font-serif text-2xl text-text-primary mb-2">Islay Prestige</h3>
                <p className="text-text-secondary">Ultra-rare casks for discerning collectors</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/how-it-works" className="btn-premium inline-flex items-center group">
            Learn More
            <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BarrelShowcase;