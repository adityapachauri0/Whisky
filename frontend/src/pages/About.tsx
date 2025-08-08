import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/common/Breadcrumbs';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About ViticultWhisky | Premium Scottish Whisky Investment Experts | Our Story</title>
        <meta 
          name="description" 
          content="Discover ViticultWhisky's heritage in premium Scottish whisky cask investment. Expert team with decades of experience in whisky markets and alternative investments." 
        />
        <meta name="keywords" content="whisky investment experts, ViticultWhisky about, Scottish whisky team, cask investment specialists, whisky market experts" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://viticultwhisky.co.uk/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About ViticultWhisky | Premium Scottish Whisky Investment Experts" />
        <meta property="og:description" content="Meet the expert team behind ViticultWhisky's premium Scottish whisky cask investment platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viticultwhisky.co.uk/about" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/hero/contact-hero.webp" />
        <meta property="og:site_name" content="ViticultWhisky" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About ViticultWhisky | Premium Scottish Whisky Investment Experts" />
        <meta name="twitter:description" content="Meet the expert team behind ViticultWhisky's premium Scottish whisky cask investment platform." />
        <meta name="twitter:image" content="https://viticultwhisky.co.uk/whisky/hero/contact-hero.webp" />
        <meta name="twitter:site" content="@viticultwhisky" />
        
        {/* Additional SEO */}
        <meta name="author" content="ViticultWhisky" />
        <meta name="geo.region" content="GB-SCT" />
        <meta name="geo.placename" content="Scotland" />
        <meta name="ICBM" content="55.9533,-3.1883" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0 hero-zoom">
          <video
            src="/videos/hero-video-new.mp4"
            autoPlay
            loop
            muted
            playsInline
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

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs />
        </div>
      </div>

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
                  src="/whisky/casks/dalmore-premium-casks.webp"
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
                  src="/whisky/distilleries/glenfiddich-estate.webp"
                  alt="Glenfiddich distillery estate"
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
            src="/whisky/hero/dalmore-distillery-overhead.webp"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* AFC Wimbledon Sponsorship Section */}
      <section className="section bg-gray-50">
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
                Supporting Our Community
              </h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-8" />
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                We believe in giving back to the community that has supported our growth
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-900 text-yellow-400 px-6 py-3 rounded-lg">
                      <h3 className="text-2xl font-bold">AFC WIMBLEDON</h3>
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif text-gray-900 mb-4">Proud Sponsors of AFC Wimbledon</h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    ViticultWhisky is honored to be an official sponsor of AFC Wimbledon Football Club. 
                    This partnership represents our commitment to supporting local communities and investing 
                    in grassroots football.
                  </p>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    AFC Wimbledon's remarkable story of resilience, community spirit, and determination 
                    mirrors our own values of patience, authenticity, and long-term growth. Just as fine 
                    whisky matures over time, we believe in nurturing relationships that stand the test of time.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="https://www.afcwimbledon.co.uk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors group"
                    >
                      Visit AFC Wimbledon
                      <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-blue-900 text-white rounded-lg p-6 shadow-xl">
                  <h4 className="text-xl font-semibold mb-3">Community Partnership</h4>
                  <p className="text-blue-100">
                    Our sponsorship helps fund youth development programs, community outreach initiatives, 
                    and supports the club's mission to be at the heart of the local community.
                  </p>
                </div>
                <div className="bg-amber-600 text-white rounded-lg p-6 shadow-xl">
                  <h4 className="text-xl font-semibold mb-3">Shared Values</h4>
                  <p className="text-amber-100">
                    Both ViticultWhisky and AFC Wimbledon believe in authenticity, tradition, and building 
                    something meaningful that lasts for generations.
                  </p>
                </div>
                <div className="bg-gray-800 text-white rounded-lg p-6 shadow-xl">
                  <h4 className="text-xl font-semibold mb-3">Long-term Commitment</h4>
                  <p className="text-gray-300">
                    Just as whisky investment requires patience and dedication, we're committed to supporting 
                    AFC Wimbledon's journey for years to come.
                  </p>
                </div>
              </motion.div>
            </div>
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