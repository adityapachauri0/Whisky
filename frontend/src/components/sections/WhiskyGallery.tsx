import React from 'react';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const WhiskyGallery: React.FC = () => {
  const images: GalleryImage[] = [
    {
      id: 'warehouse',
      src: '/images/tfandr-whisky-barrels.webp',
      alt: 'Whisky warehouse',
      title: 'Secure Warehouse Storage',
      description: 'Government-bonded facilities with 24/7 security'
    },
    {
      id: 'barrels',
      src: '/distillery.jpg',
      alt: 'Oak barrels',
      title: 'Premium Oak Casks',
      description: 'Carefully selected casks for optimal maturation'
    },
    {
      id: 'distillery',
      src: '/images/regions/speyside.jpg',
      alt: 'Distillery',
      title: 'Partner Distilleries',
      description: 'Working with Scotland\'s finest producers'
    },
    {
      id: 'tasting',
      src: '/whisky-glass.jpg',
      alt: 'Whisky tasting',
      title: 'Expert Selection',
      description: 'Curated by industry professionals'
    },
    {
      id: 'collection',
      src: '/images/shop-daftmill-2011.webp',
      alt: 'Rare whisky',
      title: 'Rare Collections',
      description: 'Access to exclusive and limited releases'
    },
    {
      id: 'investment',
      src: '/images/shop-hero-image.webp',
      alt: 'Investment portfolio',
      title: 'Portfolio Growth',
      description: 'Track your investment performance'
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-primary-black to-rich-brown">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-text-primary mb-6">
            Experience the World of <span className="text-gradient-gold">Premium Whisky</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            From sustainable distilleries to secure warehouses, explore every aspect of your whisky investment journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg bg-medium-brown"
            >
              <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-black/90 via-primary-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-serif text-text-primary mb-2">
                  {image.title}
                </h3>
                <p className="text-sm text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {image.description}
                </p>
              </div>

              {/* Green sustainability badge for warehouse images */}
              {(image.id === 'warehouse' || image.id === 'distillery') && (
                <div className="absolute top-4 right-4 bg-eco-green/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">
                    Carbon Neutral
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhiskyGallery;