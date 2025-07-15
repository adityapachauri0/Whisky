import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const Testimonials: React.FC = () => {
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});
  
  const testimonials = [
    {
      id: 'james',
      name: 'James O\'Sullivan',
      role: 'Private Investor',
      location: 'Dublin, Ireland',
      rating: 5,
      content: 'The team at ViticultWhisky made my first cask investment seamless. Their expertise and transparent approach gave me confidence in this alternative asset class.',
      image: '/images/testimonials/james.jpg',
    },
    {
      id: 'sarah',
      name: 'Sarah Chen',
      role: 'Portfolio Manager',
      location: 'London, UK',
      rating: 5,
      content: 'As someone who manages diverse portfolios, I appreciate the tangible nature of whisky investment. The returns have exceeded my expectations, averaging 14% annually.',
      image: '/images/testimonials/sarah.jpg',
    },
    {
      id: 'michael',
      name: 'Michael Fitzgerald',
      role: 'Business Owner',
      location: 'Boston, USA',
      rating: 5,
      content: 'I\'ve been investing with ViticultWhisky for three years now. The quarterly reports and market insights they provide are invaluable. Highly recommend.',
      image: '/images/testimonials/michael.jpg',
    },
  ];

  return (
    <section className="section-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 70%)`
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
            What Our <span className="text-gradient-gold">Investors Say</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Join thousands of satisfied investors who have discovered the potential of whisky investment
          </p>
          <div className="divider-gold mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="card-luxury-border h-full p-8 relative">
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-antique-gold to-premium-gold rounded-full flex items-center justify-center shadow-lg shadow-premium-gold/30">
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-primary-black" />
                </div>

                <div className="flex items-center mb-6 mt-4">
                  <div className="relative">
                    <img
                      src={imageErrors[testimonial.id] ? '/logo192.png' : testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={() => {
                        setImageErrors(prev => ({ ...prev, [testimonial.id]: true }));
                        console.error(`Failed to load image for ${testimonial.name}`);
                      }}
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-premium-gold/30 group-hover:ring-premium-gold/50 transition-all" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-serif text-lg text-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-premium-gold">{testimonial.role}</p>
                    <p className="text-xs text-text-secondary">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-premium-gold" />
                  ))}
                </div>

                <blockquote className="text-text-secondary italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-12 p-8 bg-rich-brown/50 rounded-lg backdrop-blur-sm border border-premium-gold/20">
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">4.9/5</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Average Rating</div>
            </div>
            <div className="h-12 w-px bg-premium-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">1,000+</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Happy Investors</div>
            </div>
            <div className="h-12 w-px bg-premium-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">98%</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Would Recommend</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;