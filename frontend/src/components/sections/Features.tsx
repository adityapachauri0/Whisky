import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ChartBarIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ScaleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState('growth');

  // Market Growth Chart Data (converted to GBP)
  const marketGrowthData = {
    labels: ['2013', '2015', '2017', '2019', '2021', '2023', '2025', '2027', '2029', '2031', '2033'],
    datasets: [
      {
        label: 'Global Irish Whiskey Market Value',
        data: [2.2, 2.5, 2.9, 3.4, 3.9, 4.3, 4.9, 5.5, 6.2, 6.9, 7.5],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#D4AF37',
        pointBorderColor: '#1A0D08',
        pointBorderWidth: 2,
      }
    ]
  };

  const marketGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Irish Whiskey Market Growth (Billions GBP)',
        color: '#F5DEB3',
        font: {
          size: 16,
          family: 'Merriweather',
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 13, 8, 0.9)',
        titleColor: '#F5DEB3',
        bodyColor: '#F5DEB3',
        borderColor: '#D2691E',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            return `Market Value: £${context.parsed.y}B`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(245, 222, 179, 0.1)',
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return '£' + value + 'B';
          }
        }
      }
    }
  };

  // Value Appreciation Chart Data
  const valueAppreciationData = {
    labels: ['0 years', '5 years', '10 years', '15 years', '20 years', '25+ years'],
    datasets: [
      {
        label: 'Average Cask Value',
        data: [3000, 7500, 15000, 35000, 75000, 150000],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#FFD700',
        pointBorderColor: '#1A0D08',
        pointBorderWidth: 2,
      }
    ]
  };

  const valueAppreciationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Whisky Value Appreciation Over Time',
        color: '#F5DEB3',
        font: {
          size: 16,
          family: 'Merriweather',
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 13, 8, 0.9)',
        titleColor: '#F5DEB3',
        bodyColor: '#F5DEB3',
        borderColor: '#D2691E',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            return `Value: £${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(245, 222, 179, 0.1)',
          borderColor: '#D2691E'
        },
        ticks: {
          color: '#F5DEB3',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return '£' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  // Key growth drivers
  const growthDrivers = [
    {
      icon: GlobeAltIcon,
      title: 'Global Demand',
      description: 'Demand in US, Asia & Europe for premium and collectible whiskey'
    },
    {
      icon: SparklesIcon,
      title: 'Whiskey Tourism',
      description: 'Tourism and whiskey culture supporting distillery branding'
    },
    {
      icon: ClockIcon,
      title: 'Supply Scarcity',
      description: 'Global scarcity of aged whiskey due to long maturation cycles'
    }
  ];

  // Investment comparison table data
  const investmentComparison = [
    { feature: 'Tangible Asset', whisky: true, stocks: false, realEstate: true },
    { feature: 'Low Market Volatility', whisky: true, stocks: false, realEstate: 'moderate' },
    { feature: 'Capital Gains Tax Free*', whisky: true, stocks: false, realEstate: false },
    { feature: 'Minimum Entry (~£2.5K)', whisky: true, stocks: 'medium', realEstate: false },
    { feature: 'Passive Management', whisky: true, stocks: false, realEstate: false },
    { feature: 'High Liquidity', whisky: 'medium', stocks: true, realEstate: false }
  ];

  // Benefits checklist
  const benefits = [
    'Physical ownership of a secure, appreciating asset',
    '12–15% average annual returns historically',
    'Free from UK Capital Gains Tax',
    'Stability in inflationary environments',
    'Luxury market appeal and rising global demand',
    'Fully insured & professionally stored',
    'Flexible exit options from 5 years onward'
  ];

  // Exit strategies
  const exitStrategies = [
    { icon: '🏷️', title: 'Cask Auctions', description: 'Premium auction houses specializing in rare spirits' },
    { icon: '🥃', title: 'Independent Bottlers', description: 'Established bottlers seeking quality aged stock' },
    { icon: '🔁', title: 'Distillery Buy-backs', description: 'Original distilleries repurchasing mature casks' },
    { icon: '🍾', title: 'Personal Bottling', description: 'Create your own private label collection' },
    { icon: '👤', title: 'Private Sales', description: 'Direct collector-to-collector transactions' }
  ];

  return (
    <section className="section-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)`
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
            Why Choose <span className="text-gradient-gold">Whisky Investment?</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            Whiskey—particularly Irish whiskey—offers a uniquely compelling case as an alternative investment. 
            Fueled by surging global demand, limited supply, tax efficiency, and tangible asset security.
          </p>
          <div className="divider-gold mt-8" />
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'growth', label: 'Market Growth', icon: ArrowTrendingUpIcon },
            { id: 'comparison', label: 'Investment Comparison', icon: ScaleIcon },
            { id: 'appreciation', label: 'Value Appreciation', icon: ChartBarIcon },
            { id: 'benefits', label: 'Key Benefits', icon: CheckCircleIcon }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-gold text-primary-black'
                  : 'bg-rich-brown/30 text-text-secondary hover:bg-rich-brown/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Global Growth Trends Section */}
        {activeTab === 'growth' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <h3 className="font-serif text-3xl text-text-primary mb-8 text-center">
                Global Growth Trends: The Market is Booming
              </h3>
              
              {/* Market Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Global Market Size (2024)', value: '£4.3B', icon: GlobeAltIcon },
                  { label: 'Forecast Target (2033)', value: '£7.5B', icon: ArrowTrendingUpIcon },
                  { label: 'Annual Growth Rate', value: '6.44%', icon: ChartBarIcon },
                  { label: 'UK Export Value', value: '£8.1B', icon: BanknotesIcon }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-luxury-border p-6 text-center"
                  >
                    <stat.icon className="w-8 h-8 text-premium-gold mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gradient-gold mb-2">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Market Growth Chart */}
              <div className="card-luxury-border p-8 mb-12">
                <div className="h-[400px]">
                  <Line data={marketGrowthData} options={marketGrowthOptions} />
                </div>
              </div>

              {/* Growth Drivers */}
              <div className="grid md:grid-cols-3 gap-8">
                {growthDrivers.map((driver, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex p-4 rounded-full bg-premium-gold/10 mb-4">
                      <driver.icon className="w-8 h-8 text-premium-gold" />
                    </div>
                    <h4 className="font-serif text-xl text-text-primary mb-2">{driver.title}</h4>
                    <p className="text-text-secondary">{driver.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment Comparison Section */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-3xl text-text-primary mb-8 text-center">
              Tangible Asset in Uncertain Times
            </h3>
            
            <div className="card-luxury-border overflow-hidden mb-12">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-whisky-amber/20 to-gold-light/20">
                    <th className="px-6 py-4 text-left text-text-primary font-serif">Feature</th>
                    <th className="px-6 py-4 text-center text-text-primary font-serif">
                      <div className="flex items-center justify-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-premium-gold" />
                        <span>Whisky Casks</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-text-primary font-serif">
                      <div className="flex items-center justify-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-gray-400" />
                        <span>Stocks/Bonds</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-text-primary font-serif">
                      <div className="flex items-center justify-center gap-2">
                        <HomeIcon className="w-5 h-5 text-gray-400" />
                        <span>Real Estate</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investmentComparison.map((row, index) => (
                    <tr key={index} className="border-t border-gold-light/20 hover:bg-rich-brown/10">
                      <td className="px-6 py-4 text-text-secondary">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {row.whisky === true ? (
                          <CheckCircleIcon className="w-6 h-6 text-eco-green mx-auto" />
                        ) : row.whisky === false ? (
                          <XCircleIcon className="w-6 h-6 text-red-500 mx-auto" />
                        ) : (
                          <span className="text-yellow-500">{row.whisky}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.stocks === true ? (
                          <CheckCircleIcon className="w-6 h-6 text-eco-green mx-auto" />
                        ) : row.stocks === false ? (
                          <XCircleIcon className="w-6 h-6 text-red-500 mx-auto" />
                        ) : (
                          <span className="text-yellow-500">{row.stocks}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.realEstate === true ? (
                          <CheckCircleIcon className="w-6 h-6 text-eco-green mx-auto" />
                        ) : row.realEstate === false ? (
                          <XCircleIcon className="w-6 h-6 text-red-500 mx-auto" />
                        ) : (
                          <span className="text-yellow-500">{row.realEstate}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center text-sm text-text-secondary">
              <p>*Casks are wasting assets under UK law—exempt from CGT if sold before bottling.</p>
              <p>**CCI = Cask-to-cask investment transactions kept in bonded storage.</p>
            </div>
          </motion.div>
        )}

        {/* Value Appreciation Section */}
        {activeTab === 'appreciation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-3xl text-text-primary mb-8 text-center">
              Built-in Appreciation Through Maturation 🕰️
            </h3>
            
            <p className="text-xl text-text-secondary text-center mb-12 max-w-3xl mx-auto">
              What makes whiskey casks unique is that their value increases naturally over time. 
              The longer the whiskey matures, the rarer and more refined it becomes—aging is the value driver.
            </p>

            {/* Value Appreciation Chart */}
            <div className="card-luxury-border p-8 mb-12">
              <div className="h-[400px]">
                <Line data={valueAppreciationData} options={valueAppreciationOptions} />
              </div>
            </div>

            {/* Tax Efficiency Section */}
            <div className="bg-gradient-to-br from-premium-gold/10 to-transparent p-8 rounded-lg border border-gold-light/20 mb-12">
              <h4 className="font-serif text-2xl text-text-primary mb-6 text-center">
                Tax Efficiency = Keeping More of Your Gains 💸
              </h4>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <BanknotesIcon className="w-12 h-12 text-premium-gold mx-auto mb-3" />
                  <h5 className="font-semibold text-text-primary mb-2">No Capital Gains Tax</h5>
                  <p className="text-sm text-text-secondary">On profits from cask sales under bond</p>
                </div>
                <div>
                  <ClockIcon className="w-12 h-12 text-premium-gold mx-auto mb-3" />
                  <h5 className="font-semibold text-text-primary mb-2">Deferred Duties</h5>
                  <p className="text-sm text-text-secondary">Excise duty + VAT deferred until bottling</p>
                </div>
                <div>
                  <ShieldCheckIcon className="w-12 h-12 text-premium-gold mx-auto mb-3" />
                  <h5 className="font-semibold text-text-primary mb-2">Tax Efficient</h5>
                  <p className="text-sm text-text-secondary">Ideal for high-net-worth investors</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Key Benefits Section */}
        {activeTab === 'benefits' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-3xl text-text-primary mb-12 text-center">
              Portfolio Diversification & Protection
            </h3>

            {/* Benefits Checklist */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-12 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="w-6 h-6 text-eco-green flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Stability in Crisis */}
            <div className="bg-rich-brown/30 p-8 rounded-lg mb-12">
              <h4 className="font-serif text-2xl text-text-primary mb-6 text-center">
                🛡️ Stability in Times of Crisis
              </h4>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="text-text-secondary">
                  • During 2020–2022 (economic downturn + inflation), luxury collectibles — including whiskey — outperformed the S&P 500.
                </p>
                <p className="text-text-secondary">
                  • Unlike stocks, whiskey casks do not react to macro shocks or interest rate fluctuations.
                </p>
                <p className="text-whisky-amber font-semibold text-center mt-6">
                  🎯 Whiskey is driven by global consumer demand, branding, and aging—not by political or economic headlines.
                </p>
              </div>
            </div>

            {/* Exit Strategies */}
            <div>
              <h4 className="font-serif text-2xl text-text-primary mb-8 text-center">
                Exit Strategies Provide Flexibility
              </h4>
              <p className="text-text-secondary text-center mb-8">
                When your whiskey is ready for sale (typically after 5–15 years), you're not restricted.
              </p>
              <div className="grid md:grid-cols-5 gap-6">
                {exitStrategies.map((strategy, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-3">{strategy.icon}</div>
                    <h5 className="font-semibold text-text-primary mb-2">{strategy.title}</h5>
                    <p className="text-xs text-text-secondary">{strategy.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h4 className="font-serif text-2xl text-text-primary mb-8">
            Passive Wealth Building Process
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              'Purchase Cask',
              'Warehouse Storage',
              'Natural Aging',
              'Wealth Appreciation',
              'Strategic Exit',
              'Profit'
            ].map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-gold text-primary-black px-6 py-3 rounded-full font-semibold"
                >
                  {step}
                </motion.div>
                {index < 5 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    viewport={{ once: true }}
                  >
                    <ChartBarIcon className="w-6 h-6 text-premium-gold hidden md:block" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold p-px rounded-xl">
            <div className="bg-primary-black rounded-xl py-12 px-8">
              <h3 className="font-serif text-3xl text-text-primary mb-6">
                Ready to Diversify Your Portfolio?
              </h3>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of investors who have discovered the unique advantages of whisky cask investment
              </p>
              <Link
                to="/how-it-works"
                className="btn-primary text-lg px-10 py-4 inline-block"
              >
                Start Your Investment Journey
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;