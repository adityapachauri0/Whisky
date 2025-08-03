import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalculatorInputs {
  initialInvestment: number;
  holdingPeriod: number;
  annualAppreciation: number;
  storagePerYear: number;
  insurancePerYear: number;
  purchaseCommission: number;
  saleCommission: number;
  angelsShareYear1: number;
  angelsShareAnnual: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialInvestment: 10000,
    holdingPeriod: 5,
    annualAppreciation: 12.5,
    storagePerYear: 75,
    insurancePerYear: 125,
    purchaseCommission: 2,
    saleCommission: 2,
    angelsShareYear1: 4,
    angelsShareAnnual: 2
  });

  const [results, setResults] = useState({
    finalValue: 0,
    totalCosts: 0,
    netProfit: 0,
    totalReturn: 0,
    annualReturn: 0,
    remainingVolume: 100
  });

  const calculateROI = React.useCallback(() => {
    // Calculate final value with appreciation
    const finalValue = inputs.initialInvestment * Math.pow(1 + inputs.annualAppreciation / 100, inputs.holdingPeriod);
    
    // Calculate costs
    const storageCosts = inputs.storagePerYear * inputs.holdingPeriod;
    const insuranceCosts = inputs.insurancePerYear * inputs.holdingPeriod;
    const purchaseCommissionAmount = inputs.initialInvestment * (inputs.purchaseCommission / 100);
    const saleCommissionAmount = finalValue * (inputs.saleCommission / 100);
    const regaugingCost = 100; // Fixed cost
    
    const totalCosts = storageCosts + insuranceCosts + purchaseCommissionAmount + saleCommissionAmount + regaugingCost;
    
    // Calculate remaining volume after Angel's Share
    let remainingVolume = 100;
    remainingVolume *= (1 - inputs.angelsShareYear1 / 100); // First year
    for (let i = 1; i < inputs.holdingPeriod; i++) {
      remainingVolume *= (1 - inputs.angelsShareAnnual / 100); // Subsequent years
    }
    
    // Calculate returns
    const netProfit = finalValue - inputs.initialInvestment - totalCosts;
    const totalReturn = (netProfit / inputs.initialInvestment) * 100;
    const annualReturn = (Math.pow(1 + totalReturn / 100, 1 / inputs.holdingPeriod) - 1) * 100;
    
    setResults({
      finalValue: Math.round(finalValue),
      totalCosts: Math.round(totalCosts),
      netProfit: Math.round(netProfit),
      totalReturn: Math.round(totalReturn * 10) / 10,
      annualReturn: Math.round(annualReturn * 10) / 10,
      remainingVolume: Math.round(remainingVolume * 10) / 10
    });
  }, [inputs]);

  useEffect(() => {
    calculateROI();
  }, [calculateROI]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="w-full bg-primary-black/50 backdrop-blur-sm rounded-lg border border-gold-light/20 p-8">
      <h3 className="text-2xl font-serif text-whisky-amber mb-6 text-center">
        Whisky Cask ROI Calculator
      </h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <h4 className="text-lg font-serif text-text-primary mb-4">Investment Parameters</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Initial Investment (£)
              </label>
              <input
                type="text"
                value={inputs.initialInvestment.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  handleInputChange('initialInvestment', value);
                }}
                className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
              />
              <input
                type="range"
                value={inputs.initialInvestment}
                onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
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
            
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Holding Period (years)
              </label>
              <input
                type="number"
                value={inputs.holdingPeriod}
                onChange={(e) => handleInputChange('holdingPeriod', e.target.value)}
                className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
              />
              <input
                type="range"
                value={inputs.holdingPeriod}
                onChange={(e) => handleInputChange('holdingPeriod', e.target.value)}
                className="w-full mt-2"
                min="3"
                max="20"
                step="1"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>3 years</span>
                <span>20 years</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Expected Annual Appreciation (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.annualAppreciation}
                onChange={(e) => handleInputChange('annualAppreciation', e.target.value)}
                className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
              />
              <input
                type="range"
                value={inputs.annualAppreciation}
                onChange={(e) => handleInputChange('annualAppreciation', e.target.value)}
                className="w-full mt-2"
                min="5"
                max="25"
                step="0.5"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>5%</span>
                <span>15%</span>
                <span>25%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Storage/Year (£)
                </label>
                <input
                  type="number"
                  value={inputs.storagePerYear}
                  onChange={(e) => handleInputChange('storagePerYear', e.target.value)}
                  className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
                />
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Insurance/Year (£)
                </label>
                <input
                  type="number"
                  value={inputs.insurancePerYear}
                  onChange={(e) => handleInputChange('insurancePerYear', e.target.value)}
                  className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Purchase Commission (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.purchaseCommission}
                  onChange={(e) => handleInputChange('purchaseCommission', e.target.value)}
                  className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
                />
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Sale Commission (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.saleCommission}
                  onChange={(e) => handleInputChange('saleCommission', e.target.value)}
                  className="w-full px-4 py-2 bg-rich-brown/30 border border-gold-light/20 rounded text-text-primary focus:outline-none focus:border-whisky-amber"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-4">
          <h4 className="text-lg font-serif text-text-primary mb-4">Projected Returns</h4>
          
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-whisky-amber/20 to-gold-light/10 p-4 rounded-lg border border-whisky-amber/30"
            >
              <div className="text-sm text-text-secondary mb-1">Final Cask Value</div>
              <div className="text-2xl font-bold text-whisky-amber">
                £{results.finalValue.toLocaleString()}
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rich-brown/30 p-4 rounded-lg">
                <div className="text-sm text-text-secondary mb-1">Total Costs</div>
                <div className="text-xl font-semibold text-text-primary">
                  £{results.totalCosts.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-rich-brown/30 p-4 rounded-lg">
                <div className="text-sm text-text-secondary mb-1">Net Profit</div>
                <div className="text-xl font-semibold text-eco-green">
                  £{results.netProfit.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rich-brown/30 p-4 rounded-lg">
                <div className="text-sm text-text-secondary mb-1">Total Return</div>
                <div className="text-xl font-semibold text-whisky-amber">
                  {results.totalReturn}%
                </div>
              </div>
              
              <div className="bg-rich-brown/30 p-4 rounded-lg">
                <div className="text-sm text-text-secondary mb-1">Annual Return</div>
                <div className="text-xl font-semibold text-whisky-amber">
                  {results.annualReturn}% p.a.
                </div>
              </div>
            </div>
            
            <div className="bg-rich-brown/30 p-4 rounded-lg">
              <div className="text-sm text-text-secondary mb-1">Remaining Volume (Angel's Share)</div>
              <div className="text-xl font-semibold text-text-primary">
                {results.remainingVolume}%
              </div>
              <div className="mt-2 h-2 bg-primary-black/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${results.remainingVolume}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-whisky-amber to-gold-light"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-primary-black/30 rounded text-xs text-text-secondary">
            <p>* Calculations include all costs and are based on historical average returns. Actual results may vary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;