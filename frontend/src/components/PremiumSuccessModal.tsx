import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PremiumSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  type?: 'contact' | 'sell';
}

const whiskyQuotes = [
  {
    quote: "Too much of anything is bad, but too much good whisky is barely enough.",
    author: "Mark Twain"
  },
  {
    quote: "Whisky is liquid sunshine.",
    author: "George Bernard Shaw"
  },
  {
    quote: "The water was not fit to drink. To make it palatable, we had to add whisky. By diligent effort, I learned to like it.",
    author: "Winston Churchill"
  },
  {
    quote: "Whisky, like a beautiful woman, demands appreciation.",
    author: "W.C. Fields"
  },
  {
    quote: "There is no bad whisky. There are only some whiskys that aren't as good as others.",
    author: "Raymond Chandler"
  }
];

const investmentFacts = [
  "Rare whisky has outperformed gold, oil, and the S&P 500 over the last decade",
  "The Knight Frank Luxury Investment Index shows whisky up 586% over 10 years",
  "Japanese whisky values have increased by over 300% in the past 5 years",
  "A bottle of Macallan 1926 sold for £1.9 million at auction in 2019",
  "The global whisky market is expected to reach £90 billion by 2025",
  "Limited edition releases appreciate an average of 20% annually"
];

export default function PremiumSuccessModal({ isOpen, onClose, userName, type = 'contact' }: PremiumSuccessModalProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Rotate quotes every 5 seconds
      const quoteInterval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % whiskyQuotes.length);
      }, 5000);

      // Rotate facts every 4 seconds
      const factInterval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % investmentFacts.length);
      }, 4000);

      return () => {
        clearInterval(quoteInterval);
        clearInterval(factInterval);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Flex container for proper centering */}
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-y-auto bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Simple Animated Gold Dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute bottom-10 left-10"
                animate={{
                  y: [-400, -500],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full shadow-lg" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-10 left-1/4"
                animate={{
                  y: [-400, -500],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                  delay: 0.5,
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full shadow-lg" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-10 right-1/4"
                animate={{
                  y: [-400, -500],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                  delay: 1,
                }}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-10 right-10"
                animate={{
                  y: [-400, -500],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  delay: 1.5,
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg" />
              </motion.div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10 touch-manipulation"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" />
            </button>

            {/* Content */}
            <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center mb-4 sm:mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-600 rounded-full blur-xl opacity-30 animate-pulse" />
                  <CheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-amber-600 relative" />
                </div>
              </motion.div>

              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6 sm:mb-8"
              >
                {type === 'sell' ? (
                  <>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
                      Submission Received - Thank You!
                    </h2>
                    <div className="text-left bg-white/70 rounded-xl p-4 sm:p-6 mb-4">
                      <p className="text-sm sm:text-base lg:text-lg text-amber-800 mb-3">
                        Your whisky details have been successfully submitted to Viticult Whisky.
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-amber-800 mb-4">
                        Our experts will review your bottles and contact you within 2-3 business days with a valuation and next steps.
                      </p>
                      <div className="border-t border-amber-200 pt-3">
                        <p className="text-sm font-semibold text-amber-900 mb-2">Need to reach us?</p>
                        <p className="text-sm text-amber-800 mb-1">📞 02035953910 | ✉️ admin@viticultwhisky.co.uk</p>
                      </div>
                      <p className="text-sm sm:text-base text-amber-800 font-medium mt-3">
                        We look forward to helping you get the best price for your whisky!
                      </p>
                      <p className="text-sm text-amber-700 font-semibold mt-2">
                        The Viticult Whisky Team
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-2">
                      Welcome to Excellence{userName ? `, ${userName}` : ''}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-amber-800">
                      Your personal portfolio manager will contact you within 24 hours
                    </p>
                  </>
                )}
              </motion.div>

              {/* Investment Fact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm"
              >
                <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Did You Know?
                </h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFactIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-amber-900 font-medium"
                  >
                    {investmentFacts[currentFactIndex]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Whisky Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6 sm:mb-8"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-800 italic mb-2">
                      "{whiskyQuotes[currentQuoteIndex].quote}"
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-amber-700 font-semibold">
                      — {whiskyQuotes[currentQuoteIndex].author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Next Steps - Only show for contact form */}
              {type === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-4 sm:p-6 text-white"
                >
                  <h3 className="font-bold text-base sm:text-lg mb-3">What Happens Next:</h3>
                  <ul className="space-y-2 text-sm sm:text-base">
                    <li className="flex items-start">
                      <span className="text-amber-300 mr-2">✓</span>
                      <span>Portfolio analysis by our whisky investment experts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-300 mr-2">✓</span>
                      <span>Personalized investment strategy tailored to your goals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-300 mr-2">✓</span>
                      <span>Exclusive access to rare whisky acquisition opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-300 mr-2">✓</span>
                      <span>Complimentary portfolio valuation report</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-6 sm:mt-8"
              >
                <button
                  onClick={onClose}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-amber-900 text-white font-semibold rounded-full hover:bg-amber-800 transition-colors shadow-lg text-sm sm:text-base touch-manipulation"
                >
                  Continue to Dashboard
                </button>
              </motion.div>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}