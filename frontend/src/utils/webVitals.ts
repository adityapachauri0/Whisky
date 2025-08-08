import { getCLS, getFID, getFCP, getLCP, getTTFB, ReportHandler, Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

interface VitalsData {
  dsn?: string;
  id: string;
  page: string;
  href: string;
  event_name: string;
  value: number;
  speed: string;
}

function getConnectionSpeed(): string {
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (connection?.effectiveType) {
    return connection.effectiveType;
  }
  
  return 'unknown';
}

function sendToAnalytics(metric: Metric, options?: { params?: VitalsData['dsn'] }) {
  const page = window.location.pathname;
  const href = window.location.href;
  const speed = getConnectionSpeed();

  const body: VitalsData = {
    dsn: options?.params,
    id: metric.id,
    page,
    href,
    event_name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    speed,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value, (metric as any).rating || 'N/A');
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ANALYTICS_ID) {
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(vitalsUrl, blob);
    } else {
      fetch(vitalsUrl, {
        method: 'POST',
        body: blob,
        keepalive: true,
      });
    }
  }

  // Also log to custom analytics if needed
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals(onPerfEntry?: ReportHandler) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

// gtag type is already defined in index.tsx