import React from 'react';
import { motion } from 'framer-motion';

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const timelineSteps: TimelineStep[] = [
  {
    number: '01',
    title: 'Cask Selection',
    description: 'Choose between new-make spirit (entry ~€2,500–€5,000), premium new-make (€10,000+), or aged casks (5+ years, €30,000–€50,000+).',
    icon: '🥃'
  },
  {
    number: '02',
    title: 'Legal Documentation',
    description: 'Receive a Delivery Order from bonded warehouse plus a bailment contract with unique cask ID and owner details.',
    icon: '📜'
  },
  {
    number: '03',
    title: 'Storage & Insurance',
    description: 'Store in an HMRC-approved bonded warehouse under excise suspension; costs range £50–£100/year plus insurance (£50–£200/year).',
    icon: '🏭'
  },
  {
    number: '04',
    title: 'Maturation',
    description: 'Natural aging enhances flavor while volume reduces via the Angel\'s Share: ~4% in year 1, then ~2% annually.',
    icon: '⏳'
  },
  {
    number: '05',
    title: 'Exit & Monetization',
    description: 'Options include distillery buy-back, independent bottlers, auction platforms, private collector sales, or personal bottling.',
    icon: '💰'
  }
];

const InvestmentTimeline: React.FC = () => {
  return (
    <div className="w-full py-8">
      <h3 className="text-2xl font-serif text-text-primary mb-8 text-center">
        Your Investment Journey
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gold-light via-whisky-amber to-gold-light opacity-30" />
        
        {/* Timeline steps */}
        <div className="space-y-12">
          {timelineSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="bg-rich-brown/50 backdrop-blur-sm p-6 rounded-lg border border-gold-light/20">
                  <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'justify-end' : ''}`}>
                    <span className="text-4xl">{step.icon}</span>
                    <h4 className="text-xl font-serif text-whisky-amber">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Center circle */}
              <div className="relative w-2/12 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-gradient-to-br from-whisky-amber to-gold-light rounded-full flex items-center justify-center shadow-lg z-10 cursor-pointer"
                >
                  <span className="text-primary-black font-bold text-xl">
                    {step.number}
                  </span>
                </motion.div>
              </div>
              
              {/* Empty space for alternating layout */}
              <div className="w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentTimeline;