import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleBottomCenterTextIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { trustpilotReviews } from '../../data/trustpilotReviews';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonialsPerPage, setTestimonialsPerPage] = useState(3);
  
  // Responsive testimonials per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTestimonialsPerPage(1);
      } else {
        setTestimonialsPerPage(3);
      }
      setCurrentIndex(0); // Reset to first page on resize
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const totalPages = Math.ceil(trustpilotReviews.length / testimonialsPerPage);

  // Auto-play functionality with faster, continuous flow
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 3000); // Change slide every 3 seconds for faster flow
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, totalPages]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 6 seconds
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  // Get the testimonials for the current page
  const getCurrentTestimonials = () => {
    const start = currentIndex * testimonialsPerPage;
    return trustpilotReviews.slice(start, start + testimonialsPerPage);
  };

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

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => {
              handlePrev();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 6000);
            }}
            className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-rich-brown/50 hover:bg-rich-brown/70 text-white p-2 md:p-3 rounded-full transition-all duration-300"
            aria-label="Previous testimonials"
          >
            <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={() => {
              handleNext();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 6000);
            }}
            className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-rich-brown/50 hover:bg-rich-brown/70 text-white p-2 md:p-3 rounded-full transition-all duration-300"
            aria-label="Next testimonials"
          >
            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Testimonials Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {getCurrentTestimonials().map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="relative group"
                >
              <div className="bg-rich-brown/30 backdrop-blur-sm rounded-lg overflow-hidden h-full border border-transparent hover:border-premium-gold/30 transition-all duration-300">
                {/* Trustpilot Header */}
                <div className="bg-gradient-to-r from-[#00b67a] to-[#00a86b] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">Trustpilot</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-white' : 'text-white/30'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-text-primary text-base">{testimonial.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-secondary">{testimonial.location}</span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-[#00b67a] flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified Review
                      </span>
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {testimonial.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>{testimonial.date}</span>
                    <span className="text-[#00b67a]">Reviewed on Trustpilot</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-premium-gold w-8'
                  : 'bg-premium-gold/30 hover:bg-premium-gold/50'
              }`}
              aria-label={`Go to testimonials page ${index + 1}`}
            />
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
              <div className="text-3xl font-serif font-bold text-gradient-gold">4.5/5</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Trustpilot Rating</div>
            </div>
            <div className="h-12 w-px bg-premium-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">30</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Verified Reviews</div>
            </div>
            <div className="h-12 w-px bg-premium-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">94%</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">4-5 Star Reviews</div>
            </div>
          </div>
          
          {/* Trustpilot Link */}
          <div className="mt-8">
            <a 
              href="https://www.trustpilot.com/review/viticultwhisky.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-premium-gold hover:text-bright-gold transition-colors"
            >
              <span className="text-sm">View all reviews on Trustpilot</span>
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;