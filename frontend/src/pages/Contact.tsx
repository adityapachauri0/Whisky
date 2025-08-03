import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { contactAPI, ContactFormData } from '../services/api';
import FloatingPounds from '../components/common/FloatingPounds';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

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
              

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg"
                >
                  {submitError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                          if (digitsOnly.length !== 10) {
                            return 'Phone number must be exactly 10 digits';
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
      
    </>
  );
};

export default Contact;