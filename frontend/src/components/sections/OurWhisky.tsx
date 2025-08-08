import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhiskyRegion {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  image: string;
  distilleries: string[];
}

const OurWhisky: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('speyside');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const regions: WhiskyRegion[] = [
    {
      id: 'speyside',
      name: 'Speyside',
      description: 'The heartland of Scotch whisky production, home to over half of Scotland\'s distilleries. Speyside whiskies are renowned for their elegance and complexity, offering exceptional investment potential.',
      characteristics: ['Elegant & refined', 'Fruity & floral notes', 'Often sherry-cask influenced', 'Smooth & sophisticated'],
      image: '/whisky/casks/dalmore-21-casks.webp',
      distilleries: ['The Macallan', 'Glenfiddich', 'The Glenlivet', 'Aberlour', 'Balvenie']
    },
    {
      id: 'highland',
      name: 'Highland',
      description: 'The largest whisky-producing region in Scotland, offering incredible diversity from light and delicate to rich and sherried expressions. Highland whiskies command premium prices in the investment market.',
      characteristics: ['Diverse flavor profiles', 'Heather & honey notes', 'Medium to full-bodied', 'Often slightly peated'],
      image: '/whisky/hero/dalmore-principal-collection.webp',
      distilleries: ['Glenmorangie', 'The Dalmore', 'Oban', 'GlenDronach', 'Highland Park']
    },
    {
      id: 'islay',
      name: 'Islay',
      description: 'Known as "Whisky Island," Islay produces the most distinctive and powerful whiskies in Scotland. These intensely peated expressions are highly sought after by collectors and investors worldwide.',
      characteristics: ['Intensely peated', 'Maritime & medicinal', 'Seaweed & salt spray', 'Bold & powerful'],
      image: '/whisky/regions/islay.webp',
      distilleries: ['Ardbeg', 'Lagavulin', 'Laphroaig', 'Bowmore', 'Bruichladdich']
    },
    {
      id: 'campbeltown',
      name: 'Campbeltown',
      description: 'Once home to over 30 distilleries, this small region now has just three, making their whiskies increasingly rare and valuable for investment portfolios.',
      characteristics: ['Maritime influence', 'Slightly salty', 'Complex & oily', 'Fruit & smoke balance'],
      image: '/whisky/casks/dalmore-warehouse-casks.webp',
      distilleries: ['Springbank', 'Glen Scotia', 'Glengyle']
    },
    {
      id: 'lowland',
      name: 'Lowland',
      description: 'Known for producing lighter, more delicate whiskies, often triple-distilled. These accessible expressions offer steady appreciation potential for new whisky investors.',
      characteristics: ['Light & delicate', 'Grassy & fresh', 'Triple distilled', 'Aperitif style'],
      image: '/whisky/casks/dalmore-premium-casks.webp',
      distilleries: ['Auchentoshan', 'Glenkinchie', 'Bladnoch', 'Ailsa Bay']
    }
  ];

  const currentRegion = regions.find(r => r.id === selectedRegion) || regions[0];

  return (
    <section className="section-brown relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 175, 55, 0.1) 35px, rgba(212, 175, 55, 0.1) 70px)`
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
            Our <span className="text-gradient-gold">Whisky Selection</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore Scotland's five distinct whisky regions, each offering unique investment opportunities
          </p>
          <div className="divider-gold mt-8" />
        </motion.div>

        {/* Region Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {regions.map((region) => (
            <motion.button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-none font-medium tracking-wider uppercase transition-all duration-300 ${
                selectedRegion === region.id
                  ? 'bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold text-primary-black shadow-lg shadow-premium-gold/30'
                  : 'bg-transparent border border-premium-gold/30 text-text-secondary hover:border-premium-gold hover:text-premium-gold'
              }`}
            >
              {region.name}
            </motion.button>
          ))}
        </div>

        {/* Region Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRegion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative overflow-hidden rounded-lg shadow-2xl group"
            >
              <img
                src={imageErrors[currentRegion.id] ? '/whisky/distillery.webp' : currentRegion.image}
                alt={`${currentRegion.name} whisky`}
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => {
                  setImageErrors(prev => ({ ...prev, [currentRegion.id]: true }));
                  console.error(`Failed to load image for ${currentRegion.name}`);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif italic text-4xl text-text-primary mb-2">
                  {currentRegion.name}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-premium-gold to-transparent" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                {currentRegion.description}
              </p>

              {/* Characteristics */}
              <div className="mb-10">
                <h4 className="font-serif text-2xl text-text-primary mb-6">
                  Flavor Profile
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {currentRegion.characteristics.map((char, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="bg-primary-black/50 border border-premium-gold/20 px-6 py-3 text-premium-gold text-sm font-medium uppercase tracking-wider hover:border-premium-gold/40 transition-colors"
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Featured Distilleries */}
              <div>
                <h4 className="font-serif text-2xl text-text-primary mb-6">
                  Featured Distilleries
                </h4>
                <div className="space-y-3">
                  {currentRegion.distilleries.map((distillery, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-center group"
                    >
                      <div className="w-2 h-2 bg-premium-gold rounded-full mr-4 group-hover:shadow-lg group-hover:shadow-premium-gold/50 transition-shadow" />
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors">{distillery}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Investment Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 relative"
        >
          <div className="bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold p-px rounded-lg">
            <div className="bg-rich-brown rounded-lg p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-5xl font-serif font-bold text-gradient-gold mb-3">250+</h3>
                  <p className="text-text-secondary uppercase tracking-widest text-sm">Premium Casks Available</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-5xl font-serif font-bold text-gradient-gold mb-3">50+</h3>
                  <p className="text-text-secondary uppercase tracking-widest text-sm">Partner Distilleries</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-5xl font-serif font-bold text-gradient-gold mb-3">15%</h3>
                  <p className="text-text-secondary uppercase tracking-widest text-sm">Average Annual Return</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWhisky;