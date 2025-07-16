import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const team = [
    {
      name: 'Patrick O\'Brien',
      role: 'CEO & Founder',
      bio: '20+ years in alternative investments and premium spirits',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    },
    {
      name: 'Sarah Mitchell',
      role: 'Head of Investments',
      bio: 'Former portfolio manager with expertise in tangible assets',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    },
    {
      name: 'James McCullough',
      role: 'Master Distiller Advisor',
      bio: '30+ years crafting and evaluating premium whiskys',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    },
    {
      name: 'Emma Chen',
      role: 'Client Relations Director',
      bio: 'Dedicated to providing exceptional investor experiences',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Learn about ViticultWhisky's mission, team, and heritage in premium whisky investment." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/casks/dalmore-warehouse-casks.jpg"
            alt="Dalmore whisky warehouse with premium oak casks"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/70 to-gray-900" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                About ViticultWhisky
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-light">
                A Legacy of Excellence in Whisky Investment
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Viticult Inspired */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                The Art of Whisky Investment
              </h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-8" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-serif text-gray-900 mb-6">Our Heritage</h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Founded by whisky enthusiasts and investment professionals, ViticultWhisky bridges
                  the gap between traditional craftsmanship and modern investment strategies. We've spent
                  decades building relationships with Scotland's most prestigious distilleries.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our team combines deep industry knowledge with financial expertise, ensuring every cask
                  we offer represents both exceptional quality and strong investment potential. We're not
                  just brokers – we're custodians of liquid history.
                </p>
                <Link 
                  to="/buy-sell" 
                  className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors group"
                >
                  Explore Our Casks
                  <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="/images/casks/dalmore-premium-casks.jpg"
                  alt="Premium Dalmore whisky casks aging in warehouse"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-8 -left-8 bg-amber-600 text-white p-6 rounded-lg shadow-xl max-w-xs">
                  <p className="text-2xl font-bold mb-2">£2.3B+</p>
                  <p className="text-sm">Total cask value under management</p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <img
                  src="/images/distilleries/dalmore-whisky-glass.jpg"
                  alt="Premium Dalmore whisky in crystal glass"
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <h3 className="text-3xl font-serif text-gray-900 mb-6">Why Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Unrivalled Expertise</h4>
                      <p className="text-gray-700">Over 100 years of combined experience in whisky and investments</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Exclusive Access</h4>
                      <p className="text-gray-700">Direct relationships with prestigious distilleries across Scotland</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Full Transparency</h4>
                      <p className="text-gray-700">Complete ownership documentation and regular valuation updates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Global Network</h4>
                      <p className="text-gray-700">Connected to collectors and investors across 40+ countries</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img
            src="/images/hero/dalmore-distillery-overhead.jpg"
            alt="The Dalmore distillery aerial view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">
                Our Investment Philosophy
              </h2>
              <p className="text-xl md:text-2xl font-light mb-12 leading-relaxed">
                "Great whisky, like great investments, requires patience, expertise, and an
                unwavering commitment to quality. We believe in the intrinsic value of aged spirits
                – not just as a beverage, but as a tangible asset that appreciates with time."
              </p>
              <p className="text-lg text-amber-400 font-semibold">
                – Patrick O'Brien, CEO & Founder
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 text-charcoal mb-4">Meet Our Team</h2>
            <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
              Industry experts dedicated to your investment success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
                />
                <h3 className="font-semibold text-charcoal text-lg">{member.name}</h3>
                <p className="text-gold text-sm mb-2">{member.role}</p>
                <p className="text-charcoal/60 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-charcoal to-charcoal-light">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="heading-2 text-white mb-6">
              Ready to Join Our Investment Community?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Let's discuss how whisky investment can enhance your portfolio
            </p>
            <Link to="/contact" className="btn-primary">
              Book Your Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;