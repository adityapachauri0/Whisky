import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  CalculatorIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  // ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import {
  InvestmentCalculator,
  MarketGrowthChart,
  AngelsShareVisualization,
  InvestmentProcessSteps,
  RiskConsiderations
} from '../components/sections';

const HowItWorksNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState('process');

  // Key investment metrics
  const keyMetrics = [
    { value: '12-15%', label: 'Average Annual Returns', icon: ArrowTrendingUpIcon },
    { value: 'CGT Exempt', label: 'Tax Efficient Investment', icon: ShieldCheckIcon },
    { value: '6.44%', label: 'Market CAGR to 2033', icon: ChartBarIcon },
    { value: '£3,000', label: 'Minimum Investment', icon: BanknotesIcon }
  ];

  // Investment process steps
  const investmentSteps = [
    {
      number: '01',
      title: 'Choose Your Cask',
      description: 'Select from new-make or aged casks based on your investment goals and timeline. Options range from £3,000 entry-level to £50,000+ premium casks.',
      icon: BeakerIcon,
      features: [
        'Expert cask recommendations',
        'Detailed provenance reports',
        'Historical performance data',
        'Risk assessment profiles'
      ]
    },
    {
      number: '02',
      title: 'Legal Ownership',
      description: 'Receive delivery order and bailment contract confirming your legal ownership. You own the physical cask and its contents.',
      icon: ShieldCheckIcon,
      features: [
        'HMRC-approved documentation',
        'Bonded warehouse certificates',
        'Legal title transfer',
        'Digital ownership records'
      ]
    },
    {
      number: '03',
      title: 'Professional Storage',
      description: 'Cask stored in HMRC bonded warehouse with full insurance coverage. No duty payable while in bond.',
      icon: ClockIcon,
      features: [
        '24/7 secured facilities',
        'Climate-controlled environment',
        'Comprehensive insurance',
        'Annual storage costs £50-£100'
      ]
    },
    {
      number: '04',
      title: 'Maturation Period',
      description: 'Whisky ages naturally, increasing in value and complexity over time. The "Angels\' Share" evaporation qualifies as a wasting asset.',
      icon: BeakerIcon,
      features: [
        'Natural value appreciation',
        '2% annual evaporation',
        'Flavor concentration',
        'Optimal 5-10 year holding'
      ]
    },
    {
      number: '05',
      title: 'Exit Strategy',
      description: 'Sell to distilleries, bottlers, at auction, or bottle for personal use. Multiple exit options provide flexibility.',
      icon: BanknotesIcon,
      features: [
        'Distillery buy-back programs',
        'Independent bottler sales',
        'Auction house listings',
        'Private collector network'
      ]
    }
  ];

  // Investment options
  const investmentOptions = [
    {
      title: 'Entry Level',
      range: '£3,000 - £5,000',
      description: 'Perfect for first-time investors. New make spirit from emerging distilleries with strong growth potential.',
      features: [
        'New make spirit',
        'Emerging distilleries',
        '5-10 year holding period',
        '8-12% expected returns'
      ],
      recommended: false
    },
    {
      title: 'Premium',
      range: '£10,000 - £30,000',
      description: 'Established distilleries with 3-5 year aged stock. Balanced risk-return profile for serious investors.',
      features: [
        'Established distilleries',
        '3-5 year aged stock',
        'Proven track record',
        '12-15% expected returns'
      ],
      recommended: true
    },
    {
      title: 'Luxury',
      range: '£30,000+',
      description: 'Rare casks from premium distilleries. For sophisticated investors seeking exceptional returns.',
      features: [
        'Premium distilleries',
        'Rare and limited casks',
        'Collector interest',
        '15-20%+ potential returns'
      ],
      recommended: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>How Whisky Cask Investment Works - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Discover how whisky cask investment works. Learn about returns, tax benefits, the investment process, and use our calculator to project your potential gains." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-black via-gray-900 to-primary-black min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/videos/whisky-hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
              Invest in <span className="text-gradient-gold">Whisky Casks</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Discover the art of cask investment - a tangible, tax-efficient way to grow your wealth while owning a piece of Scottish heritage
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-premium-gold/20"
                >
                  <metric.icon className="w-8 h-8 text-premium-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-premium-gold">{metric.value}</div>
                  <div className="text-sm text-gray-300">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link 
                to="#calculator" 
                className="inline-flex items-center bg-premium-gold hover:bg-yellow-600 text-primary-black font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-premium-gold/30"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <CalculatorIcon className="w-5 h-5 mr-2" />
                Start Calculating Returns
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-gray-50 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-8 py-4">
            {[
              { id: 'process', label: 'Investment Process' },
              { id: 'calculator', label: 'ROI Calculator' },
              { id: 'market', label: 'Market Growth' },
              { id: 'options', label: 'Investment Options' },
              { id: 'angels-share', label: "Angels' Share" },
              { id: 'risks', label: 'Risks & Returns' },
              { id: 'get-started', label: 'Get Started' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-premium-gold text-premium-gold'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              How Scottish Whisky Cask Investment Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven 5-step process makes whisky cask investment simple and transparent
            </p>
          </motion.div>

          <InvestmentProcessSteps steps={investmentSteps} />
        </div>
      </section>

      {/* Investment Calculator */}
      <section id="calculator" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Investment Calculator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your potential returns with our interactive investment tool
            </p>
          </motion.div>

          <InvestmentCalculator />
        </div>
      </section>

      {/* Market Growth */}
      <section id="market" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Market Growth & Opportunity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The whisky market is experiencing unprecedented growth, creating exceptional investment opportunities
            </p>
          </motion.div>

          <MarketGrowthChart />
        </div>
      </section>

      {/* Investment Options */}
      <section id="options" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Investment Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the investment level that matches your goals and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {investmentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  option.recommended ? 'ring-2 ring-premium-gold' : ''
                }`}
              >
                {option.recommended && (
                  <div className="absolute top-0 right-0 bg-premium-gold text-primary-black px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <div className="text-3xl font-bold text-premium-gold mb-4">{option.range}</div>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  <ul className="space-y-3 mb-8">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/contact"
                    className={`block text-center py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                      option.recommended
                        ? 'bg-premium-gold hover:bg-yellow-600 text-primary-black'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Angels' Share */}
      <section id="angels-share" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Understanding the Angels' Share
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Natural evaporation that creates value and tax advantages
            </p>
          </motion.div>

          <AngelsShareVisualization />
        </div>
      </section>

      {/* Risks & Considerations */}
      <section id="risks" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Risks & Considerations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the complete picture for informed investment decisions
            </p>
          </motion.div>

          <RiskConsiderations />
        </div>
      </section>

      {/* Get Started CTA */}
      <section id="get-started" className="py-20 bg-gradient-to-br from-primary-black via-gray-900 to-primary-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Start Your Cask Investment Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of investors who have discovered the rewards of whisky cask ownership
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Consultation', desc: 'Book a free consultation to discuss your investment goals' },
                  { step: '2', title: 'Due Diligence', desc: 'Review available casks, distillery information, and documentation' },
                  { step: '3', title: 'Investment', desc: 'Complete purchase documentation and arrange payment' },
                  { step: '4', title: 'Monitoring', desc: 'Regular updates on your investment\'s performance' }
                ].map((item, index) => (
                  <div key={index} className="text-left">
                    <div className="text-3xl font-bold text-premium-gold mb-2">{item.step}</div>
                    <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="inline-flex items-center bg-premium-gold hover:bg-yellow-600 text-primary-black text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-premium-gold/30"
              >
                Book Free Consultation
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/blog/complete-guide-whisky-cask-investment" 
                className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 group"
              >
                Read Investment Guide
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksNew;