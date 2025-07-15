import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'investment', name: 'Investment Process' },
    { id: 'returns', name: 'Returns & Performance' },
    { id: 'storage', name: 'Storage & Security' },
    { id: 'selling', name: 'Selling & Exit' },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'What is whisky cask investment?',
      answer: 'Whisky cask investment involves purchasing entire casks of whisky directly from distilleries or through specialized brokers. As the whisky ages, it typically increases in value due to maturation, evaporation (the "angel\'s share"), and growing market demand. Investors can hold casks for several years before selling them to collectors, independent bottlers, or back to distilleries.',
      category: 'getting-started',
    },
    {
      question: 'Why is whisky investment so popular?',
      answer: 'Whisky has demonstrated its potential as an excellent alternative investment. As a tangible asset, it has provided more financial security than many traditional investments, with values typically appreciating over time. The global whisky market has grown significantly, driven by increasing demand from emerging markets and collectors seeking rare and aged spirits.',
      category: 'getting-started',
    },
    {
      question: 'What is the minimum investment required?',
      answer: 'Our minimum investment starts at £5,000 for our Starter package, which includes a single cask ownership. We also offer Premium packages starting at £25,000 and Exclusive packages for investments of £50,000 or more. Each tier provides different levels of service, portfolio options, and investment opportunities.',
      category: 'investment',
    },
    {
      question: 'How do I know my investment is secure?',
      answer: 'Your whisky casks are stored in government-bonded warehouses with 24/7 security, comprehensive insurance, and strict inventory controls. You receive official ownership documentation from the distillery, and we provide regular authentication certificates. Additionally, all casks are uniquely numbered and tracked in the warehouse management system.',
      category: 'storage',
    },
    {
      question: 'What returns can I expect from whisky investment?',
      answer: 'While past performance doesn\'t guarantee future results, whisky cask investments have historically averaged returns of 12-15% annually. Premium and rare casks have sometimes achieved even higher returns. Factors affecting returns include the distillery\'s reputation, the whisky\'s age, rarity, and market demand.',
      category: 'returns',
    },
    {
      question: 'Is whisky investment tax-free?',
      answer: 'In many jurisdictions, whisky is classified as a "wasting asset" with a predictable lifespan of less than 50 years, making it exempt from capital gains tax. However, tax regulations vary by country, and we strongly recommend consulting with a tax professional about your specific situation.',
      category: 'returns',
    },
    {
      question: 'How long should I hold my whisky investment?',
      answer: 'We typically recommend holding casks for a minimum of 3-5 years to capitalize on optimal growth and returns. However, the ideal holding period depends on the specific cask, market conditions, and your investment goals. Generally, the longer you hold a cask, the more valuable it becomes, with some investors holding premium casks for 10-20 years.',
      category: 'investment',
    },
    {
      question: 'Can I visit and taste my whisky?',
      answer: 'Yes! We arrange exclusive distillery visits for our investors, where you can see your casks and sample your whisky (subject to distillery regulations). Premium and Exclusive package holders receive complimentary annual visits, while Starter package holders can arrange visits for a nominal fee.',
      category: 'investment',
    },
    {
      question: 'What happens if I want to sell my cask?',
      answer: 'We provide comprehensive exit strategy support when you\'re ready to sell. Options include selling to private collectors through our global network, selling to independent bottlers, or in some cases, selling back to the distillery. We handle valuations, negotiations, and all transfer documentation to ensure a smooth transaction.',
      category: 'selling',
    },
    {
      question: 'Can I bottle my whisky instead of selling the cask?',
      answer: 'Absolutely! Many investors choose to bottle their whisky for personal consumption or as gifts. We can arrange professional bottling services, including custom labeling and packaging. This option is particularly popular for special occasions or when a cask has reached exceptional quality.',
      category: 'selling',
    },
    {
      question: 'What if something happens to the distillery?',
      answer: 'Your investment is protected through comprehensive insurance that covers various risks. Additionally, even if a distillery closes, existing casks often become more valuable due to their rarity. We only work with established distilleries with strong track records and financial stability.',
      category: 'storage',
    },
    {
      question: 'How do I track my investment\'s performance?',
      answer: 'All investors receive access to our online portal where you can track your cask\'s current valuation, view market trends, and access your documentation. Depending on your package level, you\'ll receive quarterly or monthly performance reports with detailed analysis and market insights.',
      category: 'investment',
    },
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Find answers to common questions about whisky cask investment, returns, storage, and more." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/shop-secrets-smoke.webp"
            alt="Premium whisky knowledge and expertise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/70 to-charcoal/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-premium-gold/20 backdrop-blur-sm rounded-full mb-6"
              >
                <svg className="w-5 h-5 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-premium-gold font-semibold tracking-wider text-sm uppercase">Knowledge Center</span>
              </motion.div>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">
                Frequently Asked
                <span className="block text-gradient-gold italic mt-2">Questions</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Expert answers to guide your whisky investment journey
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-premium-gold animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section className="section bg-gradient-to-b from-white to-whisky-50">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-antique-gold to-premium-gold text-charcoal shadow-lg transform scale-105'
                    : 'bg-white border border-whisky-200 text-charcoal/70 hover:bg-whisky-50 hover:border-premium-gold/30'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white border border-whisky-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-whisky-50 transition-colors duration-200 group"
                >
                  <h3 className="font-serif text-lg md:text-xl text-charcoal pr-4 group-hover:text-irish-green transition-colors">{faq.question}</h3>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-whisky-100 group-hover:bg-premium-gold/20 transition-all duration-300 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}>
                    <ChevronDownIcon className="h-5 w-5 text-charcoal/60 group-hover:text-premium-gold" />
                  </div>
                </button>
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-6 border-t border-whisky-100">
                        <p className="text-charcoal/80 leading-relaxed pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-whisky-100 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="heading-2 text-charcoal mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8">
              Our investment specialists are here to help you understand every aspect of whisky investment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary group">
                Book Free Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="tel:+1234567890" className="btn-secondary">
                Call Us: +1 (234) 567-890
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQ;