import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingDown, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface RiskItem {
  type: string;
  icon: React.ReactNode;
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string[];
  color: string;
}

const riskItems: RiskItem[] = [
  {
    type: 'Market Risk',
    icon: <TrendingDown className="w-6 h-6" />,
    risk: 'Prices fluctuate with consumer trends',
    impact: 'High',
    mitigation: [
      'Diversify across distilleries',
      'Vary age profiles',
      'Monitor market trends',
      'Strategic timing of exit'
    ],
    color: 'from-red-600 to-red-800'
  },
  {
    type: 'Liquidity Risk',
    icon: <Clock className="w-6 h-6" />,
    risk: 'Illiquid asset requiring time to sell',
    impact: 'Medium',
    mitigation: [
      'Plan exits in advance',
      'Use reputable auction platforms',
      'Build buyer relationships',
      'Consider partial sales'
    ],
    color: 'from-orange-600 to-orange-800'
  },
  {
    type: 'Storage & Damage',
    icon: <Shield className="w-6 h-6" />,
    risk: 'Physical risks to cask integrity',
    impact: 'Low',
    mitigation: [
      'HMRC-bonded warehouses',
      'Comprehensive insurance',
      'Regular inspections',
      'Climate-controlled storage'
    ],
    color: 'from-yellow-600 to-yellow-800'
  },
  {
    type: 'Fraud Risk',
    icon: <AlertTriangle className="w-6 h-6" />,
    risk: 'Counterfeit or misrepresented casks',
    impact: 'Medium',
    mitigation: [
      'Verify HMRC licenses',
      'Check WOWGR registration',
      'Inspect documentation',
      'Use established brokers'
    ],
    color: 'from-purple-600 to-purple-800'
  }
];

const RiskMitigationMatrix: React.FC = () => {
  return (
    <div className="w-full py-8">
      <h3 className="text-2xl font-serif text-text-primary mb-8 text-center">
        Risk Assessment & Mitigation Strategies
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {riskItems.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-rich-brown/30 backdrop-blur-sm rounded-lg border border-gold-light/20 overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r ${item.color} bg-opacity-20`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">
                      {item.type}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {item.risk}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.impact === 'High' ? 'bg-red-900/50 text-red-200' :
                  item.impact === 'Medium' ? 'bg-orange-900/50 text-orange-200' :
                  'bg-green-900/50 text-green-200'
                }`}>
                  {item.impact} Impact
                </div>
              </div>
            </div>
            
            {/* Mitigation Strategies */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-eco-green" />
                <h5 className="text-sm font-semibold text-whisky-amber">
                  Mitigation Strategies
                </h5>
              </div>
              <ul className="space-y-2">
                {item.mitigation.map((strategy, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-gold-light mt-1">•</span>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Risk Level Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-8 p-6 bg-primary-black/50 rounded-lg border border-gold-light/20"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-whisky-amber mt-1" />
          <div className="flex-1">
            <h5 className="text-sm font-semibold text-text-primary mb-2">
              Risk Management Best Practices
            </h5>
            <p className="text-sm text-text-secondary leading-relaxed">
              Successful whisky cask investment requires understanding and actively managing these risks. 
              Work with reputable partners, maintain proper documentation, and regularly review your 
              portfolio. Most risks can be effectively mitigated through proper due diligence and 
              strategic planning.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskMitigationMatrix;