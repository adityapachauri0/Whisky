import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Buy: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'all', name: 'All Whiskys' },
    { id: 'single-malt', name: 'Single Malt' },
    { id: 'rare-casks', name: 'Rare Casks' },
    { id: 'investment-grade', name: 'Investment Grade' },
    { id: 'limited-edition', name: 'Limited Edition' }
  ];

  const whiskys = [
    {
      id: 1,
      name: 'Macallan 18 Year Old',
      category: 'single-malt',
      region: 'Speyside',
      age: '18 Years',
      price: 45000,
      image: '/whisky/shop-bottle-3.webp',
      description: 'Exceptional single malt with rich sherry influence',
      abv: '43%',
      caskType: 'Sherry Oak',
      investmentRating: 5
    },
    {
      id: 2,
      name: 'Ardbeg 25 Year Old',
      category: 'rare-casks',
      region: 'Islay',
      age: '25 Years',
      price: 75000,
      image: '/whisky/shop-bottle-4.webp',
      description: 'Intensely peated Islay whisky with complex maritime notes',
      abv: '46%',
      caskType: 'Ex-Bourbon',
      investmentRating: 5
    },
    {
      id: 3,
      name: 'Highland Park 1968',
      category: 'investment-grade',
      region: 'Highland',
      age: '54 Years',
      price: 125000,
      image: '/whisky/shop-bottle-1.webp',
      description: 'Ultra-rare vintage Highland single malt',
      abv: '42.8%',
      caskType: 'Mixed Casks',
      investmentRating: 5
    },
    {
      id: 4,
      name: 'Glenfiddich 30 Year',
      category: 'investment-grade',
      region: 'Speyside',
      age: '30 Years',
      price: 55000,
      image: '/whisky/shop-daftmill-2011.webp',
      description: 'Prestigious Speyside single malt with exceptional depth',
      abv: '43%',
      caskType: 'American & European Oak',
      investmentRating: 4
    },
    {
      id: 5,
      name: 'Dalmore Constellation 1969',
      category: 'limited-edition',
      region: 'Highland',
      age: '51 Years',
      price: 250000,
      image: '/whisky/shop-bottle-7.webp',
      description: 'One of the rarest Dalmore releases ever',
      abv: '45.5%',
      caskType: 'Matusalem Sherry',
      investmentRating: 5
    },
    {
      id: 6,
      name: 'Lagavulin 16 Year',
      category: 'single-malt',
      region: 'Islay',
      age: '16 Years',
      price: 12500,
      image: '/whisky/shop-bottle-10.webp',
      description: 'Classic Islay single malt with intense peat smoke',
      abv: '43%',
      caskType: 'Ex-Sherry',
      investmentRating: 3
    }
  ];

  const filteredWhiskys = whiskys.filter(whisky => {
    if (selectedCategory !== 'all' && whisky.category !== selectedCategory) return false;
    
    if (priceRange !== 'all') {
      if (priceRange === 'under-25k' && whisky.price >= 25000) return false;
      if (priceRange === '25k-50k' && (whisky.price < 25000 || whisky.price > 50000)) return false;
      if (priceRange === '50k-100k' && (whisky.price < 50000 || whisky.price > 100000)) return false;
      if (priceRange === 'over-100k' && whisky.price < 100000) return false;
    }
    
    return true;
  });

  const sortedWhiskys = [...filteredWhiskys].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'age') return parseInt(b.age) - parseInt(a.age);
    return 0;
  });

  return (
    <div className="min-h-screen bg-primary-black">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/whisky/tfandr-whisky-barrels.webp"
            alt="Whisky barrels"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-primary-black" />
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="font-serif italic text-5xl md:text-6xl lg:text-7xl text-text-primary mb-6">
                Exceptional <span className="text-gradient-gold">Whisky Collection</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl">
                Discover our curated selection of rare and investment-grade whiskys from the world's most prestigious distilleries
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-20 bg-rich-brown/95 backdrop-blur-md border-b border-premium-gold/20">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex items-center gap-4">
              <FunnelIcon className="h-5 w-5 text-premium-gold" />
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-none text-sm font-medium tracking-wider uppercase transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold text-primary-black'
                        : 'text-text-secondary hover:text-premium-gold border border-premium-gold/30 hover:border-premium-gold'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Sort */}
            <div className="flex items-center gap-4">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-transparent border border-premium-gold/30 text-text-secondary px-4 py-2 rounded-none focus:outline-none focus:border-premium-gold"
              >
                <option value="all">All Prices</option>
                <option value="under-25k">Under £25,000</option>
                <option value="25k-50k">£25,000 - £50,000</option>
                <option value="50k-100k">£50,000 - £100,000</option>
                <option value="over-100k">Over £100,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-premium-gold/30 text-text-secondary px-4 py-2 rounded-none focus:outline-none focus:border-premium-gold"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="age">Age</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {sortedWhiskys.map((whisky, index) => (
              <motion.div
                key={whisky.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="card-luxury h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-b from-rich-brown/50 to-primary-black/50">
                    <img
                      src={whisky.image}
                      alt={whisky.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Quick View */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Link to="/contact" className="btn-secondary transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                        Quick View
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium tracking-widest uppercase text-premium-gold">
                          {whisky.region}
                        </span>
                        <span className="text-xs font-medium tracking-wide text-text-secondary">
                          {whisky.age}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-2xl text-text-primary mb-2 group-hover:text-premium-gold transition-colors duration-300">
                        {whisky.name}
                      </h3>
                      
                      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                        {whisky.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mb-4">
                        <div>
                          <span className="text-premium-gold">ABV:</span> {whisky.abv}
                        </div>
                        <div>
                          <span className="text-premium-gold">Cask:</span> {whisky.caskType}
                        </div>
                      </div>

                      {/* Investment Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        <span className="text-xs text-text-secondary mr-2">Investment Rating:</span>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < whisky.investmentRating ? 'text-premium-gold' : 'text-gray-700'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="border-t border-premium-gold/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-3xl text-text-primary">
                          £{whisky.price.toLocaleString()}
                        </span>
                        <Link to="/contact" className="btn-premium-small group inline-flex items-center">
                          Enquire
                          <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-brown">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif italic text-4xl md:text-5xl text-text-primary mb-6">
              Looking to <span className="text-gradient-gold">Sell Your Whisky?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Get expert valuation and access to our global network of collectors and investors
            </p>
            <Link to="/sell-whisky" className="btn-premium inline-flex items-center">
              Start Selling
              <ArrowRightIcon className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Buy;