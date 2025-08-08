import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, CogIcon, ChartBarIcon, UserIcon } from '@heroicons/react/24/outline';

const CookiePolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - ViticultWhisky | GDPR Compliant Cookie Usage</title>
        <meta 
          name="description" 
          content="Comprehensive Cookie Policy for ViticultWhisky. Learn about our GDPR-compliant cookie usage, real-time form capture, and visitor tracking." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://viticultwhisky.co.uk/cookie-policy" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/whisky/hero/contact-hero.webp" 
            alt="Whisky bottles and documents"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="heading-1 text-white mb-4">Cookie Policy</h1>
              <p className="text-lg text-white/80 mb-4">
                Transparent information about our cookie usage and data processing
              </p>
              <p className="text-sm text-white/60">
                Last updated: {new Date().toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">GDPR Compliance Statement</h3>
                  <p className="text-blue-800 mb-0">
                    This Cookie Policy complies with the General Data Protection Regulation (GDPR), 
                    UK GDPR, and the Privacy and Electronic Communications Regulations (PECR). 
                    We obtain explicit consent before using non-essential cookies.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              ViticultWhisky uses cookies to enhance your browsing experience, provide personalized content, 
              and analyze website performance. We categorize our cookies as follows:
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CogIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">Essential Cookies</h3>
                </div>
                <p className="text-green-800 text-sm mb-4">
                  Required for basic website functionality. Cannot be disabled.
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Session management</li>
                  <li>• Security and authentication</li>
                  <li>• Load balancing</li>
                  <li>• Basic form functionality</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-yellow-900">Analytics Cookies</h3>
                </div>
                <p className="text-yellow-800 text-sm mb-4">
                  Help us understand visitor behavior. Requires consent.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Google Analytics 4</li>
                  <li>• Page view tracking</li>
                  <li>• Bounce rate analysis</li>
                  <li>• User journey mapping</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-900">Functional Cookies</h3>
                </div>
                <p className="text-blue-800 text-sm mb-4">
                  Remember your preferences and settings. Requires consent.
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Language preferences</li>
                  <li>• Cookie consent choices</li>
                  <li>• Form auto-save preferences</li>
                  <li>• Theme settings</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-purple-900">Form Progress Cookies</h3>
                </div>
                <p className="text-purple-800 text-sm mb-4">
                  Save form data to prevent loss. Only with explicit consent.
                </p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Auto-save consent tracking</li>
                  <li>• Visitor identification</li>
                  <li>• Form field progress</li>
                  <li>• Session continuity</li>
                </ul>
              </div>
            </div>

            <h2>3. Real-Time Form Data Capture</h2>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Auto-Save Progress Feature</h3>
              <p className="text-orange-800 mb-4">
                Our contact forms offer an optional "Auto-Save Progress" feature that captures form data 
                as you type to prevent data loss.
              </p>
              
              <h4 className="font-semibold text-orange-900 mb-2">How It Works:</h4>
              <ol className="list-decimal list-inside text-orange-800 space-y-2 mb-4">
                <li>A modal popup appears asking for your consent</li>
                <li>If you consent, we capture form data with 1-second debouncing</li>
                <li>Data is encrypted and stored temporarily in our secure database</li>
                <li>Data is automatically deleted after 30 days</li>
              </ol>

              <h4 className="font-semibold text-orange-900 mb-2">Data Captured (Only with Consent):</h4>
              <ul className="list-disc list-inside text-orange-800 space-y-1">
                <li>First name and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Form selections and preferences</li>
                <li>Visitor ID (anonymous until you provide personal data)</li>
                <li>Timestamps of data capture</li>
              </ul>
            </div>

            <h2>4. Visitor Tracking and Fingerprinting</h2>
            <p>
              We use anonymous browser fingerprinting to create unique visitor identifiers. This helps us:
            </p>
            <ul>
              <li>Prevent fraudulent form submissions</li>
              <li>Provide personalized user experiences</li>
              <li>Track visitor engagement without storing personal data</li>
              <li>Maintain session continuity across page visits</li>
            </ul>
            <p>
              <strong>Important:</strong> Browser fingerprinting is anonymous unless you explicitly provide 
              personal information through our forms.
            </p>

            <h2>5. Legal Basis for Processing</h2>
            <table className="w-full border-collapse border border-gray-300 my-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">Cookie Type</th>
                  <th className="border border-gray-300 p-3 text-left">Legal Basis (GDPR)</th>
                  <th className="border border-gray-300 p-3 text-left">Retention Period</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Essential Cookies</td>
                  <td className="border border-gray-300 p-3">Art. 6(1)(f) - Legitimate Interest</td>
                  <td className="border border-gray-300 p-3">Session/1 year</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Analytics Cookies</td>
                  <td className="border border-gray-300 p-3">Art. 6(1)(a) - Consent</td>
                  <td className="border border-gray-300 p-3">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Functional Cookies</td>
                  <td className="border border-gray-300 p-3">Art. 6(1)(a) - Consent</td>
                  <td className="border border-gray-300 p-3">1 year</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Form Progress Data</td>
                  <td className="border border-gray-300 p-3">Art. 6(1)(a) - Explicit Consent</td>
                  <td className="border border-gray-300 p-3">30 days</td>
                </tr>
              </tbody>
            </table>

            <h2>6. Your Rights and Choices</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">You Have the Right To:</h3>
              <ul className="text-green-800 space-y-2">
                <li>✓ <strong>Withdraw Consent:</strong> Change your cookie preferences at any time</li>
                <li>✓ <strong>Access Your Data:</strong> Request a copy of all data we hold about you</li>
                <li>✓ <strong>Delete Your Data:</strong> Request deletion of your personal information</li>
                <li>✓ <strong>Rectify Your Data:</strong> Correct any inaccurate information</li>
                <li>✓ <strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
                <li>✓ <strong>Object to Processing:</strong> Object to certain types of data processing</li>
              </ul>
            </div>

            <h2>7. How to Manage Your Cookie Preferences</h2>
            <h3>Browser Settings</h3>
            <p>You can control and manage cookies through your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3>Our Cookie Consent Manager</h3>
            <p>
              When you first visit our website, you'll see a cookie consent banner. You can:
            </p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your preferences by cookie category</li>
              <li>Change your preferences at any time via the consent manager</li>
            </ul>

            <h2>8. Data Security</h2>
            <p>
              All form data captured through our auto-save feature is:
            </p>
            <ul>
              <li>Encrypted in transit using TLS 1.3</li>
              <li>Encrypted at rest using AES-256</li>
              <li>Stored on secure, GDPR-compliant servers</li>
              <li>Automatically deleted after 30 days</li>
              <li>Accessible only to authorized personnel</li>
              <li>Regularly audited for security compliance</li>
            </ul>

            <h2>9. International Data Transfers</h2>
            <p>
              Some cookies and tracking technologies may transfer data outside the EEA. When this occurs:
            </p>
            <ul>
              <li>We ensure adequate protection through Standard Contractual Clauses</li>
              <li>We work only with processors that meet GDPR adequacy requirements</li>
              <li>You have the right to object to international transfers</li>
            </ul>

            <h2>10. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in our practices or legal requirements. 
              When we make significant changes, we will:
            </p>
            <ul>
              <li>Update the "Last updated" date at the top of this page</li>
              <li>Notify you via our website banner</li>
              <li>Send email notifications to registered users (where applicable)</li>
              <li>Request fresh consent for new cookie types or purposes</li>
            </ul>

            <h2>11. Contact Information</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="mb-4">
                If you have questions about our cookie usage or want to exercise your rights:
              </p>
              <div className="space-y-2">
                <p><strong>Data Protection Officer:</strong> admin@viticult.co.uk</p>
                <p><strong>Address:</strong> 3rd Floor, 35 Artillery Lane, London, E1 7LP</p>
                <p><strong>Phone:</strong> 020 3595 3910</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
                if you are not satisfied with our handling of your personal data.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link 
                to="/privacy-policy" 
                className="btn-secondary mr-4"
              >
                View Privacy Policy
              </Link>
              <Link 
                to="/contact" 
                className="btn-primary"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CookiePolicy;