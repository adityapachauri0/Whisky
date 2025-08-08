import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: ChatBubbleBottomCenterTextIcon,
      number: '01',
      title: 'Free Consultation',
      description: 'Speak with our whisky investment experts to understand your goals and explore opportunities tailored to your budget.',
      image: '/whisky/shop-hero-image.webp',
    },
    {
      icon: MagnifyingGlassIcon,
      number: '02',
      title: 'Cask Selection',
      description: 'Choose from our curated portfolio of premium casks from renowned distilleries, backed by detailed provenance and projections.',
      image: '/whisky/tfandr-whisky-barrels.webp',
    },
    {
      icon: ShieldCheckIcon,
      number: '03',
      title: 'Secure Storage',
      description: 'Your casks are stored in government-bonded warehouses with 24/7 security, insurance, and optimal maturation conditions.',
      image: '/whisky/distillery.webp',
    },
    {
      icon: BanknotesIcon,
      number: '04',
      title: 'Exit Strategy',
      description: 'When ready, we help you maximize returns through our global network of collectors, investors, and premium buyers.',
      image: '/whisky/hero/hero-1.webp',
    },
  ];

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="heading-2 text-charcoal mb-4">
            Your Journey to Whisky Investment
          </h2>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
            Four simple steps to start building your premium whisky portfolio
          </p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-whisky-600/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
                  <img
                    src={step.image}
                    alt={step.title}
                    className="relative w-full h-[400px] object-cover rounded-2xl shadow-xl"
                  />
                  <div className="absolute top-8 left-8 bg-gold text-charcoal text-5xl font-bold px-6 py-3 rounded-lg shadow-lg">
                    {step.number}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex p-4 bg-whisky-100 rounded-xl">
                  <step.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="heading-3 text-charcoal">{step.title}</h3>
                <p className="text-lg text-charcoal/70 leading-relaxed">
                  {step.description}
                </p>
                {index === 0 && (
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-gold font-semibold hover:text-gold-dark transition-colors group"
                  >
                    Book Your Free Consultation
                    <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/how-it-works" className="btn-primary">
            Learn More About The Process
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;