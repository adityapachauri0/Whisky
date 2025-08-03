import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyPoundIcon,
  ClockIcon,
  CloudIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Risk {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  severity: 'low' | 'medium' | 'high';
  mitigation: string[];
  learnMore?: string;
}

const RiskConsiderations: React.FC = () => {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const risks: Risk[] = [
    {
      id: 'market',
      title: 'Market Volatility',
      description: 'Whisky values can fluctuate based on market demand, economic conditions, and consumer preferences.',
      icon: ChartBarIcon,
      severity: 'medium',
      mitigation: [
        'Diversify across multiple casks and distilleries',
        'Focus on established brands with proven track records',
        'Monitor market trends and adjust holding periods',
        'Work with experienced advisors for market insights'
      ],
      learnMore: 'Market conditions are influenced by global economic factors, luxury goods demand, and collector preferences.'
    },
    {
      id: 'liquidity',
      title: 'Liquidity Concerns',
      description: 'Casks are not as liquid as stocks or bonds. Selling may take time and finding buyers requires effort.',
      icon: ClockIcon,
      severity: 'medium',
      mitigation: [
        'Plan for minimum 5-year holding periods',
        'Maintain liquid assets for short-term needs',
        'Use established platforms with buyer networks',
        'Consider partial portfolio exits if needed'
      ],
      learnMore: 'Average liquidation timeframes range from 2-8 weeks depending on cask quality and market conditions.'
    },
    {
      id: 'storage',
      title: 'Storage Costs',
      description: 'Annual storage, insurance, and management fees typically range from £150-£300 per year.',
      icon: CurrencyPoundIcon,
      severity: 'low',
      mitigation: [
        'Factor storage costs into ROI calculations',
        'Choose bonded warehouses with competitive rates',
        'Ensure comprehensive insurance coverage',
        'Regular cost reviews and optimization'
      ],
      learnMore: 'Storage costs are tax-deductible business expenses and represent less than 2% of typical cask values.'
    },
    {
      id: 'evaporation',
      title: 'Evaporation Risk',
      description: 'Natural evaporation reduces volume but concentrates flavor. This is factored into pricing and returns.',
      icon: CloudIcon,
      severity: 'low',
      mitigation: [
        'Understand Angels Share impact on returns',
        'Climate-controlled storage minimizes excess loss',
        'Regular sampling monitors evaporation rates',
        'Value appreciation typically exceeds volume loss'
      ],
      learnMore: 'The 2% annual evaporation creates the "wasting asset" classification that provides CGT exemption.'
    },
    {
      id: 'returns',
      title: 'No Guaranteed Returns',
      description: 'Past performance doesn\'t guarantee future results. Investment values can go down as well as up.',
      icon: ExclamationTriangleIcon,
      severity: 'high',
      mitigation: [
        'Invest only what you can afford to hold long-term',
        'Diversify across age statements and regions',
        'Focus on quality over speculative purchases',
        'Regular portfolio reviews and rebalancing'
      ],
      learnMore: 'Historical data shows consistent appreciation, but individual cask performance varies.'
    },
    {
      id: 'regulatory',
      title: 'Regulatory Risk',
      description: 'Changes in tax legislation or HMRC regulations could affect the investment\'s tax advantages.',
      icon: DocumentTextIcon,
      severity: 'low',
      mitigation: [
        'Stay informed on regulatory changes',
        'Work with tax-qualified advisors',
        'Maintain proper documentation',
        'Consider geographic diversification'
      ],
      learnMore: 'The wasting asset exemption has been stable for decades, but investors should monitor any proposed changes.'
    }
  ];

  const filteredRisks = selectedFilter === 'all' 
    ? risks 
    : risks.filter(risk => risk.severity === selectedFilter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Risk Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8"
      >
        <div className="flex items-start">
          <ShieldExclamationIcon className="w-12 h-12 text-amber-600 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Understanding Investment Risks
            </h3>
            <p className="text-gray-700 mb-4">
              Like all investments, whisky casks carry certain risks. We believe in complete transparency 
              to help you make informed decisions. Our comprehensive approach to risk management helps 
              protect and optimize your investment.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Regulated Storage</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Full Insurance</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Expert Guidance</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Transparent Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Filter */}
      <div className="flex justify-center space-x-2">
        {['all', 'low', 'medium', 'high'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedFilter === filter
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter === 'all' ? 'All Risks' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Risk`}
          </button>
        ))}
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRisks.map((risk, index) => {
            const RiskIcon = risk.icon;
            const isExpanded = expandedRisk === risk.id;
            
            return (
              <motion.div
                key={risk.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer ${
                  isExpanded ? 'md:col-span-2' : ''
                }`}
                onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
              >
                <div className={`p-6 border-l-4 ${getSeverityColor(risk.severity)}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <RiskIcon className="w-8 h-8 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                          {risk.title}
                        </h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          getSeverityBadgeColor(risk.severity)
                        }`}>
                          {risk.severity.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">
                    {risk.description}
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-gray-200">
                          {/* Mitigation Strategies */}
                          <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <LightBulbIcon className="w-5 h-5 mr-2 text-amber-500" />
                              Mitigation Strategies
                            </h5>
                            <ul className="space-y-2">
                              {risk.mitigation.map((strategy, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-gray-700">{strategy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Learn More */}
                          {risk.learnMore && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-start">
                                <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                  <strong>Additional Context:</strong> {risk.learnMore}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Risk Management Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gray-900 text-white rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold mb-6">
          Our Risk Management Framework
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Due Diligence',
              icon: DocumentTextIcon,
              points: [
                'Verify all distillery documentation',
                'Confirm warehouse licensing',
                'Review historical performance',
                'Assess market conditions'
              ]
            },
            {
              title: 'Ongoing Monitoring',
              icon: ChartBarIcon,
              points: [
                'Quarterly valuations',
                'Market trend analysis',
                'Storage condition checks',
                'Regulatory updates'
              ]
            },
            {
              title: 'Exit Planning',
              icon: CurrencyPoundIcon,
              points: [
                'Multiple exit strategies',
                'Global buyer network',
                'Optimal timing advice',
                'Transaction support'
              ]
            }
          ].map((framework, index) => {
            const FrameworkIcon = framework.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <FrameworkIcon className="w-10 h-10 text-premium-gold mb-4" />
                <h4 className="text-lg font-semibold mb-3">{framework.title}</h4>
                <ul className="space-y-2">
                  {framework.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-premium-gold mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Risk vs Return Balance */}
      <div className="bg-gradient-to-br from-eco-green/10 to-eco-green/20 rounded-2xl p-8 border border-eco-green/30">
        <h3 className="text-2xl font-bold text-primary-black mb-6">
          Balanced Risk-Return Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-primary-black/80 mb-4 font-medium">
              Whisky cask investment offers an attractive balance between risk and return. 
              While no investment is without risk, our approach focuses on:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-eco-green mr-3 flex-shrink-0" />
                <span className="font-medium text-primary-black">Quality over speculation</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-eco-green mr-3 flex-shrink-0" />
                <span className="font-medium text-primary-black">Established distilleries with proven track records</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-eco-green mr-3 flex-shrink-0" />
                <span className="font-medium text-primary-black">Professional storage and insurance</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-eco-green mr-3 flex-shrink-0" />
                <span className="font-medium text-primary-black">Transparent fee structure</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-premium-gold/20">
            <h4 className="font-semibold text-primary-black mb-4">Risk-Adjusted Returns</h4>
            <div className="space-y-3">
              {[
                { asset: 'Whisky Casks', return: '12-15%', risk: 'Medium', color: 'bg-premium-gold' },
                { asset: 'Stocks', return: '8-10%', risk: 'High', color: 'bg-blue-500' },
                { asset: 'Property', return: '6-8%', risk: 'Medium', color: 'bg-green-500' },
                { asset: 'Bonds', return: '3-5%', risk: 'Low', color: 'bg-gray-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`} />
                    <span className="font-medium text-primary-black">{item.asset}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary-black">{item.return}</span>
                    <span className="text-xs text-primary-black/60 ml-2">({item.risk} Risk)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskConsiderations;