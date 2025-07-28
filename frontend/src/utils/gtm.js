import logger from '../utils/logger';

// Google Tag Manager Helper Functions

// Push events to GTM dataLayer
export const gtmEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
};

// Common GTM Events for Whisky Investment Site
export const GTMEvents = {
  // Page View Events
  pageView: (pageName) => {
    gtmEvent('page_view', {
      page_name: pageName,
      page_path: window.location.pathname
    });
  },

  // Investment Calculator Events
  calculatorUsed: (investmentAmount, holdingPeriod, expectedReturn) => {
    gtmEvent('calculator_used', {
      event_category: 'engagement',
      event_label: 'investment_calculator',
      investment_amount: investmentAmount,
      holding_period: holdingPeriod,
      expected_return: expectedReturn
    });
  },

  // Form Submission Events
  formSubmit: (formType, formData = {}) => {
    gtmEvent('form_submit', {
      event_category: 'form',
      form_type: formType,
      ...formData
    });
  },

  // Contact Form
  contactFormSubmit: (data) => {
    gtmEvent('contact_form_submit', {
      event_category: 'form',
      event_label: 'contact',
      inquiry_type: data.inquiryType
    });
  },

  // Sell Whisky Form
  sellWhiskySubmit: (data) => {
    gtmEvent('sell_whisky_submit', {
      event_category: 'form',
      event_label: 'sell_whisky',
      whisky_type: data.whiskyType,
      cask_size: data.caskSize
    });
  },

  // CTA Click Events
  ctaClick: (ctaName, ctaLocation) => {
    gtmEvent('cta_click', {
      event_category: 'engagement',
      cta_name: ctaName,
      cta_location: ctaLocation
    });
  },

  // Navigation Events
  navigationClick: (linkName, linkDestination) => {
    gtmEvent('navigation_click', {
      event_category: 'navigation',
      link_name: linkName,
      link_destination: linkDestination
    });
  },

  // Download Events
  downloadClick: (fileName, fileType) => {
    gtmEvent('download_click', {
      event_category: 'download',
      file_name: fileName,
      file_type: fileType
    });
  },

  // Video Events
  videoPlay: (videoTitle, videoDuration) => {
    gtmEvent('video_play', {
      event_category: 'video',
      video_title: videoTitle,
      video_duration: videoDuration
    });
  },

  // Scroll Depth
  scrollDepth: (percentage) => {
    gtmEvent('scroll_depth', {
      event_category: 'engagement',
      scroll_percentage: percentage
    });
  }
};

// Initialize GTM (if using environment variable)
export const initGTM = () => {
  const gtmId = process.env.REACT_APP_GTM_ID;
  
  if (!gtmId || gtmId === 'GTM-XXXXXXX') {
    logger.warn('GTM ID not configured');
    return;
  }

  // This would be used if you want to dynamically load GTM
  // Instead of hardcoding in index.html
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(script);

  // Add noscript iframe
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);
};