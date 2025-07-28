import React from 'react';
import { motion } from 'framer-motion';

interface FloatingPoundsProps {
  count?: number;
  color?: 'gold' | 'silver' | 'green';
  size?: 'small' | 'medium' | 'large';
  speed?: 'slow' | 'normal' | 'fast';
}

const FloatingPounds: React.FC<FloatingPoundsProps> = ({
  count = 8,
  color = 'gold',
  size = 'medium',
  speed = 'slow'
}) => {
  const colorClasses = {
    gold: 'from-yellow-300 via-amber-400 to-yellow-500',
    silver: 'from-gray-300 via-gray-400 to-gray-500',
    green: 'from-green-300 via-green-400 to-green-500'
  };

  const sizeRanges = {
    small: { min: 16, max: 24 },
    medium: { min: 20, max: 32 },
    large: { min: 28, max: 44 }
  };

  const speedMultipliers = {
    slow: 3.5,
    normal: 2.5,
    fast: 1.5
  };

  const sizeRange = sizeRanges[size];
  const speedMultiplier = speedMultipliers[speed];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(count)].map((_, i) => {
        const randomSize = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min);
        const randomDuration = (12 + Math.random() * 8) * speedMultiplier;
        const randomDelay = i * 2;
        const randomStartX = 10 + Math.random() * 80;
        const randomEndX = 10 + Math.random() * 80;
        const randomSwayAmount = 8 + Math.random() * 12;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${randomStartX}vw`,
              y: '110vh',
              scale: 0,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: [
                `${randomStartX}vw`,
                `${randomStartX + randomSwayAmount}vw`,
                `${randomStartX - randomSwayAmount}vw`,
                `${randomEndX}vw`
              ],
              y: ['110vh', '75vh', '35vh', '-15vh'],
              scale: [0, 1, 1, 0],
              opacity: [0, 0.6, 0.6, 0],
              rotate: [0, 120, -120, 240],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: [0.43, 0.13, 0.23, 0.96],
              times: [0, 0.2, 0.8, 1]
            }}
          >
            <div 
              className="relative flex items-center justify-center"
              style={{
                fontSize: `${randomSize}px`,
                fontWeight: 'bold',
                fontFamily: 'serif',
              }}
            >
              <span 
                className={`text-transparent bg-clip-text bg-gradient-to-br ${colorClasses[color]} drop-shadow-lg`}
                style={{
                  textShadow: `
                    0 0 10px rgba(251, 191, 36, 0.8),
                    0 0 20px rgba(251, 191, 36, 0.6),
                    0 0 30px rgba(251, 191, 36, 0.4)
                  `,
                  filter: `drop-shadow(0 0 15px rgba(251, 191, 36, 0.7))`,
                }}
              >
                £
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingPounds;