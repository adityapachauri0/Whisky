import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BeakerIcon,
  ShieldCheckIcon,
  ClockIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  TruckIcon,
  ChartBarIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
}

interface InvestmentProcessStepsProps {
  steps: Step[];
}

const InvestmentProcessSteps: React.FC<InvestmentProcessStepsProps> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Additional details for each step
  const stepDetails = [
    {
      timeline: '1-2 weeks',
      documents: ['Investment Agreement', 'Risk Disclosure', 'Market Analysis Report'],
      keyActions: ['Browse available casks', 'Consult with experts', 'Review provenance'],
      icon: BeakerIcon
    },
    {
      timeline: '2-3 days',
      documents: ['Delivery Order', 'Bailment Contract', 'Insurance Certificate'],
      keyActions: ['Legal verification', 'Title transfer', 'HMRC registration'],
      icon: DocumentTextIcon
    },
    {
      timeline: 'Ongoing',
      documents: ['Storage Agreement', 'Insurance Policy', 'Annual Statements'],
      keyActions: ['Bonded warehouse placement', 'Climate monitoring', 'Security protocols'],
      icon: BuildingLibraryIcon
    },
    {
      timeline: '5-15 years',
      documents: ['Maturation Reports', 'Sample Analysis', 'Value Assessments'],
      keyActions: ['Natural aging process', 'Quality enhancement', 'Market monitoring'],
      icon: ClockIcon
    },
    {
      timeline: '4-8 weeks',
      documents: ['Sale Agreement', 'Transfer Documentation', 'Payment Confirmation'],
      keyActions: ['Market valuation', 'Buyer negotiation', 'Legal transfer'],
      icon: CurrencyPoundIcon
    }
  ];

  return (
    <div className="space-y-12">
      {/* Visual Process Flow */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-premium-gold via-amber-500 to-premium-gold transform -translate-x-1/2 hidden md:block" />
        
        {/* Steps */}
        <div className="space-y-8 md:space-y-0">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === activeStep;
            const isHovered = index === hoveredStep;
            const details = stepDetails[index];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Content */}
                <div className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveStep(index)}
                    className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${
                      isActive ? 'ring-2 ring-premium-gold shadow-premium-gold/20' : ''
                    }`}
                  >
                    <div className={`flex items-start ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}>
                      <div className="flex-1">
                        <span className="text-6xl font-bold text-premium-gold/20">
                          {step.number}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {step.description}
                        </p>
                        
                        {/* Features */}
                        <div className="space-y-2 mb-4">
                          {step.features.map((feature, idx) => (
                            <div key={idx} className={`flex items-center text-sm text-gray-700 ${
                              index % 2 === 0 ? 'md:justify-end' : ''
                            }`}>
                              <CheckCircleIcon className="w-4 h-4 text-eco-green mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Timeline */}
                        <div className={`flex items-center text-sm text-premium-gold font-semibold ${
                          index % 2 === 0 ? 'md:justify-end' : ''
                        }`}>
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {details.timeline}
                        </div>
                      </div>
                      
                      {/* Icon */}
                      <div className={`ml-4 ${index % 2 === 0 ? 'md:mr-4 md:ml-0' : ''}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-premium-gold text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <StepIcon className="w-8 h-8" />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <motion.div
                      initial={false}
                      animate={{ height: isActive ? 'auto' : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {isActive && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            {/* Key Actions */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <ChartBarIcon className="w-4 h-4 mr-1" />
                                Key Actions
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {details.keyActions.map((action, idx) => (
                                  <li key={idx}>• {action}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Documents */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <DocumentTextIcon className="w-4 h-4 mr-1" />
                                Documentation
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {details.documents.map((doc, idx) => (
                                  <li key={idx}>• {doc}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Next Step */}
                            {index < steps.length - 1 && (
                              <div className="md:col-span-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Next Step</h4>
                                <button
                                  onClick={() => setActiveStep(index + 1)}
                                  className="flex items-center text-sm text-premium-gold hover:text-amber-700 transition-colors"
                                >
                                  {steps[index + 1].title}
                                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Center Circle */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 hidden md:block">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive ? '#D97706' : '#FEF3C7'
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                  >
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Process Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-premium-gold/10 to-amber-100/10 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Your Investment Journey Timeline
        </h3>
        
        {/* Timeline Bar */}
        <div className="relative mb-8">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="h-full bg-gradient-to-r from-premium-gold via-amber-500 to-eco-green rounded-full"
            />
          </div>
          
          {/* Timeline Markers */}
          <div className="absolute top-0 left-0 w-full h-4 flex justify-between">
            {[
              { label: 'Start', position: '0%' },
              { label: '3 Months', position: '20%' },
              { label: '1 Year', position: '35%' },
              { label: '5 Years', position: '60%' },
              { label: '10 Years', position: '85%' },
              { label: 'Exit', position: '100%' }
            ].map((marker, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2"
                style={{ left: marker.position }}
              >
                <div className="w-4 h-4 bg-white border-2 border-premium-gold rounded-full" />
                <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                  {marker.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'Average Setup Time', value: '2-3 weeks', icon: ClockIcon },
            { label: 'Typical Holding Period', value: '5-10 years', icon: ChartBarIcon },
            { label: 'Exit Process', value: '4-8 weeks', icon: TruckIcon },
            { label: 'Documentation', value: 'Full Digital', icon: DocumentTextIcon }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-premium-gold" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InvestmentProcessSteps;