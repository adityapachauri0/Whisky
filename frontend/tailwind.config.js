/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark & Moody Palette
        'primary-black': '#0a0604',
        'rich-brown': '#1a0f08',
        'medium-brown': '#2c1810',
        'warm-brown': '#3e2418',
        
        // Luxury Gold Accents
        'premium-gold': '#d4af37',
        'bright-gold': '#f4cf47',
        'antique-gold': '#b89730',
        'champagne': '#f7e7ce',
        
        // Natural Green Palette (Irish-inspired)
        'irish-green': '#1e5e3e',
        'forest-green': '#2d5540',
        'sage-green': '#4a7c68',
        'mint-green': '#7fb69e',
        'pale-green': '#e8f3ed',
        
        // Sustainability & Trust Colors
        'eco-green': '#3cb371',
        'earth-brown': '#8b6f47',
        'stone-gray': '#6c757d',
        'carbon-neutral': '#2e8b57',
        
        // Text Colors
        'text-primary': '#ffffff',
        'text-secondary': '#e6d5c4',
        'text-accent': '#d4af37',
        'text-green': '#3cb371',
        
        // Legacy colors (keeping for compatibility)
        'whisky': {
          50: '#faf8f5',
          100: '#f5f1e8',
          200: '#e6d5c4',
          300: '#d4c19a',
          400: '#c2a570',
          500: '#b08d4f',
          600: '#9a7642',
          700: '#805f37',
          800: '#694d31',
          900: '#57402a',
          950: '#2f2116',
        },
        'gold': {
          DEFAULT: '#d4af37',
          light: '#f4cf47',
          dark: '#b89730',
        },
        'charcoal': {
          DEFAULT: '#1a0f08',
          light: '#2c1810',
          lighter: '#3e2418',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'fade-down': 'fadeDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-whisky': 'linear-gradient(135deg, #1a0f08 0%, #2c1810 50%, #3e2418 100%)',
        'gradient-gold': 'linear-gradient(135deg, #b89730 0%, #d4af37 50%, #f4cf47 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0604 0%, #1a0f08 100%)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      height: {
        'screen-90': '90vh',
        'screen-80': '80vh',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
      }
    },
  },
  plugins: [],
}