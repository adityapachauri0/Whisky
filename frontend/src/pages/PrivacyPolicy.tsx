import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Privacy Policy for ViticultWhisky. Learn how we collect, use, and protect your personal information." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/whisky/hero/privacy-policy-hero.webp" 
            alt="Whisky casks in storage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="heading-1 text-white mb-4">Privacy Policy</h1>
              <p className="text-lg text-white/80">Last updated: {new Date().toLocaleDateString()}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto prose prose-lg"
          >
            <h2>1. Introduction</h2>
            <p>
              ViticultWhisky ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect personal information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>Account credentials (username and password)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Investment preferences and financial information</li>
              <li>Government-issued identification (for KYC/AML compliance)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information:</p>
            <ul>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website addresses</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes:</p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To process your investments and transactions</li>
              <li>To communicate with you about your account and investments</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To detect and prevent fraud</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li>With service providers who assist in our operations</li>
              <li>With regulatory authorities as required by law</li>
              <li>With your consent or at your direction</li>
              <li>In connection with a merger, sale, or acquisition</li>
              <li>To protect our rights and the safety of others</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. These 
              measures include encryption, secure servers, and regular security assessments.
            </p>

            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your information</li>
              <li>Objection to certain processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>

            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              You can control cookie preferences through your browser settings.
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country 
              of residence. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly 
              collect personal information from children.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please 
              contact us at:
            </p>
            <p>
              ViticultWhisky<br />
              3rd Floor<br />
              35 Artillery Lane<br />
              London<br />
              E1 7LP<br />
              Email: privacy@whiskytradingco.com<br />
              Phone: <a href="tel:+442035953910" className="text-blue-600 hover:text-blue-800 underline">020 3595 3910</a>
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By using our services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <div className="mt-6">
                <Link to="/terms" className="text-gold hover:text-gold-dark mr-6">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-gold hover:text-gold-dark">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;