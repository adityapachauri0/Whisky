import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';
import { 
  LinkedInIcon, 
  TwitterIcon, 
  InstagramIcon, 
  YouTubeIcon, 
  FacebookIcon 
} from '../common/SocialIcons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Buy & Sell', path: '/buy-sell' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Contact', path: '/contact' },
    ],
    resources: [
      { name: 'Blog', path: '/blog' },
      { name: 'Investment Guide', path: '/blog/complete-guide-whisky-cask-investment' },
      { name: 'Market Insights', path: '/blog/rare-whisky-index-investment-metrics' },
      { name: 'Whisky Regions', path: '/#our-whisky' },
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    social: [
      { 
        name: 'LinkedIn', 
        url: 'https://linkedin.com/company/viticultwhisky', 
        icon: LinkedInIcon,
        color: 'hover:bg-[#0077B5]' 
      },
      { 
        name: 'Twitter', 
        url: 'https://twitter.com/viticultwhisky', 
        icon: TwitterIcon,
        color: 'hover:bg-[#000000]' 
      },
      { 
        name: 'Instagram', 
        url: 'https://instagram.com/viticultwhisky', 
        icon: InstagramIcon,
        color: 'hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045]' 
      },
      { 
        name: 'Facebook', 
        url: 'https://facebook.com/viticultwhisky', 
        icon: FacebookIcon,
        color: 'hover:bg-[#1877F2]' 
      },
      { 
        name: 'YouTube', 
        url: 'https://youtube.com/@viticultwhisky', 
        icon: YouTubeIcon,
        color: 'hover:bg-[#FF0000]' 
      },
    ],
  };

  return (
    <footer className="bg-primary-black border-t border-premium-gold/10">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-serif font-bold text-premium-gold">
              VITICULT
              <span className="block text-sm font-sans font-light tracking-[0.3em] text-text-secondary uppercase">
                Whisky
              </span>
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Your trusted partner in premium whisky cask investment. Connecting collectors with Scotland's finest distilleries since 2015.
            </p>
            <div className="flex space-x-4 pt-2">
              {footerLinks.social.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full border border-premium-gold/30 flex items-center justify-center
                               hover:border-transparent transition-all duration-300 group transform hover:scale-110
                               ${social.color} hover:shadow-lg hover:shadow-premium-gold/20`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <IconComponent className="w-5 h-5 text-premium-gold group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-serif text-text-primary mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-premium-gold transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-serif text-text-primary mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-premium-gold transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-serif text-text-primary mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <a
                href="mailto:admin@viticult.co.uk"
                className="flex items-center space-x-3 text-text-secondary hover:text-premium-gold transition-colors group"
              >
                <EnvelopeIcon className="h-5 w-5 text-premium-gold/60 group-hover:text-premium-gold" />
                <span className="text-sm">admin@viticult.co.uk</span>
              </a>
              <a
                href="tel:+442035953910"
                className="flex items-center space-x-3 text-text-secondary hover:text-premium-gold transition-colors group"
              >
                <PhoneIcon className="h-5 w-5 text-premium-gold/60 group-hover:text-premium-gold" />
                <span className="text-sm">020 3595 3910</span>
              </a>
              <div className="flex items-start space-x-3 text-text-secondary">
                <MapPinIcon className="h-5 w-5 text-premium-gold/60 mt-0.5" />
                <span className="text-sm">
                  3rd Floor<br />
                  35 Artillery Lane<br />
                  London<br />
                  E1 7LP
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sponsorship Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-900/90 to-blue-800/90 rounded-lg p-6 text-center"
        >
          <p className="text-white text-sm uppercase tracking-wider mb-2">Proud Sponsors of</p>
          <a 
            href="https://www.afcwimbledon.co.uk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <span className="text-2xl font-bold">AFC WIMBLEDON</span>
          </a>
          <p className="text-blue-100 text-xs mt-2">Supporting grassroots football and community development</p>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-premium-gold/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">
              © {currentYear} ViticultWhisky. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link
                to="/privacy"
                className="text-text-secondary hover:text-premium-gold transition-colors text-sm uppercase tracking-wider"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-text-secondary hover:text-premium-gold transition-colors text-sm uppercase tracking-wider"
              >
                Terms
              </Link>
              <Link
                to="/terms"
                className="text-text-secondary hover:text-premium-gold transition-colors text-sm uppercase tracking-wider"
              >
                Disclaimer
              </Link>
            </div>
          </div>
          
          {/* Gold Divider */}
          <div className="divider-gold my-8" />
          
          {/* Risk Warning */}
          <div className="bg-rich-brown/30 border border-premium-gold/10 rounded-lg p-6 mt-8">
            <p className="text-text-secondary text-xs leading-relaxed text-center">
              <strong className="text-premium-gold uppercase tracking-wider">Investment Risk Warning:</strong> The value of investments and any income from them can fall as well as rise. 
              You may not get back the amount you originally invested. Past performance is not a reliable indicator of future results. 
              Whisky cask investment is unregulated and may not be suitable for all investors. Please seek independent financial advice.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;