import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { contactAPI, ContactFormData } from '../services/api';
import FloatingPounds from '../components/common/FloatingPounds';
import api from '../services/api';
import visitorTracking from '../services/visitorTracking';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [autoSaveConsent, setAutoSaveConsent] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentDecided, setConsentDecided] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormData>();

  // Watch form fields for real-time capture
  const watchedFields = watch();

  // Real-time field capture with consent
  const captureFieldData = useCallback(async (fieldName: string, value: any) => {
    console.log(`🔍 Field ${fieldName} changed:`, { value, hasConsent: autoSaveConsent });
    
    if (!autoSaveConsent) {
      console.log('❌ No auto-save consent, skipping capture');
      return;
    }
    
    if (!value) {
      console.log('❌ Empty value, skipping capture');
      return;
    }

    // Clear existing debounce timer for this field
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    console.log(`⏳ Starting debounce timer for ${fieldName}`);

    // Set new debounce timer (wait 1 second after user stops typing)
    debounceTimers.current[fieldName] = setTimeout(async () => {
      try {
        // Get visitor ID with error handling
        let visitorData: { visitorId?: string } = {};
        try {
          visitorData = visitorTracking.getVisitorData() || {};
        } catch (error) {
          console.warn('⚠️ Visitor tracking not initialized yet, using anonymous ID');
          visitorData = { visitorId: 'anonymous-' + Date.now() };
        }
        console.log('👤 Visitor data:', visitorData);
        
        const payload = {
          visitorId: visitorData.visitorId || 'anonymous',
          fieldName,
          fieldValue: value,
          formType: 'contact',
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href
        };

        console.log('📤 Sending field capture request:', payload);
        
        // Send to backend
        const response = await api.post('/tracking/capture-field', payload);
        console.log('📥 Backend response:', response.data);

        // Update last saved time
        setLastSaved(new Date());

        // If email is captured, identify the visitor
        if (fieldName === 'email' && value) {
          try {
            visitorTracking.identifyVisitor({ email: value });
          } catch (error) {
            console.warn('⚠️ Could not identify visitor with email:', error);
          }
        }
        
        // If name is captured, identify the visitor
        if (fieldName === 'name' && value) {
          try {
            visitorTracking.identifyVisitor({ 
              name: value
            });
          } catch (error) {
            console.warn('⚠️ Could not identify visitor with name:', error);
          }
        }

        console.log(`✅ Auto-saved ${fieldName}: ${value}`);
      } catch (error) {
        console.error(`❌ Failed to capture ${fieldName}:`, error);
      }
    }, 1000); // 1 second debounce
  }, [autoSaveConsent]);

  // Watch for field changes
  useEffect(() => {
    console.log('👁️ Field watcher triggered:', { autoSaveConsent, watchedFields });
    
    if (!autoSaveConsent) {
      console.log('❌ Auto-save consent is FALSE - not capturing fields');
      return;
    }

    console.log('✅ Auto-save consent is TRUE - checking fields for changes');

    // Capture each field when it changes
    Object.keys(watchedFields).forEach(fieldName => {
      const value = watchedFields[fieldName as keyof ContactFormData];
      console.log(`🔍 Checking field ${fieldName}:`, { value, isEmpty: value === undefined || value === '' });
      
      if (value !== undefined && value !== '') {
        console.log(`📤 Capturing field ${fieldName} with value:`, value);
        captureFieldData(fieldName, value);
      }
    });
  }, [watchedFields, autoSaveConsent, captureFieldData]);

  // Initialize visitor tracking service and detect mobile
  useEffect(() => {
    console.log('🚀 Initializing visitor tracking service...');
    try {
      visitorTracking.initialize().catch(error => {
        console.error('❌ Failed to initialize visitor tracking:', error);
      });
    } catch (error) {
      console.error('❌ Visitor tracking initialization error:', error);
    }
    
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show consent modal when page loads immediately
  useEffect(() => {
    try {
      console.log('🔄 Contact form loaded, showing consent modal immediately');
      console.log('📊 Current states:', { consentDecided, autoSaveConsent, showConsentModal });
      // Show immediately without delay
      if (!consentDecided) {
        console.log('📋 Showing auto-save consent modal NOW');
        setShowConsentModal(true);
      } else {
        console.log('⏭️ Consent already decided, skipping modal');
      }
    } catch (error) {
      console.error('❌ Consent modal setup error:', error);
    }
  }, [consentDecided]);

  const handleConsentDecision = (consent: boolean) => {
    console.log(`🤝 User consent decision: ${consent ? 'YES - Auto-save enabled' : 'NO - Auto-save disabled'}`);
    setAutoSaveConsent(consent);
    setConsentDecided(true);
    setShowConsentModal(false);
    
    if (consent) {
      console.log('✅ Form auto-capture is now ENABLED - data will be saved as you type');
    } else {
      console.log('❌ Form auto-capture is DISABLED - data will NOT be saved automatically');
    }
    
    if (consent) {
      console.log('✅ Auto-save enabled by user');
    } else {
      console.log('❌ Auto-save declined by user');
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    // Always save to localStorage for demo purposes
    const saveToLocalStorage = () => {
      const existingSubmissions = localStorage.getItem('contactSubmissions');
      const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
      
      const newSubmission = {
        ...data,
        _id: 'local-' + Date.now(),
        status: 'new',
        createdAt: new Date().toISOString()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      
      return newSubmission;
    };
    
    try {
      // Submit to API - this must succeed
      const response = await contactAPI.submit(data);
      console.log('✅ Form submitted successfully:', response.data);
      
      // Only save to localStorage on actual success
      saveToLocalStorage();
      
      // Redirect to Thank You page with user's name
      const params = new URLSearchParams({
        type: 'contact',
        name: data.name
      });
      window.location.href = `/thank-you?${params.toString()}`;
      
      reset();
      
    } catch (error: any) {
      console.error('❌ Form submission failed:', error);
      
      // Show actual error to user instead of fake success
      if (error.response?.status === 429) {
        setSubmitError('Too many submissions. Please try again in 15 minutes.');
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Show detailed field-specific validation errors
        const errorMessages = error.response.data.errors.map((err: any) => 
          `${err.field}: ${err.message}`
        ).join(', ');
        setSubmitError(errorMessages);
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message.includes('Invalid email')) {
        setSubmitError('Please enter a valid email address.');
      } else if (error.message.includes('Invalid phone')) {
        setSubmitError('Please enter a valid phone number.');
      } else {
        setSubmitError('Submission failed. Please check your connection and try again.');
      }
      
      // Do NOT show success modal on error
      // Do NOT reset form so user can fix and retry
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '020 3595 3910',
      link: 'tel:+442035953910',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'admin@viticult.co.uk',
      link: 'mailto:admin@viticult.co.uk',
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      content: '3rd Floor, 35 Artillery Lane, London, E1 7LP',
      link: 'https://maps.google.com',
    },
    {
      icon: ClockIcon,
      title: 'Hours',
      content: 'Mon-Fri 10:00 AM - 6:00 PM GMT',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact ViticultWhisky | Expert Whisky Investment Consultation | London Office</title>
        <meta 
          name="description" 
          content="Contact our whisky investment experts for free consultation. London office, phone 020 3595 3910. Get expert guidance on Scottish whisky cask investments." 
        />
        <meta name="keywords" content="contact whisky investment experts, ViticultWhisky contact, whisky investment consultation, London whisky investment office" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://viticultwhisky.co.uk/contact" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact ViticultWhisky | Expert Whisky Investment Consultation" />
        <meta property="og:description" content="Get in touch with our whisky investment experts for free consultation and expert guidance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viticultwhisky.co.uk/contact" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/hero/contact-hero.webp" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact ViticultWhisky | Expert Whisky Investment Consultation" />
        <meta name="twitter:description" content="Get in touch with our whisky investment experts for free consultation and expert guidance." />
        <meta name="twitter:image" content="https://viticultwhisky.co.uk/whisky/hero/contact-hero.webp" />
        
        {/* Local Business */}
        <meta name="geo.region" content="GB-LND" />
        <meta name="geo.placename" content="London" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074,-0.1278" />
      </Helmet>

      {/* Extra floating pounds for contact page */}
      <FloatingPounds count={8} color="green" size="small" speed="slow" />
      
      {/* Hero Section */}
      <section className="relative h-[35vh] min-h-[300px] max-h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/whisky/hero/contact-hero.webp" 
            alt="Luxury whisky bottles"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="heading-1 text-white mb-6">Get In Touch</h1>
              <p className="text-xl text-white/90">
                Start your whisky investment journey today
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      

      {/* Contact Form Section */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-3 text-charcoal mb-6">Send Us a Message</h2>
              
              {/* Show notice when form is disabled */}
              {!consentDecided && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg"
                >
                  <p className="text-amber-800 font-medium text-center">
                    ⚠️ Please respond to the auto-save prompt above to continue
                  </p>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg"
                >
                  {submitError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${!consentDecided ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="form-input"
                      placeholder="John Smith"
                    />
                    {errors.name && (
                      <p className="form-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        validate: (value) => {
                          if (!value) return 'Email is required';
                          
                          // Check for basic email format
                          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                          if (!emailRegex.test(value)) {
                            return 'Please enter a valid email address';
                          }
                          
                          // Check for common typos (removed unused variable)
                          const domain = value.split('@')[1]?.toLowerCase();
                          
                          // Check for missing @ symbol
                          if (!value.includes('@')) {
                            return 'Email must contain @ symbol';
                          }
                          
                          // Check for multiple @ symbols
                          if ((value.match(/@/g) || []).length > 1) {
                            return 'Email can only contain one @ symbol';
                          }
                          
                          // Check for spaces
                          if (value.includes(' ')) {
                            return 'Email cannot contain spaces';
                          }
                          
                          // Check minimum length
                          if (value.length < 5) {
                            return 'Email address is too short';
                          }
                          
                          // Check for dot after @
                          const afterAt = value.split('@')[1];
                          if (afterAt && !afterAt.includes('.')) {
                            return 'Email domain must contain a dot (.)';
                          }
                          
                          // Warn about potential typos in common domains
                          if (domain) {
                            const typos: { [key: string]: string } = {
                              'gmial.com': 'gmail.com',
                              'gmai.com': 'gmail.com',
                              'yahooo.com': 'yahoo.com',
                              'yaho.com': 'yahoo.com',
                              'hotmial.com': 'hotmail.com',
                              'outlok.com': 'outlook.com'
                            };
                            
                            if (typos[domain]) {
                              return `Did you mean ${typos[domain]}?`;
                            }
                          }
                          
                          return true;
                        },
                      })}
                      className="form-input"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone', {
                        required: 'Phone number is required',
                        validate: (value) => {
                          if (!value) return 'Phone number is required';
                          // Remove all non-digit characters
                          const digitsOnly = value.replace(/\D/g, '');
                          if (digitsOnly.length < 10 || digitsOnly.length > 11) {
                            return 'Phone number must be 10 or 11 digits';
                          }
                          return true;
                        },
                      })}
                      className="form-input"
                      placeholder="0203595391"
                    />
                    {errors.phone && (
                      <p className="form-error">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="investmentInterest" className="form-label">
                      Investment Interest
                    </label>
                    <select
                      id="investmentInterest"
                      {...register('investmentInterest')}
                      className="form-input"
                    >
                      <option value="not-sure">Not Sure Yet</option>
                      <option value="starter">Starter (£5,000+)</option>
                      <option value="premium">Premium (£25,000+)</option>
                      <option value="exclusive">Exclusive (£50,000+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject', { required: 'Subject is required' })}
                    className="form-input"
                    placeholder="Investment Inquiry"
                  />
                  {errors.subject && (
                    <p className="form-error">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message', { required: 'Message is required' })}
                    className="form-input resize-none"
                    placeholder="Tell us about your investment goals..."
                  />
                  {errors.message && (
                    <p className="form-error">{errors.message.message}</p>
                  )}
                </div>

                {/* Interest Selection */}
                <div>
                  <label className="form-label">
                    What interests you in whisky cask ownership with ViticultWhisky?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="investmentPurposes"
                        {...register('investmentPurposes')}
                        className="h-4 w-4 text-premium-gold focus:ring-premium-gold border-gray-300 rounded"
                      />
                      <label htmlFor="investmentPurposes" className="ml-3 text-sm text-gray-700">
                        Investment Purposes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ownCask"
                        {...register('ownCask')}
                        className="h-4 w-4 text-premium-gold focus:ring-premium-gold border-gray-300 rounded"
                      />
                      <label htmlFor="ownCask" className="ml-3 text-sm text-gray-700">
                        Always wanted to own my own cask
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="giftPurpose"
                        {...register('giftPurpose')}
                        className="h-4 w-4 text-premium-gold focus:ring-premium-gold border-gray-300 rounded"
                      />
                      <label htmlFor="giftPurpose" className="ml-3 text-sm text-gray-700">
                        Want to Gift
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="otherInterest"
                        {...register('otherInterest')}
                        className="h-4 w-4 text-premium-gold focus:ring-premium-gold border-gray-300 rounded"
                      />
                      <label htmlFor="otherInterest" className="ml-3 text-sm text-gray-700">
                        Other
                      </label>
                    </div>
                  </div>
                </div>

                {/* Auto-save status indicator */}
                {autoSaveConsent && lastSaved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        ✓ Auto-save enabled - Last saved: {lastSaved.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Simple Debug Section - Only show in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">🔍 Debug Status:</h4>
                    <div className="text-xs space-y-1 text-yellow-700">
                      <p>• Consent Modal: {showConsentModal ? '✅ YES' : '❌ NO'}</p>
                      <p>• Consent Decided: {consentDecided ? '✅ YES' : '❌ NO'}</p>
                      <p>• Auto-Save Enabled: {autoSaveConsent ? '✅ YES' : '❌ NO'}</p>
                      <p>• Last Saved: {lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}</p>
                      <p>• Form Fields: {Object.keys(watchedFields || {}).length} fields</p>
                    </div>
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => {
                          console.log('🔥 Force enabling consent');
                          setAutoSaveConsent(true); 
                          setConsentDecided(true);
                        }}
                        className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded"
                      >
                        Enable Auto-Save
                      </button>
                      <button
                        onClick={() => {
                          console.log('🔥 Testing manual capture');
                          captureFieldData('test', 'manual-test-' + Date.now());
                        }}
                        className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
                      >
                        Test Capture
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="loading-spin w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full mr-2" />
                      Sending...
                    </span>
                  ) : (
                    'Register Your Interest'
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="heading-3 text-charcoal mb-6">Contact Information</h2>
                <p className="text-charcoal/70 mb-8">
                  Ready to explore whisky investment opportunities? Our team is here to guide you 
                  through every step of your investment journey.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-whisky-100 rounded-lg flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-charcoal/70 hover:text-gold transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-charcoal/70">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="h-96 bg-whisky-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="h-12 w-12 text-gold mx-auto mb-4" />
            <p className="text-charcoal/60">Interactive map would go here</p>
          </div>
        </div>
      </section>

      {/* Auto-Save Consent Modal - More Prominent */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/80 z-[10000]">
          {isMobile ? (
            // Mobile: Bottom sheet style
            <motion.div
              initial={{ opacity: 0, y: 300 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t-4 border-l-4 border-r-4 border-premium-gold"
              style={{ maxHeight: '85vh', overflowY: 'auto' }}
            >
              <div className="p-5">
                {/* Drag handle for mobile */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="text-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="mx-auto flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-premium-gold to-gold mb-4 md:mb-6"
              >
                <ShieldCheckIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                🔒 Enable Auto-Save Feature?
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 font-medium px-2">
                We can automatically save your form progress as you type, so you never lose your information!
              </p>
              <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-gray-600">
                  ✓ Never lose your data if you navigate away<br />
                  ✓ Secure & encrypted storage<br />
                  ✓ GDPR compliant - delete anytime
                </p>
              </div>
              <p className="text-xs text-gray-500 mb-4 md:mb-6 px-2">
                <strong>Privacy:</strong> Your data is encrypted and stored for max 30 days. 
                <a href="/privacy" className="underline hover:text-blue-600 ml-1">Privacy Policy</a> | 
                <a href="/data-rights" className="underline hover:text-blue-600 ml-1">Your Rights</a>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleConsentDecision(true)}
                className="flex-1 bg-gradient-to-r from-premium-gold to-gold text-white px-4 md:px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-bold text-base md:text-lg"
              >
                ✓ Enable Auto-Save
              </button>
              <button
                onClick={() => handleConsentDecision(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 md:px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base md:text-lg"
              >
                Skip for Now
              </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Desktop: Centered modal
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 border-4 border-premium-gold"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: 2, duration: 0.5 }}
                  className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-premium-gold to-gold mb-6"
                >
                  <ShieldCheckIcon className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  🔒 Enable Auto-Save Feature?
                </h3>
                <p className="text-base text-gray-700 mb-4 font-medium">
                  We can automatically save your form progress as you type, so you never lose your information!
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    ✓ Never lose your data if you navigate away<br />
                    ✓ Secure & encrypted storage<br />
                    ✓ GDPR compliant - delete anytime
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  <strong>Privacy:</strong> Your data is encrypted and stored for max 30 days. 
                  <a href="/privacy" className="underline hover:text-blue-600 ml-1">Privacy Policy</a> | 
                  <a href="/data-rights" className="underline hover:text-blue-600 ml-1">Your Rights</a>
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleConsentDecision(true)}
                  className="flex-1 bg-gradient-to-r from-premium-gold to-gold text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-bold text-lg"
                >
                  ✓ Enable Auto-Save
                </button>
                <button
                  onClick={() => handleConsentDecision(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-lg"
                >
                  Skip for Now
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
      
    </>
  );
};

export default Contact;