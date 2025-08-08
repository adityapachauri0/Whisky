import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { generateInvestmentServiceSchema, generateBreadcrumbSchema } from '../utils/structuredData';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarIcon,
  TagIcon,
  ChevronRightIcon,
  FunnelIcon,
  SparklesIcon,
  NewspaperIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  CurrencyPoundIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  BeakerIcon,
  TrophyIcon,
  ScaleIcon,
  ArrowUpIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  distilleries, 
  distilleryNews, 
  regionalData,
  investmentGrades,
  getDistilleriesByRegion,
  getDistilleriesByGrade,
  getFeaturedDistilleries,
  getLatestNews,
  getRegionalData,
  getInvestmentGradeInfo,
  calculateInvestmentReturn,
  type InvestmentGrade,
  type Distillery,
  type RegionalData,
  type DistilleryNews
} from '../data/distilleriesData';
import OptimizedImage from '../components/common/OptimizedImage';

// Investment Calculator Component
const InvestmentCalculator: React.FC = () => {
  const [investment, setInvestment] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [grade, setGrade] = useState<InvestmentGrade>('Premium');
  
  const projectedValue = useMemo(() => {
    const gradeInfo = getInvestmentGradeInfo(grade);
    const rate = parseFloat(gradeInfo.expectedReturns.split('-')[1]?.replace('% annually', '') || '10') / 100;
    return investment * Math.pow(1 + rate, years);
  }, [investment, years, grade]);

  const totalReturn = projectedValue - investment;
  const returnPercentage = ((totalReturn / investment) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-r from-premium-gold/10 to-antique-gold/10 rounded-xl p-6 border border-premium-gold/30">
      <h3 className="text-xl font-serif text-text-primary mb-4">Investment Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary mb-2 block">Initial Investment</label>
          <div className="relative">
            <CurrencyPoundIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-gold" />
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-premium-gold/30 rounded-lg text-text-primary focus:outline-none focus:border-premium-gold"
              min="5000"
              step="1000"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-2 block">Investment Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as InvestmentGrade)}
            className="w-full px-4 py-3 bg-white/10 border border-premium-gold/30 rounded-lg text-text-primary focus:outline-none focus:border-premium-gold"
          >
            <option value="Standard">Standard (Under £8k)</option>
            <option value="Premium">Premium (£8-20k)</option>
            <option value="Super Premium">Super Premium (£12-40k)</option>
            <option value="Ultra Premium">Ultra Premium (£20k+)</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-2 block">Maturation Period (Years)</label>
          <input
            type="range"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
            min="5"
            max="30"
            step="1"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>5 years</span>
            <span className="text-premium-gold font-semibold">{years} years</span>
            <span>30 years</span>
          </div>
        </div>

        <div className="pt-4 border-t border-premium-gold/20">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Initial Investment</span>
              <span className="text-text-primary font-semibold">£{investment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Projected Value</span>
              <span className="text-eco-green font-bold text-xl">£{Math.round(projectedValue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Return</span>
              <span className="text-premium-gold font-semibold">
                £{Math.round(totalReturn).toLocaleString()} ({returnPercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Regional Explorer Component
const RegionalExplorer: React.FC<{ onRegionSelect: (region: string) => void }> = ({ onRegionSelect }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {regionalData.map((region) => (
        <motion.div
          key={region.region}
          onHoverStart={() => setHoveredRegion(region.region)}
          onHoverEnd={() => setHoveredRegion(null)}
          whileHover={{ scale: 1.05 }}
          className="relative cursor-pointer group"
          onClick={() => onRegionSelect(region.region)}
        >
          <div className="relative h-64 rounded-xl overflow-hidden">
            <OptimizedImage
              src={region.image}
              alt={region.region}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/50 to-transparent" />
            
            {/* Region Info Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-serif text-text-primary mb-2">{region.region}</h3>
              <p className="text-premium-gold font-semibold mb-1">{region.distilleryCount} Distilleries</p>
              <p className="text-text-secondary text-sm line-clamp-2">{region.description}</p>
            </div>

            {/* Hover Details */}
            <AnimatePresence>
              {hoveredRegion === region.region && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-primary-black/95 p-6 flex flex-col justify-center"
                >
                  <h3 className="text-2xl font-serif text-premium-gold mb-3">{region.region}</h3>
                  <p className="text-text-secondary text-sm mb-4">{region.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-text-secondary mb-2">FLAVOR PROFILE</p>
                    <div className="flex flex-wrap gap-2">
                      {region.flavorCharacteristics.slice(0, 4).map((flavor) => (
                        <span key={flavor} className="text-xs px-2 py-1 bg-premium-gold/20 text-premium-gold rounded">
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary mb-2">INVESTMENT POTENTIAL</p>
                    <p className="text-sm text-eco-green">{region.investmentPotential}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Distilleries: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedGrade, setSelectedGrade] = useState<InvestmentGrade | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRegionalExplorer, setShowRegionalExplorer] = useState(true);

  // Filter distilleries
  const filteredDistilleries = useMemo(() => {
    let filtered = selectedRegion === 'All Regions' 
      ? distilleries 
      : getDistilleriesByRegion(selectedRegion);
    
    if (selectedGrade !== 'All') {
      filtered = filtered.filter(d => d.investmentGrade === selectedGrade);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedRegion, selectedGrade, searchQuery]);

  // Filter news
  const filteredNews = useMemo(() => {
    if (selectedCategory === 'all') return distilleryNews;
    return distilleryNews.filter(n => n.category === selectedCategory);
  }, [selectedCategory]);

  const featuredDistilleries = getFeaturedDistilleries();
  const latestNews = getLatestNews(6);

  const categories = [
    { id: 'all', name: 'All News', icon: NewspaperIcon },
    { id: 'release', name: 'New Releases', icon: SparklesIcon },
    { id: 'auction', name: 'Auctions', icon: TrophyIcon },
    { id: 'market', name: 'Market Analysis', icon: ChartBarIcon },
    { id: 'award', name: 'Awards', icon: StarIcon },
    { id: 'investment', name: 'Investment', icon: ArrowTrendingUpIcon }
  ];

  const gradeFilters = [
    { value: 'All', label: 'All Grades', color: 'text-text-secondary' },
    { value: 'Ultra Premium', label: 'Ultra Premium (£20k+)', color: 'text-purple-400' },
    { value: 'Super Premium', label: 'Super Premium (£12-40k)', color: 'text-premium-gold' },
    { value: 'Premium', label: 'Premium (£8-20k)', color: 'text-eco-green' },
    { value: 'Standard', label: 'Standard (Under £8k)', color: 'text-blue-400' }
  ];

  return (
    <>
      <Helmet>
        <title>Premium Scottish Distilleries | Whisky Cask Investment Guide 2025 - ViticultWhisky</title>
        <meta name="description" content="Explore 11+ premium Scottish distilleries for whisky cask investment. Investment grades from £6,000 to £250,000+ with 8-30% annual returns. Expert guidance since 2014." />
        <meta name="keywords" content="whisky cask investment, Scottish distilleries, Macallan investment, Springbank casks, Ardbeg investment, whisky investment UK, cask whisky portfolio, premium scotch investment" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Premium Scottish Distilleries | Whisky Cask Investment - ViticultWhisky" />
        <meta property="og:description" content="Discover investment opportunities from The Macallan, Springbank, Ardbeg, Lagavulin and more. Professional cask investment with 8-30% annual returns." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viticultwhisky.co.uk/distilleries" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/distilleries/macallan-distillery.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ViticultWhisky" />
        <meta property="og:locale" content="en_GB" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Scottish Distilleries | Whisky Investment Guide" />
        <meta name="twitter:description" content="Explore 11+ premium distilleries. Investment grades £6k-£250k+. Expert guidance since 2014." />
        <meta name="twitter:image" content="https://viticultwhisky.co.uk/whisky/distilleries/macallan-distillery.webp" />
        <meta name="twitter:site" content="@viticultwhisky" />
        
        {/* Canonical and Language */}
        <link rel="canonical" href="https://viticultwhisky.co.uk/distilleries" />
        <link rel="alternate" hrefLang="en-gb" href="https://viticultwhisky.co.uk/distilleries" />
        <link rel="alternate" hrefLang="en" href="https://viticultwhisky.co.uk/distilleries" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateInvestmentServiceSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Distilleries', url: '/distilleries' }
          ]))}
        </script>
      </Helmet>

      {/* Hero Section with Luxury Feel */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background with Parallax Effect */}
        <div className="absolute inset-0">
          <OptimizedImage
            src="/whisky/distilleries/dalmore-distillery-building.webp"
            alt="Premium Scottish Distillery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-black/70 via-primary-black/80 to-primary-black" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 bg-premium-gold/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${i * 25}%`,
                top: `${i * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-premium-gold/20 backdrop-blur-md rounded-full border border-premium-gold/30 mb-6"
            >
              <TrophyIcon className="w-5 h-5 text-premium-gold" />
              <span className="text-premium-gold font-medium text-sm md:text-base">Scotland's Finest Investment Grade Distilleries</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-primary mb-8">
              Premium <span className="text-premium-gold">Distillery</span> Investments
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-4xl mx-auto mb-10 leading-relaxed">
              Exclusive access to Scotland's most prestigious distilleries. 
              From £6,000 entry-level to £80,000 ultra-premium casks with proven returns of 8-30% annually.
            </p>
            
            {/* Search Bar with Premium Styling */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-premium-gold to-antique-gold rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by distillery, region, or investment grade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-md border border-premium-gold/30 rounded-lg text-text-primary placeholder-text-secondary/60 focus:outline-none focus:border-premium-gold transition-all"
                  />
                  <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-gold" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mt-12">
              {[
                { label: 'Total Distilleries', value: '144+', icon: BuildingOfficeIcon },
                { label: 'Avg. Annual Return', value: '12-18%', icon: ArrowTrendingUpIcon },
                { label: 'Min. Investment', value: '£6,000', icon: CurrencyPoundIcon },
                { label: 'Years Trading', value: 'Since 2014', icon: ClockIcon }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-lg p-4 md:p-5 border border-white/10"
                >
                  <stat.icon className="w-6 h-6 text-premium-gold mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-secondary">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRightIcon className="w-6 h-6 text-premium-gold rotate-90" />
        </motion.div>
      </section>

      {/* Investment Grade Filter Bar */}
      <section className="sticky top-20 z-30 py-4 px-6 md:px-12 lg:px-20 bg-primary-black/95 backdrop-blur-md border-b border-premium-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-premium-gold" />
              <span className="text-text-secondary font-medium">Investment Grade:</span>
              <div className="flex gap-2">
                {gradeFilters.map(grade => (
                  <button
                    key={grade.value}
                    onClick={() => setSelectedGrade(grade.value as InvestmentGrade | 'All')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedGrade === grade.value
                        ? 'bg-premium-gold text-primary-black'
                        : `bg-white/10 ${grade.color} hover:bg-white/20`
                    }`}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-premium-gold/20 text-premium-gold rounded-lg hover:bg-premium-gold/30 transition-colors"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Investment Calculator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Regional Explorer Section */}
      {showRegionalExplorer && (
        <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-primary-black via-rich-brown to-primary-black">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-text-primary mb-4">Explore by Region</h2>
              <p className="text-text-secondary max-w-3xl mx-auto">
                Scotland's five whisky regions each offer unique investment opportunities, 
                from Speyside's blue-chip brands to Campbeltown's extreme scarcity
              </p>
            </motion.div>

            <RegionalExplorer onRegionSelect={setSelectedRegion} />

            {/* Regional Statistics */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Highest Value</h3>
                <p className="text-3xl font-bold text-purple-400 mb-1">Speyside</p>
                <p className="text-sm text-text-secondary">Home to Macallan & Glenfiddich</p>
              </div>
              <div className="bg-gradient-to-br from-premium-gold/20 to-antique-gold/10 rounded-xl p-6 border border-premium-gold/20">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Best Returns</h3>
                <p className="text-3xl font-bold text-premium-gold mb-1">Campbeltown</p>
                <p className="text-sm text-text-secondary">Springbank 30-40% appreciation</p>
              </div>
              <div className="bg-gradient-to-br from-eco-green/20 to-forest-green/10 rounded-xl p-6 border border-eco-green/20">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Most Collectible</h3>
                <p className="text-3xl font-bold text-eco-green mb-1">Islay</p>
                <p className="text-sm text-text-secondary">Ardbeg & Lagavulin cult following</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Investment Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary-black/80 backdrop-blur-md"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <InvestmentCalculator />
              <button
                onClick={() => setShowCalculator(false)}
                className="mt-4 w-full py-3 bg-premium-gold text-primary-black rounded-lg font-semibold hover:bg-bright-gold transition-colors"
              >
                Close Calculator
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Ultra Premium Distilleries */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-primary-black to-rich-brown">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-2 text-text-primary">Ultra Premium Investments</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 rounded-full border border-purple-500/30">
                <FireIcon className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-semibold">£20,000+ • 15-30% Returns</span>
              </div>
            </div>
            <p className="text-text-secondary max-w-3xl">
              Blue-chip distilleries with extreme scarcity, auction records, and global collector demand
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredDistilleries.slice(0, 3).map((distillery, index) => (
              <motion.article
                key={distillery.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-b from-medium-brown to-warm-brown rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Investment Grade Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-purple-900/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    {distillery.investmentGrade}
                  </span>
                </div>

                {/* Market Demand Indicator */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-red-900/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                    {distillery.marketDemand} Demand
                  </span>
                </div>

                <div className="relative h-72 overflow-hidden">
                  <OptimizedImage
                    src={distillery.image}
                    alt={distillery.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif text-text-primary mb-2">{distillery.name}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1 text-premium-gold" />
                        <span className="text-text-secondary">{distillery.location}</span>
                      </div>
                      <span className="text-premium-gold">•</span>
                      <span className="text-text-secondary">Est. {distillery.established}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-text-secondary mb-6 line-clamp-2">
                    {distillery.investmentNotes}
                  </p>
                  
                  {/* Investment Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">Min. Investment</p>
                      <p className="text-premium-gold font-bold">{distillery.minimumInvestment}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">Annual Returns</p>
                      <p className="text-eco-green font-bold">{distillery.annualAppreciation}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">Typical Cask</p>
                      <p className="text-text-primary font-semibold">{distillery.typicalCaskPrice}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">Risk Level</p>
                      <p className={`font-semibold ${
                        distillery.riskLevel === 'Low' ? 'text-eco-green' :
                        distillery.riskLevel === 'Medium' ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>{distillery.riskLevel}</p>
                    </div>
                  </div>

                  {/* Notable Whiskies */}
                  <div className="mb-6">
                    <p className="text-xs text-text-secondary mb-2">NOTABLE EXPRESSIONS</p>
                    <div className="flex flex-wrap gap-2">
                      {distillery.notableWhiskies.slice(0, 3).map((whisky) => (
                        <span key={whisky} className="text-xs px-2 py-1 bg-premium-gold/10 text-premium-gold rounded">
                          {whisky}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/contact?distillery=${distillery.id}&grade=${distillery.investmentGrade}`)}
                    className="w-full py-3 bg-gradient-to-r from-premium-gold to-antique-gold text-primary-black rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Request Investment Details
                      <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Market News & Analysis */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-rich-brown to-primary-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="heading-2 text-text-primary mb-4">Market News & Analysis</h2>
            <p className="text-text-secondary max-w-3xl">
              Latest auction results, new releases, and investment opportunities
            </p>
          </motion.div>

          {/* News Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-premium-gold text-primary-black'
                      : 'bg-white/10 text-text-secondary hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {filteredNews.slice(0, 6).map((news, index) => {
                const distillery = distilleries.find(d => d.id === news.distilleryId);
                return (
                  <motion.article
                    key={news.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-medium-brown rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {news.image && (
                      <div className="relative h-48 overflow-hidden">
                        <OptimizedImage
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-black/70 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            news.category === 'auction' ? 'bg-purple-900/80 text-purple-300' :
                            news.category === 'release' ? 'bg-eco-green/80 text-white' :
                            news.category === 'market' ? 'bg-blue-900/80 text-blue-300' :
                            'bg-premium-gold/80 text-primary-black'
                          }`}>
                            <TagIcon className="w-3 h-3 mr-1" />
                            {news.category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                        <span className="inline-flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(news.date).toLocaleDateString('en-GB', { 
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {distillery && (
                          <>
                            <span>•</span>
                            <span className="text-premium-gold font-semibold">{distillery.name}</span>
                          </>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-premium-gold transition-colors">
                        {news.title}
                      </h3>
                      
                      <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">{news.author}</span>
                        <button className="inline-flex items-center text-premium-gold hover:text-bright-gold transition-colors text-sm font-medium">
                          Read Analysis
                          <ChevronRightIcon className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* All Distilleries by Grade */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-primary-black to-rich-brown">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="heading-2 text-text-primary mb-4">
              Investment Portfolio
              {searchQuery && (
                <span className="text-premium-gold ml-2">
                  ({filteredDistilleries.length} results)
                </span>
              )}
            </h2>
            <p className="text-text-secondary max-w-3xl">
              Complete portfolio of investment-grade distilleries across all price points
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDistilleries.map((distillery, index) => (
              <motion.article
                key={distillery.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-medium-brown to-warm-brown rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <OptimizedImage
                      src={distillery.image}
                      alt={distillery.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Grade Overlay */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full backdrop-blur-sm ${
                      distillery.investmentGrade === 'Ultra Premium' ? 'bg-purple-900/90 text-purple-300' :
                      distillery.investmentGrade === 'Super Premium' ? 'bg-premium-gold/90 text-primary-black' :
                      distillery.investmentGrade === 'Premium' ? 'bg-eco-green/90 text-white' :
                      'bg-blue-900/90 text-blue-300'
                    }`}>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {distillery.investmentGrade}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:w-3/5">
                    <div className="mb-4">
                      <h3 className="text-xl font-serif text-text-primary mb-2">{distillery.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1 text-premium-gold" />
                          {distillery.region}
                        </span>
                        <span>•</span>
                        <span>{distillery.distillerySize} Distillery</span>
                        <span>•</span>
                        <span>Est. {distillery.established}</span>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {distillery.description}
                    </p>
                    
                    {/* Key Investment Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-text-secondary">Min. Cask</p>
                        <p className="text-premium-gold font-bold">{distillery.minimumInvestment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">Returns</p>
                        <p className="text-eco-green font-bold">{distillery.expectedReturns.split(' ')[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">Risk</p>
                        <p className={`font-bold ${
                          distillery.riskLevel === 'Low' ? 'text-eco-green' :
                          distillery.riskLevel === 'Low-Medium' ? 'text-yellow-400' :
                          distillery.riskLevel === 'Medium' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>{distillery.riskLevel}</p>
                      </div>
                    </div>

                    {/* Flavor Profile */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {distillery.flavorProfile.slice(0, 4).map((flavor) => (
                        <span
                          key={flavor}
                          className="text-xs px-2 py-1 bg-white/10 text-text-secondary rounded"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ScaleIcon className="w-4 h-4 text-premium-gold" />
                        <span className="text-xs text-text-secondary">
                          {distillery.productionCapacity}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/contact?distillery=${distillery.id}`)}
                        className="inline-flex items-center px-4 py-2 bg-premium-gold text-primary-black rounded-lg hover:bg-bright-gold transition-colors font-medium text-sm group"
                      >
                        Invest Now
                        <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredDistilleries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                No distilleries found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('All');
                  setSelectedRegion('All Regions');
                }}
                className="mt-4 px-6 py-2 bg-premium-gold text-primary-black rounded-lg hover:bg-bright-gold transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-rich-brown to-primary-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-text-primary mb-6">
              Ready to Start Your Whisky Investment Journey?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Join over 140,000 successful transactions since 2014. 
              Expert guidance from entry-level to ultra-premium investments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-gradient-to-r from-premium-gold to-antique-gold text-primary-black rounded-lg font-bold hover:shadow-xl transition-all duration-300"
              >
                Schedule Investment Consultation
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className="px-8 py-4 bg-white/10 text-text-primary rounded-lg font-bold hover:bg-white/20 transition-all duration-300"
              >
                Learn How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-eco-green" />
                <span className="text-text-secondary">WOWGR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-premium-gold" />
                <span className="text-text-secondary">AFC Wimbledon Sponsor</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-text-secondary">5-Star Reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Distilleries;