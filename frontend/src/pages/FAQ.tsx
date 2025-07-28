import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SchemaMarkup from '../components/common/SchemaMarkup';
import { 
  ChevronDownIcon, 
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CurrencyPoundIcon,
  LockClosedIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CalculatorIcon,
  InformationCircleIcon,
  PlayIcon,
  CubeIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

// Import data and components
import { faqSections, angelsShareData, costBreakdownData, returnsComparisonData } from '../data/faqData';
import AngelsShareChart from '../components/charts/AngelsShareChart';
import CostBreakdownChart from '../components/charts/CostBreakdownChart';
import ReturnsComparisonChart from '../components/charts/ReturnsComparisonChart';
import InvestmentTimeline from '../components/charts/InvestmentTimeline';
import ROICalculator from '../components/calculators/ROICalculator';
import RiskMitigationMatrix from '../components/infographics/RiskMitigationMatrix';

const FAQ: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>('what-is-whiskey-investment');

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'info': return <InformationCircleIcon className="w-6 h-6" />;
      case 'process': return <PlayIcon className="w-6 h-6" />;
      case 'chart': return <ChartBarIcon className="w-6 h-6" />;
      case 'calculator': return <CalculatorIcon className="w-6 h-6" />;
      case 'trending': return <ArrowTrendingUpIcon className="w-6 h-6" />;
      case 'shield': return <ShieldCheckIcon className="w-6 h-6" />;
      case 'start': return <SparklesIcon className="w-6 h-6" />;
      default: return <CubeIcon className="w-6 h-6" />;
    }
  };

  const renderTable = (table: { headers: string[]; rows: string[][] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gold-light/20">
            {table.headers.map((header, idx) => (
              <th key={idx} className="px-4 py-3 text-whisky-amber font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, idx) => (
            <tr key={idx} className="border-b border-gold-light/10 hover:bg-rich-brown/10">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3 text-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVisual = (section: any) => {
    if (!section.visual) return null;

    switch (section.visual.type) {
      case 'graph':
        if (section.id === 'angels-share') {
          return <AngelsShareChart data={angelsShareData} />;
        } else if (section.id === 'understanding-returns') {
          return <ReturnsComparisonChart data={returnsComparisonData} />;
        }
        break;
      case 'chart':
        if (section.id === 'cost-structure') {
          return <CostBreakdownChart data={costBreakdownData} />;
        }
        break;
      case 'timeline':
        return <InvestmentTimeline />;
      case 'calculator':
        return <ROICalculator />;
      case 'infographic':
        return <RiskMitigationMatrix />;
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>Comprehensive Guide to Whisky Cask Investment FAQ - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Complete FAQ guide to Scottish whisky cask investment including process, returns, risks, storage, and expert tools. Learn everything about investing in premium whisky casks." 
        />
        <meta name="keywords" content="whisky investment FAQ, cask investment guide, Scottish whisky investment, whisky cask questions, investment FAQ" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Whisky Cask Investment FAQ - Complete Guide" />
        <meta property="og:description" content="Expert answers to all your whisky cask investment questions. Storage, returns, risks, and processes explained." />
        <meta property="og:url" content="https://viticultwhisky.co.uk/faq" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/upscaled/FAQ_2.webp" />
        
        <link rel="canonical" href="https://viticultwhisky.co.uk/faq" />
      </Helmet>

      {/* FAQ Schema Markup */}
      <SchemaMarkup type="faq" data={{
        faqs: [
          {
            "@type": "Question",
            "name": "How does whisky cask investment work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Whisky cask investment involves purchasing whole casks of maturing whisky directly from Scottish distilleries. As the whisky ages in bonded warehouses, it typically increases in value due to evaporation (angel's share), brand appreciation, and growing market demand. Investors can sell their casks back to the market or to collectors after the maturation period."
            }
          },
          {
            "@type": "Question",
            "name": "What are the minimum investment amounts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our whisky cask investments typically start from £5,000 for premium casks, with most investment opportunities ranging between £15,000 to £50,000 depending on the distillery, age, cask type, and market positioning. We offer guidance to help you choose the right investment level for your portfolio."
            }
          },
          {
            "@type": "Question",
            "name": "How are the casks stored and insured?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "All casks are stored in HMRC bonded warehouses in Scotland under optimal conditions with temperature control, humidity management, and 24/7 security. Each cask is fully insured, and we provide comprehensive storage documentation and regular monitoring reports to ensure your investment is protected."
            }
          },
          {
            "@type": "Question",
            "name": "What returns can I expect from whisky cask investment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Historical performance shows whisky investments have delivered 8-15% annual returns over 10-15 year periods, often outperforming traditional assets. However, returns vary based on distillery reputation, cask type, market conditions, and holding period. Past performance doesn't guarantee future results."
            }
          },
          {
            "@type": "Question",
            "name": "What is the angel's share and how does it affect my investment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The angel's share refers to the natural evaporation of whisky during maturation, typically 2-4% per year in Scottish climate. While this reduces volume, the remaining whisky becomes more concentrated and valuable. This process is factored into our investment calculations and often enhances the final value per litre."
            }
          },
          {
            "@type": "Question",
            "name": "How do I sell my whisky cask when I'm ready to exit?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide multiple exit strategies including our marketplace for connecting with buyers, direct buyback options, and connections to auction houses and collectors. Our team assists with valuation, documentation, and transfer processes to ensure smooth transactions when you're ready to sell."
            }
          }
        ]
      }} />
      
      <SchemaMarkup type="breadcrumb" data={{
        breadcrumbs: [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://viticultwhisky.co.uk"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "FAQ",
            "item": "https://viticultwhisky.co.uk/faq"
          }
        ]
      }} />

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-[#3E1A0F] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/whisky/upscaled/FAQ_2.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-black/70 via-primary-black/50 to-primary-black/90" />
        </div>
        
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-whisky-amber/20 backdrop-blur-md rounded-full mb-6 border border-whisky-amber/30"
              >
                <DocumentChartBarIcon className="w-5 h-5 text-whisky-amber" />
                <span className="text-whisky-amber font-semibold tracking-wider text-sm uppercase">Comprehensive Guide</span>
              </motion.div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
                Everything You Need to Know About
                <span className="block text-gradient-gold italic mt-2">Whiskey Cask Investment</span>
              </h1>
              
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Discover comprehensive insights, tools, and strategies for successful whiskey cask investment
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-primary-black border-b border-gold-light/20">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {faqSections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActiveSection(activeSection === section.id ? null : section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-whisky-amber text-primary-black'
                    : 'bg-rich-brown/20 text-text-secondary hover:bg-rich-brown/40 hover:text-text-primary'
                }`}
              >
                {getIcon(section.icon)}
                <span>{section.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gradient-to-b from-primary-black to-rich-brown/20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto space-y-16">
            {faqSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="scroll-mt-24"
              >
                {/* Section Header */}
                <div className="mb-8">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    whileHover={{ x: 10 }}
                  >
                    <div className="p-3 bg-whisky-amber/20 rounded-lg">
                      {getIcon(section.icon)}
                    </div>
                    <h2 className="font-serif text-3xl text-text-primary">
                      {sectionIndex + 1}. {section.title}
                    </h2>
                  </motion.div>
                  
                  {section.content && (
                    <p className="text-lg text-text-secondary leading-relaxed">
                      {section.content}
                    </p>
                  )}
                </div>

                {/* Subsections */}
                {section.subsections && (
                  <div className="space-y-6 mb-8">
                    {section.subsections.map((subsection) => (
                      <motion.div
                        key={subsection.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-primary-black/50 backdrop-blur-sm rounded-lg p-6 border border-gold-light/10"
                      >
                        {subsection.subtitle && (
                          <h3 className="text-xl font-semibold text-whisky-amber mb-4">
                            {subsection.subtitle}
                          </h3>
                        )}
                        
                        {subsection.content && (
                          <p className="text-text-secondary mb-4">
                            {subsection.content}
                          </p>
                        )}
                        
                        {subsection.list && (
                          <ul className="space-y-3">
                            {subsection.list.map((item, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-3"
                              >
                                <span className="text-whisky-amber mt-1">•</span>
                                <span className="text-text-secondary">{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                        
                        {subsection.table && renderTable(subsection.table)}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Visual Component */}
                {section.visual && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-8"
                  >
                    {renderVisual(section)}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rich-brown via-medium-brown to-primary-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>
        
        <div className="relative z-10 container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-text-primary mb-6">
              Ready to Start Your
              <span className="block text-gradient-gold italic mt-2">
                Whiskey Investment Journey?
              </span>
            </h2>
            
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
              Join thousands of successful investors who have discovered the potential of whiskey cask investment
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/contact" 
                  className="group inline-flex items-center px-8 py-4 bg-gradient-gold text-primary-black font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="tel:+442035953910" 
                  className="group inline-flex items-center px-8 py-4 bg-transparent border-2 border-whisky-amber text-whisky-amber font-bold rounded-full hover:bg-whisky-amber/10 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call: 020 3595 3910</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQ;