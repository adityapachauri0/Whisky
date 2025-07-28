import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const CTA: React.FC = () => {
  return (
    <section className="section relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/whisky/tfandr-whisky-barrels.webp" 
          alt="Whisky barrels background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-black/95 via-primary-black/90 to-primary-black/95" />
      </div>
      
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="bg-pattern-whisky h-full w-full" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="heading-2 text-white mb-6">
            Ready to Start Your <span className="text-eco-green">Sustainable</span> Whisky Investment Journey?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Join an exclusive community of investors who understand that the finest things in life 
            can also be the most responsible investments. Partner with carbon-neutral distilleries today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="btn-primary group text-lg px-8 py-4"
            >
              Book Free Consultation
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/how-it-works" 
              className="btn-white group text-lg px-8 py-4"
            >
              Learn More
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { label: 'Minimum Investment', value: '£5,000' },
              { label: 'Average Returns', value: '12.5% p.a.' },
              { label: 'Carbon Neutral', value: '100%' },
              { label: 'Investment Period', value: '3-10 years' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-gold rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold rounded-full blur-3xl"
      />
    </section>
  );
};

export default CTA;