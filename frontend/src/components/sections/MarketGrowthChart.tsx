import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';

const MarketGrowthChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState('market-size');

  // Market size data (in £ billions)
  const marketSizeData = [
    { year: 2024, global: 4.3, gb: 0.4 },
    { year: 2025, global: 4.6, gb: 0.42 },
    { year: 2026, global: 4.9, gb: 0.44 },
    { year: 2027, global: 5.2, gb: 0.47 },
    { year: 2028, global: 5.6, gb: 0.51 },
    { year: 2029, global: 6.0, gb: 0.54 },
    { year: 2030, global: 6.4, gb: 0.58 },
    { year: 2031, global: 6.9, gb: 0.62 },
    { year: 2032, global: 7.2, gb: 0.66 },
    { year: 2033, global: 7.5, gb: 0.71 }
  ];

  // Investment returns comparison
  const returnsComparisonData = [
    { asset: 'Whisky Casks', returns: 13.5, risk: 4.5 },
    { asset: 'S&P 500', returns: 10.2, risk: 15.3 },
    { asset: 'UK Property', returns: 7.5, risk: 12.1 },
    { asset: 'Gold', returns: 6.8, risk: 18.5 },
    { asset: 'Bonds', returns: 4.2, risk: 5.2 },
    { asset: 'Savings', returns: 2.5, risk: 0.5 }
  ];

  // Regional market share
  const regionalMarketShare = [
    { name: 'Europe', value: 35, color: '#D97706' },
    { name: 'North America', value: 28, color: '#F59E0B' },
    { name: 'Asia-Pacific', value: 22, color: '#FCD34D' },
    { name: 'Latin America', value: 8, color: '#FDE68A' },
    { name: 'Middle East & Africa', value: 7, color: '#FEF3C7' }
  ];

  // Value appreciation over time
  const valueAppreciationData = [
    { age: 0, value: 100, label: 'New Make' },
    { age: 3, value: 125, label: '3 Years' },
    { age: 5, value: 165, label: '5 Years' },
    { age: 8, value: 210, label: '8 Years' },
    { age: 10, value: 280, label: '10 Years' },
    { age: 12, value: 380, label: '12 Years' },
    { age: 15, value: 520, label: '15 Years' },
    { age: 18, value: 680, label: '18 Years' },
    { age: 21, value: 950, label: '21 Years' },
    { age: 25, value: 1400, label: '25 Years' }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Market') ? '£' : ''}{entry.value}
              {entry.name.includes('Market') ? 'B' : entry.name.includes('Return') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Chart Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'market-size', label: 'Market Growth', icon: GlobeAltIcon },
          { id: 'returns', label: 'Returns Comparison', icon: ArrowTrendingUpIcon },
          { id: 'regional', label: 'Regional Markets', icon: ChartBarIcon },
          { id: 'appreciation', label: 'Value Appreciation', icon: CurrencyPoundIcon }
        ].map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
              activeChart === chart.id
                ? 'bg-premium-gold text-primary-black font-semibold'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <chart.icon className="w-4 h-4 mr-2" />
            {chart.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Market Size Chart */}
        {activeChart === 'market-size' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Whisky Market Projections (2024-2033)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-premium-gold/10 to-yellow-100/10 rounded-lg p-4">
                <GlobeAltIcon className="w-8 h-8 text-premium-gold mb-2" />
                <div className="text-2xl font-bold text-gray-900">£7.5B</div>
                <div className="text-sm text-gray-600">Global Market by 2033</div>
                <div className="text-xs text-eco-green font-semibold mt-1">+6.44% CAGR</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4">
                <img src="/whisky/flags/gb.svg" alt="Great Britain" className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold text-gray-900">£0.71B</div>
                <div className="text-sm text-gray-600">GB Market by 2033</div>
                <div className="text-xs text-eco-green font-semibold mt-1">+5.9% CAGR</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4">
                <ArrowTrendingUpIcon className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">76%</div>
                <div className="text-sm text-gray-600">Total Growth</div>
                <div className="text-xs text-gray-500 mt-1">2024-2033</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={marketSizeData}>
                <defs>
                  <linearGradient id="globalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="gbGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="year" stroke="#111827" />
                <YAxis stroke="#111827" label={{ value: 'Market Value (£B)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="global"
                  name="Global Market"
                  stroke="#D97706"
                  fillOpacity={1}
                  fill="url(#globalGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="gb"
                  name="GB Market"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#gbGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Returns Comparison Chart */}
        {activeChart === 'returns' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Investment Returns vs Risk Comparison
            </h3>
            <p className="text-gray-600 mb-6">
              Whisky casks offer competitive returns with relatively lower risk
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={returnsComparisonData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  type="number" 
                  domain={[0, 20]} 
                  stroke="#111827"
                  tick={{ fill: '#111827' }}
                />
                <YAxis 
                  dataKey="asset" 
                  type="category" 
                  stroke="#111827" 
                  width={100}
                  tick={{ fill: '#111827' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="returns" name="Annual Returns (%)" fill="#D97706" radius={[0, 8, 8, 0]} />
                <Bar dataKey="risk" name="Volatility (%)" fill="#DC2626" opacity={0.5} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Key Insight:</strong> Whisky casks demonstrate an optimal risk-return profile, 
                offering higher returns than traditional safe assets while maintaining lower volatility than equities.
              </p>
            </div>
          </div>
        )}

        {/* Regional Market Share */}
        {activeChart === 'regional' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Global Whisky Market Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={regionalMarketShare}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionalMarketShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-4 h-4 bg-premium-gold rounded-full mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Europe (35%):</strong> Traditional stronghold with established collector base
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>North America (28%):</strong> Rapid growth in premium segment
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <strong>Asia-Pacific (22%):</strong> Emerging market with highest growth potential
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Value Appreciation Chart */}
        {activeChart === 'appreciation' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Cask Value Appreciation Over Time
            </h3>
            <p className="text-gray-600 mb-6">
              Index value starting at 100 for new make spirit
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={valueAppreciationData}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="age" 
                  stroke="#111827"
                  label={{ value: 'Age (Years)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#111827"
                  label={{ value: 'Value Index', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-semibold">{data.label}</p>
                          <p className="text-sm text-premium-gold">
                            Value: {data.value} ({((data.value - 100) / 100 * 100).toFixed(0)}% increase)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D97706"
                  fillOpacity={1}
                  fill="url(#valueGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { period: '5 Years', increase: '65%', color: 'bg-green-100 text-green-800' },
                { period: '10 Years', increase: '180%', color: 'bg-blue-100 text-blue-800' },
                { period: '15 Years', increase: '420%', color: 'bg-purple-100 text-purple-800' },
                { period: '25 Years', increase: '1,300%', color: 'bg-red-100 text-red-800' }
              ].map((item, index) => (
                <div key={index} className={`${item.color} rounded-lg p-4 text-center`}>
                  <div className="text-sm font-medium">{item.period}</div>
                  <div className="text-2xl font-bold">+{item.increase}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Market Drivers */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Key Market Drivers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Premiumization',
              description: 'Consumers paying more for quality and heritage',
              icon: '💎'
            },
            {
              title: 'Emerging Markets',
              description: 'Asia-Pacific driving global demand growth',
              icon: '🌏'
            },
            {
              title: 'Limited Supply',
              description: 'Aging requirements create natural scarcity',
              icon: '⏳'
            },
            {
              title: 'Investment Appeal',
              description: 'Growing recognition as alternative asset',
              icon: '📈'
            }
          ].map((driver, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="text-4xl mb-3">{driver.icon}</div>
              <h4 className="font-semibold mb-2">{driver.title}</h4>
              <p className="text-sm text-gray-300">{driver.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketGrowthChart;