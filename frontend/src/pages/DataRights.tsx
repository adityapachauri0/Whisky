import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ArrowDownTrayIcon, 
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ArrowPathIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

const DataRights: React.FC = () => {
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const dataRights = [
    {
      id: 'access',
      title: 'Right to Access',
      icon: EyeIcon,
      description: 'Request a copy of all personal data we hold about you',
      article: 'Article 15 GDPR',
      color: 'blue',
      details: 'You can request a copy of all personal data we process about you, including data from our real-time form capture system. We will provide this within 30 days in a commonly used electronic format.'
    },
    {
      id: 'rectification',
      title: 'Right to Rectification', 
      icon: PencilIcon,
      description: 'Correct any inaccurate or incomplete personal data',
      article: 'Article 16 GDPR',
      color: 'green',
      details: 'If any of your personal information is inaccurate or incomplete, you can request that we correct or complete it. This includes data captured through our auto-save form feature.'
    },
    {
      id: 'erasure',
      title: 'Right to Erasure',
      icon: TrashIcon, 
      description: 'Request deletion of your personal data ("Right to be Forgotten")',
      article: 'Article 17 GDPR',
      color: 'red',
      details: 'You can request deletion of your personal data when it is no longer necessary for the original purpose, when you withdraw consent, or when it has been unlawfully processed.'
    },
    {
      id: 'portability',
      title: 'Right to Data Portability',
      icon: ArrowDownTrayIcon,
      description: 'Receive your data in a structured, machine-readable format',
      article: 'Article 20 GDPR', 
      color: 'purple',
      details: 'You can request your personal data in a structured, commonly used format (like JSON or CSV) so you can transfer it to another service provider.'
    },
    {
      id: 'restriction',
      title: 'Right to Restrict Processing',
      icon: ArrowPathIcon,
      description: 'Limit how we process your personal data',
      article: 'Article 18 GDPR',
      color: 'yellow',
      details: 'You can request that we stop processing your personal data (while still storing it) in certain circumstances, such as while we verify the accuracy of disputed data.'
    },
    {
      id: 'objection',
      title: 'Right to Object',
      icon: XCircleIcon,
      description: 'Object to certain types of data processing',
      article: 'Article 21 GDPR',
      color: 'orange',
      details: 'You can object to processing based on legitimate interests, direct marketing, or profiling. We must stop processing unless we have compelling legitimate grounds.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Your Data Rights - ViticultWhisky | GDPR Rights Management</title>
        <meta 
          name="description" 
          content="Exercise your GDPR data rights with ViticultWhisky. Access, correct, delete, or port your data. Withdraw consent for real-time form capture anytime." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://viticultwhisky.co.uk/data-rights" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/whisky/hero/contact-hero.webp" 
            alt="Digital privacy and data protection"
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
              <div className="flex justify-center mb-4">
                <ShieldCheckIcon className="h-16 w-16 text-premium-gold" />
              </div>
              <h1 className="heading-1 text-white mb-4">Your Data Rights</h1>
              <p className="text-lg text-white/80">
                Exercise your GDPR rights and manage your personal data
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
            className="max-w-6xl mx-auto"
          >
            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12 rounded-r-lg">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Your Rights Under GDPR</h2>
              <p className="text-blue-800 leading-relaxed">
                As a data subject under the General Data Protection Regulation (GDPR), you have specific rights 
                regarding your personal data. This includes any information captured through our real-time form 
                auto-save feature, visitor tracking, and all other data processing activities.
              </p>
            </div>

            {/* Data Rights Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {dataRights.map((right) => (
                <motion.div
                  key={right.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`${
                    right.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                    right.color === 'green' ? 'bg-green-50 border-green-200' :
                    right.color === 'red' ? 'bg-red-50 border-red-200' :
                    right.color === 'purple' ? 'bg-purple-50 border-purple-200' :
                    right.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-orange-50 border-orange-200'
                  } border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => setSelectedRight(selectedRight === right.id ? null : right.id)}
                >
                  <div className="flex items-start mb-4">
                    <right.icon className={`h-8 w-8 mr-3 flex-shrink-0 ${
                      right.color === 'blue' ? 'text-blue-600' :
                      right.color === 'green' ? 'text-green-600' :
                      right.color === 'red' ? 'text-red-600' :
                      right.color === 'purple' ? 'text-purple-600' :
                      right.color === 'yellow' ? 'text-yellow-600' :
                      'text-orange-600'
                    }`} />
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        right.color === 'blue' ? 'text-blue-900' :
                        right.color === 'green' ? 'text-green-900' :
                        right.color === 'red' ? 'text-red-900' :
                        right.color === 'purple' ? 'text-purple-900' :
                        right.color === 'yellow' ? 'text-yellow-900' :
                        'text-orange-900'
                      }`}>
                        {right.title}
                      </h3>
                      <p className={`text-xs font-medium ${
                        right.color === 'blue' ? 'text-blue-600' :
                        right.color === 'green' ? 'text-green-600' :
                        right.color === 'red' ? 'text-red-600' :
                        right.color === 'purple' ? 'text-purple-600' :
                        right.color === 'yellow' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`}>
                        {right.article}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 ${
                    right.color === 'blue' ? 'text-blue-800' :
                    right.color === 'green' ? 'text-green-800' :
                    right.color === 'red' ? 'text-red-800' :
                    right.color === 'purple' ? 'text-purple-800' :
                    right.color === 'yellow' ? 'text-yellow-800' :
                    'text-orange-800'
                  }`}>
                    {right.description}
                  </p>
                  
                  {selectedRight === right.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`border-t pt-4 mt-4 ${
                        right.color === 'blue' ? 'border-blue-200' :
                        right.color === 'green' ? 'border-green-200' :
                        right.color === 'red' ? 'border-red-200' :
                        right.color === 'purple' ? 'border-purple-200' :
                        right.color === 'yellow' ? 'border-yellow-200' :
                        'border-orange-200'
                      }`}
                    >
                      <p className={`text-sm ${
                        right.color === 'blue' ? 'text-blue-800' :
                        right.color === 'green' ? 'text-green-800' :
                        right.color === 'red' ? 'text-red-800' :
                        right.color === 'purple' ? 'text-purple-800' :
                        right.color === 'yellow' ? 'text-yellow-800' :
                        'text-orange-800'
                      }`}>
                        {right.details}
                      </p>
                    </motion.div>
                  )}
                  
                  <button className={`btn-secondary text-sm mt-4 w-full ${
                    right.color === 'blue' ? 'text-blue-700 hover:text-blue-800' :
                    right.color === 'green' ? 'text-green-700 hover:text-green-800' :
                    right.color === 'red' ? 'text-red-700 hover:text-red-800' :
                    right.color === 'purple' ? 'text-purple-700 hover:text-purple-800' :
                    right.color === 'yellow' ? 'text-yellow-700 hover:text-yellow-800' :
                    'text-orange-700 hover:text-orange-800'
                  }`}>
                    {selectedRight === right.id ? 'Hide Details' : 'Learn More'}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Specific Information About Form Data */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">
                Real-Time Form Data Rights
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">What Data We Capture</h3>
                  <ul className="text-purple-700 space-y-2">
                    <li>• First name and last name</li>
                    <li>• Email address</li>
                    <li>• Phone number</li>
                    <li>• Form preferences</li>
                    <li>• Timestamps of capture</li>
                    <li>• Anonymous visitor ID</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">Your Control</h3>
                  <ul className="text-purple-700 space-y-2">
                    <li>• ✓ Consent required before any capture</li>
                    <li>• ✓ Withdraw consent at any time</li>
                    <li>• ✓ Data automatically deleted after 30 days</li>
                    <li>• ✓ Request immediate deletion</li>
                    <li>• ✓ Download all your captured data</li>
                    <li>• ✓ Correct any inaccurate information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Exercise Your Rights */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-green-900 mb-6">
                How to Exercise Your Rights
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">1</span>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Contact Us</h3>
                  <p className="text-green-700 text-sm">
                    Email admin@viticult.co.uk or use our contact form
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Verify Identity</h3>
                  <p className="text-green-700 text-sm">
                    We may need to verify your identity to protect your data
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Response</h3>
                  <p className="text-green-700 text-sm">
                    We'll respond within 30 days (or explain any delays)
                  </p>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Response Timeframes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Standard Requests</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Data access requests: Within 30 days</li>
                    <li>• Correction requests: Within 30 days</li>
                    <li>• Data portability: Within 30 days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Priority Requests</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Deletion requests: Within 5 business days</li>
                    <li>• Consent withdrawal: Immediately effective</li>
                    <li>• Processing objections: Within 5 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* No Cost Statement */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                ✓ Exercising Your Rights is Free
              </h3>
              <p className="text-blue-800">
                We do not charge for processing data rights requests unless they are manifestly 
                unfounded, excessive, or repetitive. In such cases, we may charge a reasonable 
                administrative fee or refuse the request.
              </p>
            </div>

            {/* Complaint Rights */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-red-900 mb-4">
                Right to Lodge a Complaint
              </h3>
              <p className="text-red-800 mb-4">
                If you are not satisfied with how we handle your personal data or respond to your rights requests, 
                you have the right to lodge a complaint with your local data protection authority:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">UK Residents</h4>
                  <p className="text-red-700 text-sm">
                    Information Commissioner's Office (ICO)<br/>
                    Website: ico.org.uk<br/>
                    Phone: 0303 123 1113
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">EU Residents</h4>
                  <p className="text-red-700 text-sm">
                    Contact your national data protection authority<br/>
                    Find your authority: ec.europa.eu/justice/data-protection
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Exercise Your Rights?
              </h2>
              <p className="text-gray-700 mb-6">
                Contact our Data Protection Officer to make a request or ask questions about your data rights.
              </p>
              <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                <Link to="/contact" className="btn-primary">
                  Submit Data Rights Request
                </Link>
                <Link to="/privacy-policy" className="btn-secondary">
                  View Privacy Policy
                </Link>
                <Link to="/cookie-policy" className="btn-secondary">
                  Cookie Policy
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
                <p><strong>Data Protection Officer:</strong> admin@viticult.co.uk</p>
                <p><strong>Address:</strong> 3rd Floor, 35 Artillery Lane, London, E1 7LP</p>
                <p><strong>Phone:</strong> 020 3595 3910</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DataRights;