import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Web Vitals reporting
if (process.env.NODE_ENV === 'production') {
  reportWebVitals((metric) => {
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      // Metrics logged in development only
    }
  });
} else {
  // Metrics not logged in production
  reportWebVitals(() => {});
}