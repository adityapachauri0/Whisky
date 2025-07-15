import React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Features: React.FC = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'Fine & Rare',
      description: 'Access exclusive casks from renowned distilleries, including limited editions and vintage collections that appreciate in value over time.',
    },
    {
      icon: HandRaisedIcon,
      title: 'Truly Hands-Off',
      description: 'We handle everything from selection to storage. Your investment matures in optimal conditions while you enjoy complete peace of mind.',
    },
    {
      icon: ChartBarIcon,
      title: 'High Performing Asset',
      description: 'Whisky has outperformed traditional investments with average annual returns of 12.5% over the past decade.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Financially Minded',
      description: 'Strategic portfolio diversification with a tangible asset that combines passion with profit potential.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Fully Insured',
      description: 'Your casks are stored in government-bonded warehouses with comprehensive insurance coverage.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Market Access',
      description: 'Tap into the growing global demand for premium whisky with our international network of buyers.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section className="section-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)`
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
            Why Choose <span className="text-gradient-gold">Whisky Investment?</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover the advantages of adding premium whisky casks to your investment portfolio
          </p>
          <div className="divider-gold mt-8" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="card-luxury-border h-full p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                <div className="relative z-10">
                  <div className="inline-flex p-4 rounded-lg bg-premium-gold/10 mb-6 group-hover:bg-premium-gold/20 transition-colors duration-300">
                    <feature.icon className="h-7 w-7 text-premium-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-text-primary mb-4">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 relative"
        >
          <div className="bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold p-px rounded-xl">
            <div className="bg-primary-black rounded-xl py-12 px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '€2B+', label: 'Market Value' },
                  { value: '12.5%', label: 'Avg. Annual Return' },
                  { value: '1000+', label: 'Active Investors' },
                  { value: '98%', label: 'Client Satisfaction' },
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-gradient-gold font-serif">
                      {stat.value}
                    </div>
                    <div className="text-sm uppercase tracking-widest text-text-secondary">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;