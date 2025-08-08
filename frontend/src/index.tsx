import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initWebVitals } from './utils/webVitals';

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

// Initialize Web Vitals monitoring
initWebVitals();

// Legacy Web Vitals reporting (kept for compatibility)
reportWebVitals((metric) => {
  // Metrics are now handled by initWebVitals
  if (process.env.NODE_ENV === 'development') {
    console.log('[Legacy Web Vitals]', metric.name, metric.value);
  }
});