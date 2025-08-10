import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { buildApiEndpoint } from '../config/api.config';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import visitorTracking from '../services/visitorTracking';

interface SellWhiskyFormData {
  name: string;
  email: string;
  phone: string;
  caskType: string;
  distillery: string;
  year: string;
  litres: string;
  abv: string;
  askingPrice: string;
  message: string;
}

const SellWhisky: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'rate-limit' | 'network-error' | null>(null);
  const [autoSaveConsent, setAutoSaveConsent] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<SellWhiskyFormData>();
  
  // Watch form fields for real-time capture
  const watchedFields = watch();

  // Check for existing auto-save consent on mount and listen for changes
  useEffect(() => {
    // Check initial auto-save consent
    const checkAutoSaveConsent = () => {
      const existingAutoSaveConsent = localStorage.getItem('formAutoSaveConsent');
      if (existingAutoSaveConsent === 'true') {
        setAutoSaveConsent(true);
        console.log('✅ Auto-save consent found and enabled for sell-whisky form');
      } else if (existingAutoSaveConsent === 'false') {
        setAutoSaveConsent(false);
        console.log('❌ Auto-save consent explicitly disabled for sell-whisky form');
      }
    };
    
    checkAutoSaveConsent();
    
    // Listen for storage changes (in case consent is given in another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'formAutoSaveConsent') {
        checkAutoSaveConsent();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case the modal updates it
    const interval = setInterval(checkAutoSaveConsent, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Real-time field capture with consent
  const captureFieldData = useCallback(async (fieldName: string, value: any) => {
    console.log(`🔍 Sell-Whisky Field ${fieldName} changed:`, { value, hasConsent: autoSaveConsent });
    
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
          formType: 'sell-whisky',
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
    console.log('👁️ Sell-Whisky field watcher triggered:', { autoSaveConsent, watchedFields });
    
    if (!autoSaveConsent) {
      console.log('❌ Auto-save consent is FALSE - not capturing fields');
      return;
    }

    console.log('✅ Auto-save consent is TRUE - checking fields for changes');

    // Capture each field when it changes
    Object.keys(watchedFields).forEach(fieldName => {
      const value = watchedFields[fieldName as keyof SellWhiskyFormData];
      console.log(`🔍 Checking field ${fieldName}:`, { value, isEmpty: value === undefined || value === '' });
      
      if (value !== undefined && value !== '') {
        console.log(`📤 Capturing field ${fieldName} with value:`, value);
        captureFieldData(fieldName, value);
      }
    });
  }, [watchedFields, autoSaveConsent, captureFieldData]);

  // Initialize visitor tracking service
  useEffect(() => {
    console.log('🚀 Initializing visitor tracking service for sell-whisky...');
    try {
      visitorTracking.initialize().catch(error => {
        console.error('❌ Failed to initialize visitor tracking:', error);
      });
    } catch (error) {
      console.error('❌ Visitor tracking initialization error:', error);
    }
  }, []);

  const onSubmit = async (data: SellWhiskyFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit to API - this must succeed
      const response = await axios.post(buildApiEndpoint('sell-whisky'), data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Sell whisky form submitted successfully:', response.data);
      
      // Only store locally on actual success
      const submissions = JSON.parse(localStorage.getItem('sellWhiskySubmissions') || '[]');
      submissions.push({
        ...data,
        _id: response.data?.id || 'local-' + Date.now(),
        status: 'new',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('sellWhiskySubmissions', JSON.stringify(submissions));
      
      // Redirect to Thank You page with user's name
      const params = new URLSearchParams({
        type: 'sell',
        name: data.name
      });
      window.location.href = `/Thank_You_Sell?${params.toString()}`;
      
      reset();
      
    } catch (error: any) {
      console.error('❌ Sell whisky form submission failed:', error);
      
      // Show actual error instead of fake success
      if (error.response?.status === 429) {
        setSubmitStatus('rate-limit');
      } else if (error.response?.data?.message) {
        setSubmitStatus('error');
        console.error('Server error:', error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        setSubmitStatus('network-error');
      } else {
        setSubmitStatus('error');
      }
      
      // Do NOT show success modal on error
      // Do NOT reset form so user can fix and retry
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>Sell Your Whisky Cask | Get Expert Valuation</title>
        <meta name="description" content="Submit your whisky cask for sale. Get expert valuation and access to our global network of buyers." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/whisky/casks/dalmore-21-casks.webp"
            alt="Whisky warehouse"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Sell Your Whisky Cask
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto"
          >
            Get the best value for your investment with our expert network
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Cask Details</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and our experts will provide a free valuation within 48 hours.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
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
                      type="email"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone', {
                        required: 'Phone number is required',
                        validate: (value) => {
                          // Remove all non-digit characters
                          const digitsOnly = value.replace(/\D/g, '');
                          if (digitsOnly.length < 10 || digitsOnly.length > 11) {
                            return 'Phone number must be 10 or 11 digits';
                          }
                          return true;
                        },
                      })}
                      type="tel"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="0203595391"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Cask Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cask Type *
                    </label>
                    <select
                      {...register('caskType', { required: 'Cask type is required' })}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select cask type</option>
                      <option value="Ex-Bourbon">Ex-Bourbon</option>
                      <option value="Ex-Sherry">Ex-Sherry</option>
                      <option value="Virgin Oak">Virgin Oak</option>
                      <option value="Refill">Refill</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.caskType && (
                      <p className="mt-1 text-sm text-red-600">{errors.caskType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Distillery *
                    </label>
                    <input
                      {...register('distillery', { required: 'Distillery is required' })}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="e.g., Macallan, Glenlivet"
                    />
                    {errors.distillery && (
                      <p className="mt-1 text-sm text-red-600">{errors.distillery.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year Distilled *
                    </label>
                    <input
                      {...register('year', { required: 'Year is required' })}
                      type="number"
                      min="1900"
                      max="2024"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="2018"
                    />
                    {errors.year && (
                      <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Volume (Litres)
                    </label>
                    <input
                      {...register('litres')}
                      type="number"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ABV %
                    </label>
                    <input
                      {...register('abv')}
                      type="number"
                      step="0.1"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="58.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Asking Price (£)
                    </label>
                    <input
                      {...register('askingPrice')}
                      type="number"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Any additional details about your cask, storage location, certifications, etc."
                  />
                </div>

                {/* Submit Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg"
                  >
                    Thank you for your submission! We'll provide your free valuation within 24-48 hours.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                  >
                    Something went wrong. Please try again or contact us directly.
                  </motion.div>
                )}

                {submitStatus === 'rate-limit' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg"
                  >
                    Too many submissions. Please try again in an hour.
                  </motion.div>
                )}

                {submitStatus === 'network-error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg"
                  >
                    Network connection error. Please check your internet and try again.
                  </motion.div>
                )}

                {/* Auto-save status indicator */}
                {autoSaveConsent && lastSaved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        ✓ Auto-save enabled - Last saved: {lastSaved.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 text-white font-semibold rounded-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Cask for Valuation'}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

    </>
  );
};

export default SellWhisky;