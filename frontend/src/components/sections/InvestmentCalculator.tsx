import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalculatorIcon, 
  ArrowTrendingUpIcon,
  CurrencyPoundIcon,
  ClockIcon,
  ChartBarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CalculatorResults {
  totalInvestment: number;
  totalCosts: number;
  finalValue: number;
  totalReturn: number;
  annualROI: number;
  angelsShareLoss: number;
}

const InvestmentCalculator: React.FC = () => {
  // Input states
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [holdingPeriod, setHoldingPeriod] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [annualCosts, setAnnualCosts] = useState('medium'); // low, medium, high


  // Cost mapping - moved outside component to prevent recreation
  const costMap = React.useMemo(() => ({
    low: 150,
    medium: 200,
    high: 300
  }), []);

  // Calculate results using useMemo instead of useCallback
  const results = React.useMemo<CalculatorResults>(() => {
    // Annual costs
    const yearlyStorageCost = costMap[annualCosts as keyof typeof costMap];
    const totalStorageCosts = yearlyStorageCost * holdingPeriod;
    
    // Total investment including costs
    const totalInvestment = investmentAmount + totalStorageCosts;
    
    // Calculate compound returns
    const finalValue = investmentAmount * Math.pow(1 + expectedReturn / 100, holdingPeriod);
    
    // Calculate Angels' Share (4% year 1, then 2% annually)
    let angelsSharePercentage = 4; // First year
    for (let i = 1; i < holdingPeriod; i++) {
      angelsSharePercentage += 2;
    }
    
    // Net return after costs
    const totalReturn = finalValue - totalInvestment;
    const annualROI = ((Math.pow(finalValue / totalInvestment, 1 / holdingPeriod) - 1) * 100);

    return {
      totalInvestment,
      totalCosts: totalStorageCosts,
      finalValue,
      totalReturn,
      annualROI,
      angelsShareLoss: angelsSharePercentage
    };
  }, [investmentAmount, holdingPeriod, expectedReturn, annualCosts, costMap]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary-black/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gold-light/20"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
            <CalculatorIcon className="w-6 h-6 mr-2 text-premium-gold" />
            Calculate Your Returns
          </h3>

          {/* Investment Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Initial Investment Amount
            </label>
            <div className="relative">
              <CurrencyPoundIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-light" />
              <input
                type="text"
                value={investmentAmount.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  const num = parseInt(value) || 0;
                  if (num >= 3000 && num <= 100000) {
                    setInvestmentAmount(num);
                  }
                }}
                className="w-full pl-10 pr-3 py-3 bg-rich-brown/30 border border-gold-light/20 rounded-lg text-white font-semibold text-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent"
              />
            </div>
            <input
              type="range"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full mt-2"
              min="3000"
              max="100000"
              step="1000"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>£3,000</span>
              <span>£100,000</span>
            </div>
          </div>

          {/* Holding Period */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Holding Period (Years)
            </label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-light" />
              <select
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-3 bg-rich-brown/30 border border-gold-light/20 rounded-lg text-white font-semibold text-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent appearance-none"
              >
                {[3, 5, 7, 10, 15, 20].map(years => (
                  <option key={years} value={years}>{years} years</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expected Annual Return */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Expected Annual Return
              <span className="ml-2 text-xs text-text-secondary">(Industry average: 12-15%)</span>
            </label>
            <div className="relative">
              <ArrowTrendingUpIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-light" />
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (value >= 5 && value <= 25) {
                    setExpectedReturn(value);
                  }
                }}
                className="w-full pl-10 pr-8 py-3 bg-rich-brown/30 border border-gold-light/20 rounded-lg text-white font-semibold text-lg focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                min="5"
                max="25"
                step="0.5"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">%</span>
            </div>
            <input
              type="range"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full mt-2"
              min="5"
              max="25"
              step="0.5"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Conservative (5%)</span>
              <span>Moderate (12%)</span>
              <span>Aggressive (25%)</span>
            </div>
          </div>

          {/* Annual Costs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Annual Costs
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'low', label: 'Low', amount: '£150/year' },
                { value: 'medium', label: 'Medium', amount: '£200/year' },
                { value: 'high', label: 'High', amount: '£300/year' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnnualCosts(option.value)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                    annualCosts === option.value
                      ? 'border-premium-gold bg-premium-gold/10 text-premium-gold'
                      : 'border-gold-light/30 hover:border-gold-light/50 text-text-secondary'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs">{option.amount}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {/* Investment Projection Card */}
          <div className="bg-gradient-to-br from-premium-gold to-yellow-600 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2" />
              Investment Projection
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Investment</span>
                <span className="text-2xl font-bold">{formatCurrency(results.totalInvestment)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Initial Investment</span>
                <span>{formatCurrency(investmentAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Total Costs</span>
                <span>{formatCurrency(results.totalCosts)}</span>
              </div>
              
              <hr className="border-white/20 my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-white/80">Final Value</span>
                <span className="text-3xl font-bold">{formatCurrency(results.finalValue)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Return</span>
                <span className="text-2xl font-bold text-green-300">
                  +{formatCurrency(results.totalReturn)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80">Annual ROI</span>
                <span className="text-2xl font-bold">{results.annualROI.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Angels' Share Impact */}
          <div className="bg-primary-black/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-white border border-gold-light/20">
            <h4 className="text-lg font-bold mb-4 flex items-center">
              Angels' Share Impact
              <button className="ml-2 group relative">
                <InformationCircleIcon className="w-5 h-5 text-gold-light/60 hover:text-gold-light" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-rich-brown/90 backdrop-blur-sm rounded-lg text-sm invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 border border-gold-light/20">
                  Natural evaporation during aging that qualifies casks as "wasting assets" - exempt from Capital Gains Tax
                </div>
              </button>
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">After {holdingPeriod} years:</p>
                <p className="text-2xl font-bold text-premium-gold">{results.angelsShareLoss}%</p>
                <p className="text-text-secondary text-sm">volume lost to evaporation</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-eco-green font-semibold">CGT EXEMPT</p>
                <p className="text-xs text-text-secondary">Wasting Asset</p>
              </div>
            </div>
          </div>

          {/* Comparison with Other Investments */}
          <div className="bg-primary-black/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gold-light/20">
            <h4 className="text-lg font-bold text-text-primary mb-4">
              Investment Comparison
            </h4>
            <div className="space-y-3">
              {[
                { name: 'Whisky Casks', return: results.annualROI, color: 'bg-premium-gold' },
                { name: 'S&P 500 (10yr avg)', return: 10.2, color: 'bg-blue-500' },
                { name: 'UK Property', return: 7.5, color: 'bg-green-500' },
                { name: 'Gold', return: 6.8, color: 'bg-yellow-500' },
                { name: 'Savings Account', return: 2.5, color: 'bg-stone-gray' }
              ].map((investment, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm font-medium text-text-secondary w-32">{investment.name}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-rich-brown/30 rounded-full h-4 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(investment.return / 25) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full ${investment.color} rounded-full`}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-text-primary w-16 text-right">
                    {investment.return.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-rich-brown/30 backdrop-blur-sm border border-gold-light/20 rounded-lg">
        <p className="text-sm text-text-secondary">
          <strong>Disclaimer:</strong> This calculator provides estimates based on historical averages. 
          Past performance does not guarantee future results. Actual returns may vary based on market conditions, 
          specific cask selection, and other factors. Please consult with our investment advisors for personalized projections.
        </p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;