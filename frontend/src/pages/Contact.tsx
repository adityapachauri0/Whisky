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
import PremiumSuccessModal from '../components/PremiumSuccessModal';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await contactAPI.submit(data);
      setSubmittedName(data.name);
      setShowSuccessModal(true);
      reset();
      
    } catch (error: any) {
      setSubmitError(error.response?.data?.error || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSubmitSuccess(true);
    // Show simple success message after modal closes
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
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
      content: 'info@whiskytradingco.com',
      link: 'mailto:info@whiskytradingco.com',
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
      content: 'Mon-Fri 9:00 AM - 6:00 PM GMT',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Get in touch with our whisky investment experts. Book a free consultation or send us a message." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light" />
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
      <section className="section bg-white">
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
              
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg"
                >
                  Thank you for your message! We'll get back to you within 24-48 hours.
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
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
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
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Phone number must be exactly 10 digits (no spaces or special characters)',
                        },
                      })}
                      className="form-input"
                      placeholder="1234567890"
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
                      <option value="starter">Starter (€5,000+)</option>
                      <option value="premium">Premium (€25,000+)</option>
                      <option value="exclusive">Exclusive (€50,000+)</option>
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

                <div>
                  <label htmlFor="preferredContactMethod" className="form-label">
                    Preferred Contact Method
                  </label>
                  <select
                    id="preferredContactMethod"
                    {...register('preferredContactMethod')}
                    className="form-input"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="both">Either</option>
                  </select>
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
                    'Send Message'
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

              {/* Consultation Booking */}
              <div className="bg-whisky-50 rounded-xl p-6 mt-8">
                <h3 className="font-semibold text-charcoal mb-4">Book a Free Consultation</h3>
                <p className="text-charcoal/70 mb-4">
                  Prefer to speak directly with an investment specialist? Schedule a 30-minute 
                  consultation to discuss your goals and explore opportunities.
                </p>
                <button className="btn-secondary w-full">
                  Schedule Consultation
                </button>
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
      
      {/* Premium Success Modal */}
      <PremiumSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        userName={submittedName}
      />
    </>
  );
};

export default Contact;