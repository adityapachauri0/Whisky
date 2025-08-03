import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'contact'; // 'contact' or 'sell'
  const name = searchParams.get('name') || '';

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const getContent = () => {
    if (type === 'sell') {
      return {
        title: 'Cask Submission Received!',
        subtitle: 'Thank you for submitting your whisky cask details',
        message: `${name ? `Dear ${name}, t` : 'T'}hank you for submitting your whisky cask for valuation. Our expert team will review your submission and provide you with a comprehensive valuation within 48 hours.`,
        nextSteps: [
          'Our experts will analyze your cask details',
          'We\'ll research current market values',
          'You\'ll receive a detailed valuation report within 48 hours',
          'If you\'re happy with our offer, we\'ll handle the entire sale process'
        ],
        returnLink: '/sell-whisky',
        returnText: 'Submit Another Cask'
      };
    } else {
      return {
        title: 'Message Sent Successfully!',
        subtitle: 'Thank you for getting in touch with us',
        message: `${name ? `Dear ${name}, t` : 'T'}hank you for reaching out to Viticult Whisky. We've received your message and our team will get back to you within 24 hours to discuss your whisky investment opportunities.`,
        nextSteps: [
          'Our investment team will review your inquiry',
          'We\'ll prepare personalized investment recommendations',
          'You\'ll receive a detailed response within 24 hours',
          'We\'ll schedule a consultation call if needed'
        ],
        returnLink: '/contact',
        returnText: 'Send Another Message'
      };
    }
  };

  const content = getContent();

  return (
    <>
      <Helmet>
        <title>{content.title} | Viticult Whisky</title>
        <meta name="description" content="Thank you for your submission. We'll be in touch soon." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-amber-800/10" />
        <div className="absolute inset-0 opacity-10" />

        <div className="relative z-10 pt-32 pb-20 px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-premium-gold to-antique-gold rounded-full mb-6 shadow-2xl">
                <CheckCircleIcon className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                {content.title}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                {content.subtitle}
              </p>
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl">
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {content.message}
                </p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
                What Happens Next?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {content.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:bg-white/95 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-premium-gold to-antique-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 mb-12 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Need Immediate Assistance?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <PhoneIcon className="h-6 w-6 text-premium-gold mx-auto" />
                  <p className="text-gray-700 font-medium">Phone</p>
                  <a href="tel:+442035953910" className="text-premium-gold hover:text-antique-gold transition-colors font-medium">
                    020 3595 3910
                  </a>
                </div>
                <div className="space-y-2">
                  <EnvelopeIcon className="h-6 w-6 text-premium-gold mx-auto" />
                  <p className="text-gray-700 font-medium">Email</p>
                  <a href="mailto:admin@viticult.co.uk" className="text-premium-gold hover:text-antique-gold transition-colors font-medium">
                    admin@viticult.co.uk
                  </a>
                </div>
                <div className="space-y-2">
                  <ClockIcon className="h-6 w-6 text-premium-gold mx-auto" />
                  <p className="text-gray-700 font-medium">Hours</p>
                  <p className="text-gray-600">Mon-Fri 10AM-6PM GMT</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/"
                className="inline-flex items-center px-8 py-4 bg-premium-gold hover:bg-antique-gold text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Return to Home
              </Link>
              <Link
                to={content.returnLink}
                className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm border border-premium-gold text-premium-gold font-semibold rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                {content.returnText}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;