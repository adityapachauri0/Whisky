import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, GlobeAltIcon, BeakerIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '../common/OptimizedImage';

interface Distillery {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  features: string[];
  carbonNeutralSince: string;
}

const DistilleryPartners: React.FC = () => {
  const distilleries: Distillery[] = [
    {
      id: 'the-dalmore',
      name: 'The Dalmore Distillery',
      location: 'Northern Highlands',
      description: 'Carbon-neutral since 2019, The Dalmore creates exceptional single malts matured in exclusive sherry casks from González Byass.',
      image: '/whisky/distilleries/dalmore-distillery-building.webp',
      features: ['100% Renewable Energy', 'Exclusive Sherry Casks', 'Royal Warrant Holder'],
      carbonNeutralSince: '2019'
    },
    {
      id: 'the-macallan',
      name: 'The Macallan Estate',
      location: 'Speyside',
      description: 'Setting the standard for sustainable luxury whisky production with their state-of-the-art eco-distillery.',
      image: '/whisky/distilleries/dalmore-production.webp',
      features: ['Zero Waste Facility', 'Solar Powered', 'Estate Grown Barley'],
      carbonNeutralSince: '2020'
    },
    {
      id: 'lagavulin',
      name: 'Lagavulin Distillery',
      location: 'Islay',
      description: 'Harnessing renewable energy to craft intensely peated single malts that command premium prices globally.',
      image: '/whisky/distilleries/dalmore-whisky-glass.webp',
      features: ['Wind Powered', 'Traditional Floor Maltings', '200+ Years Heritage'],
      carbonNeutralSince: '2021'
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-primary-black via-rich-brown to-primary-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-text-primary mb-6">
            Our <span className="text-eco-green">Carbon-Neutral</span> Partner Distilleries
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            We exclusively partner with distilleries committed to sustainable production, 
            ensuring your investment supports both financial growth and environmental responsibility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {distilleries.map((distillery, index) => (
            <motion.div
              key={distillery.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg bg-medium-brown hover:bg-warm-brown transition-all duration-500"
            >
              <div className="aspect-w-16 aspect-h-12 overflow-hidden relative">
                <OptimizedImage
                  src={distillery.image}
                  alt={distillery.name}
                  className="w-full h-64 object-cover"
                  effect="opacity"
                  enableZoom={true}
                  zoomType="rotate"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-black/90 via-primary-black/50 to-transparent pointer-events-none" />
              </div>

              <div className="absolute top-4 right-4 bg-eco-green/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-white uppercase tracking-wide">
                  Carbon Neutral Since {distillery.carbonNeutralSince}
                </span>
              </div>

              <div className="relative p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif text-text-primary mb-2">
                      {distillery.name}
                    </h3>
                    <div className="flex items-center text-text-secondary">
                      <GlobeAltIcon className="w-4 h-4 mr-2 text-eco-green" />
                      <span className="text-sm">{distillery.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-text-secondary mb-6 line-clamp-3">
                  {distillery.description}
                </p>

                <div className="space-y-2 mb-6">
                  {distillery.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <BeakerIcon className="w-4 h-4 mr-2 text-eco-green flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to={`/distilleries/${distillery.id}`}
                  className="inline-flex items-center text-premium-gold hover:text-bright-gold transition-colors duration-300"
                >
                  <span className="text-sm font-semibold uppercase tracking-wide">Learn More</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-forest-green/20 to-eco-green/20 rounded-lg border border-eco-green/30">
            <BuildingOfficeIcon className="w-8 h-8 text-eco-green mr-4" />
            <div className="text-left">
              <h4 className="text-lg font-semibold text-text-primary mb-1">
                Committed to Sustainability
              </h4>
              <p className="text-sm text-text-secondary">
                All partner distilleries meet strict environmental standards and carbon-neutral certifications
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DistilleryPartners;