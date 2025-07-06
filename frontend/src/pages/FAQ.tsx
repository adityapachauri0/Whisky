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
      question: 'What is whiskey cask investment?',
      answer: 'Whiskey cask investment involves purchasing entire casks of whiskey directly from distilleries or through specialized brokers. As the whiskey ages, it typically increases in value due to maturation, evaporation (the "angel\'s share"), and growing market demand. Investors can hold casks for several years before selling them to collectors, independent bottlers, or back to distilleries.',
      category: 'getting-started',
    },
    {
      question: 'Why is whiskey investment so popular?',
      answer: 'Whiskey has demonstrated its potential as an excellent alternative investment. As a tangible asset, it has provided more financial security than many traditional investments, with values typically appreciating over time. The global whiskey market has grown significantly, driven by increasing demand from emerging markets and collectors seeking rare and aged spirits.',
      category: 'getting-started',
    },
    {
      question: 'What is the minimum investment required?',
      answer: 'Our minimum investment starts at €5,000 for our Starter package, which includes a single cask ownership. We also offer Premium packages starting at €25,000 and Exclusive packages for investments of €50,000 or more. Each tier provides different levels of service, portfolio options, and investment opportunities.',
      category: 'investment',
    },
    {
      question: 'How do I know my investment is secure?',
      answer: 'Your whiskey casks are stored in government-bonded warehouses with 24/7 security, comprehensive insurance, and strict inventory controls. You receive official ownership documentation from the distillery, and we provide regular authentication certificates. Additionally, all casks are uniquely numbered and tracked in the warehouse management system.',
      category: 'storage',
    },
    {
      question: 'What returns can I expect from whiskey investment?',
      answer: 'While past performance doesn\'t guarantee future results, whiskey cask investments have historically averaged returns of 12-15% annually. Premium and rare casks have sometimes achieved even higher returns. Factors affecting returns include the distillery\'s reputation, the whiskey\'s age, rarity, and market demand.',
      category: 'returns',
    },
    {
      question: 'Is whiskey investment tax-free?',
      answer: 'In many jurisdictions, whiskey is classified as a "wasting asset" with a predictable lifespan of less than 50 years, making it exempt from capital gains tax. However, tax regulations vary by country, and we strongly recommend consulting with a tax professional about your specific situation.',
      category: 'returns',
    },
    {
      question: 'How long should I hold my whiskey investment?',
      answer: 'We typically recommend holding casks for a minimum of 3-5 years to capitalize on optimal growth and returns. However, the ideal holding period depends on the specific cask, market conditions, and your investment goals. Generally, the longer you hold a cask, the more valuable it becomes, with some investors holding premium casks for 10-20 years.',
      category: 'investment',
    },
    {
      question: 'Can I visit and taste my whiskey?',
      answer: 'Yes! We arrange exclusive distillery visits for our investors, where you can see your casks and sample your whiskey (subject to distillery regulations). Premium and Exclusive package holders receive complimentary annual visits, while Starter package holders can arrange visits for a nominal fee.',
      category: 'investment',
    },
    {
      question: 'What happens if I want to sell my cask?',
      answer: 'We provide comprehensive exit strategy support when you\'re ready to sell. Options include selling to private collectors through our global network, selling to independent bottlers, or in some cases, selling back to the distillery. We handle valuations, negotiations, and all transfer documentation to ensure a smooth transaction.',
      category: 'selling',
    },
    {
      question: 'Can I bottle my whiskey instead of selling the cask?',
      answer: 'Absolutely! Many investors choose to bottle their whiskey for personal consumption or as gifts. We can arrange professional bottling services, including custom labeling and packaging. This option is particularly popular for special occasions or when a cask has reached exceptional quality.',
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
          content="Find answers to common questions about whiskey cask investment, returns, storage, and more." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="heading-1 text-white mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-white/90">
                Everything you need to know about whiskey investment
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section bg-white">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gold text-charcoal'
                    : 'bg-whiskey-100 text-charcoal/70 hover:bg-whiskey-200'
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
                className="bg-whiskey-50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-whiskey-100 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-charcoal pr-4">{faq.question}</h3>
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-charcoal/60 transition-transform duration-300 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4">
                        <p className="text-charcoal/70 leading-relaxed">{faq.answer}</p>
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
      <section className="section bg-gradient-to-br from-whiskey-100 to-white">
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
              Our investment specialists are here to help you understand every aspect of whiskey investment
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