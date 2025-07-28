import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BeakerIcon,
  SparklesIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const AngelsShareVisualization: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(10);
  const [animateEvaporation, setAnimateEvaporation] = useState(false);

  // Calculate evaporation data
  const calculateEvaporationData = () => {
    const data = [];
    let remainingVolume = 100;
    
    for (let year = 0; year <= 25; year++) {
      if (year === 0) {
        data.push({ year, volume: 100, evaporated: 0, cumulative: 0 });
      } else if (year === 1) {
        remainingVolume = 96; // 4% first year
        data.push({ year, volume: remainingVolume, evaporated: 4, cumulative: 4 });
      } else {
        const yearlyLoss = remainingVolume * 0.02; // 2% of remaining
        remainingVolume -= yearlyLoss;
        const cumulative = 100 - remainingVolume;
        data.push({ 
          year, 
          volume: remainingVolume, 
          evaporated: yearlyLoss,
          cumulative: cumulative
        });
      }
    }
    return data;
  };

  const evaporationData = calculateEvaporationData();
  const selectedData = evaporationData.find(d => d.year === selectedYear) || evaporationData[10];

  // Pie chart data for current state
  const pieData = [
    { name: 'Remaining Whisky', value: selectedData.volume, color: '#D97706' },
    { name: "Angels' Share", value: selectedData.cumulative, color: '#93C5FD' }
  ];

  // Value concentration calculation
  const valueConcentration = ((100 / selectedData.volume) * 100).toFixed(0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">Year {label}</p>
          <p className="text-sm text-premium-gold">
            Volume: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-sm text-blue-500">
            Evaporated: {(100 - payload[0].value).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimateEvaporation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with Animation */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center bg-gradient-to-r from-blue-100 to-amber-100 rounded-full px-6 py-3 mb-6"
        >
          <CloudIcon className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-lg font-semibold text-gray-900">The Angels' Share</span>
          <SparklesIcon className="w-6 h-6 text-amber-600 ml-2" />
        </motion.div>
        
        <p className="text-gray-600 max-w-3xl mx-auto">
          The Angels' Share refers to the natural evaporation of whisky during the aging process. 
          Approximately 2% of the cask's contents evaporate each year, concentrating the remaining 
          whisky and increasing its value.
        </p>
      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evaporation Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Volume Over Time
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={evaporationData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#666"
                label={{ value: 'Volume (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#D97706"
                fillOpacity={1}
                fill="url(#volumeGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Year Selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year: {selectedYear}
            </label>
            <input
              type="range"
              min="0"
              max="25"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>New Make</span>
              <span>10 Years</span>
              <span>25 Years</span>
            </div>
          </div>
        </motion.div>

        {/* Current State Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Cask at Year {selectedYear}
          </h3>

          {/* Animated Cask Visual */}
          <div className="relative h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Stats */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {selectedData.volume.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>

            {/* Evaporation Animation */}
            {animateEvaporation && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 0.6, 0],
                      y: -100,
                      x: (i - 2) * 20
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute"
                  >
                    <CloudIcon className="w-8 h-8 text-blue-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-gray-700">Cumulative Loss</span>
              <span className="font-bold text-amber-700">
                {selectedData.cumulative.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Value Concentration</span>
              <span className="font-bold text-green-700">
                +{valueConcentration}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tax Advantage Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-eco-green/10 to-green-50 rounded-2xl p-8"
      >
        <div className="flex items-start">
          <ShieldCheckIcon className="w-12 h-12 text-eco-green mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tax Advantage
            </h3>
            <p className="text-gray-700 mb-4">
              This natural evaporation process qualifies whisky casks as "wasting assets" 
              under UK tax law, making them <strong className="text-eco-green">exempt from 
              Capital Gains Tax</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'CGT Exempt',
                  description: 'No capital gains tax on profits when sold',
                  savings: 'Save up to 24%'
                },
                {
                  title: 'Wasting Asset',
                  description: 'Natural evaporation creates tax classification',
                  savings: 'HMRC approved'
                },
                {
                  title: 'In Bond Storage',
                  description: 'No VAT or duty while stored',
                  savings: 'Suspended taxes'
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                  <p className="text-sm font-semibold text-eco-green">{benefit.savings}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Educational Points */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <BeakerIcon className="w-8 h-8 mr-3 text-premium-gold" />
          Understanding the Science
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-premium-gold">Why Does It Happen?</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-premium-gold mr-2">•</span>
                Alcohol molecules are smaller than water molecules
              </li>
              <li className="flex items-start">
                <span className="text-premium-gold mr-2">•</span>
                Oak casks are porous, allowing gradual evaporation
              </li>
              <li className="flex items-start">
                <span className="text-premium-gold mr-2">•</span>
                Temperature and humidity affect evaporation rates
              </li>
              <li className="flex items-start">
                <span className="text-premium-gold mr-2">•</span>
                Scottish climate provides ideal maturation conditions
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-premium-gold">Investment Benefits</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <ArrowTrendingUpIcon className="w-5 h-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Concentrates flavor, increasing quality</span>
              </li>
              <li className="flex items-start">
                <ArrowTrendingUpIcon className="w-5 h-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Creates natural scarcity over time</span>
              </li>
              <li className="flex items-start">
                <ArrowTrendingUpIcon className="w-5 h-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Qualifies for tax-efficient status</span>
              </li>
              <li className="flex items-start">
                <ArrowTrendingUpIcon className="w-5 h-5 text-eco-green mr-2 flex-shrink-0 mt-0.5" />
                <span>Enhances investment returns through rarity</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg flex items-start">
          <InformationCircleIcon className="w-5 h-5 text-premium-gold mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300">
            <strong className="text-white">Industry Insight:</strong> Premium distilleries often 
            bottle whisky at cask strength (typically 50-60% ABV) to maximize the value of each 
            remaining drop, commanding significantly higher prices than standard releases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AngelsShareVisualization;