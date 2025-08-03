import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Terms of Service for ViticultWhisky. Read our terms and conditions for using our whisky investment platform." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/whisky/hero/terms-conditions-hero.webp" 
            alt="Whisky barrels in distillery"
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
              <h1 className="heading-1 text-white mb-4">Terms of Service</h1>
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
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the services provided by ViticultWhisky ("Company," "we," "us," or "our"), 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
              please do not use our services.
            </p>

            <h2>2. Eligibility</h2>
            <p>To use our services, you must:</p>
            <ul>
              <li>Be at least 18 years of age (or the legal drinking age in your jurisdiction)</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using our services under applicable laws</li>
              <li>Provide accurate and complete registration information</li>
            </ul>

            <h2>3. Investment Services</h2>
            <h3>3.1 Nature of Services</h3>
            <p>
              ViticultWhisky provides a platform for investing in whisky casks. Our services include:
            </p>
            <ul>
              <li>Sourcing and authentication of whisky casks</li>
              <li>Storage and insurance arrangements</li>
              <li>Market analysis and investment information</li>
              <li>Facilitating the purchase and sale of whisky casks</li>
            </ul>

            <h3>3.2 Investment Risks</h3>
            <p>
              <strong>Important:</strong> Investing in whisky casks involves significant risks, including:
            </p>
            <ul>
              <li>Market volatility and price fluctuations</li>
              <li>Liquidity risks</li>
              <li>Storage and insurance costs</li>
              <li>Regulatory changes</li>
              <li>No guarantee of returns</li>
            </ul>
            <p>
              Past performance is not indicative of future results. You should carefully consider your 
              investment objectives and risk tolerance before investing.
            </p>

            <h2>4. User Obligations</h2>
            <p>As a user of our services, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in fraudulent or illegal activities</li>
              <li>Not interfere with or disrupt our services</li>
              <li>Complete all required KYC/AML procedures</li>
            </ul>

            <h2>5. Fees and Payments</h2>
            <p>
              You agree to pay all fees associated with your use of our services, including:
            </p>
            <ul>
              <li>Purchase prices for whisky casks</li>
              <li>Storage and insurance fees</li>
              <li>Transaction fees</li>
              <li>Any applicable taxes</li>
            </ul>
            <p>
              All fees are non-refundable unless otherwise stated. Payment terms and methods will be 
              specified at the time of transaction.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, and software, is the property 
              of ViticultWhisky or its licensors and is protected by intellectual property laws. 
              You may not use, reproduce, or distribute any content without our written permission.
            </p>

            <h2>7. Disclaimers and Limitations of Liability</h2>
            <h3>7.1 No Investment Advice</h3>
            <p>
              The information provided on our platform is for informational purposes only and does not 
              constitute investment advice. You should consult with qualified financial advisors before 
              making investment decisions.
            </p>

            <h3>7.2 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, ViticultWhisky shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising from your use 
              of our services.
            </p>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ViticultWhisky, its officers, directors, 
              employees, and agents from any claims, damages, losses, or expenses arising from your 
              use of our services or violation of these Terms.
            </p>

            <h2>9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of 
              these Terms or for any other reason at our sole discretion. Upon termination, your right 
              to use our services will immediately cease.
            </p>

            <h2>10. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by the laws of Ireland. Any disputes arising from these 
              Terms or your use of our services shall be resolved through binding arbitration in 
              Dublin, Ireland.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any 
              material changes. Your continued use of our services after such modifications constitutes 
              acceptance of the updated Terms.
            </p>

            <h2>12. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will continue in full force and effect.
            </p>

            <h2>13. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and ViticultWhisky regarding 
              the use of our services and supersede all prior agreements and understandings.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <p>
              ViticultWhisky<br />
              3rd Floor<br />
              35 Artillery Lane<br />
              London<br />
              E1 7LP<br />
              Email: legal@whiskytradingco.com<br />
              Phone: <a href="tel:+442035953910" className="text-blue-600 hover:text-blue-800 underline">020 3595 3910</a>
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By using our services, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms of Service.
              </p>
              <div className="mt-6">
                <Link to="/privacy" className="text-gold hover:text-gold-dark mr-6">
                  Privacy Policy
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

export default Terms;