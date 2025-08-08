import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAnalytics } from './hooks/useGTM';

// Layout Components (keep these eagerly loaded)
import PublicLayout from './components/layout/PublicLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import CookieConsent from './components/common/CookieConsent';

// Eager load only critical pages for fast initial load
import Home from './pages/Home';

// Lazy load all other pages for better performance
const About = lazy(() => import('./pages/About'));
const HowItWorksNew = lazy(() => import('./pages/HowItWorksNew'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BuySell = lazy(() => import('./pages/BuySell'));
const SellWhisky = lazy(() => import('./pages/SellWhisky'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const DataRights = lazy(() => import('./pages/DataRights'));
const Terms = lazy(() => import('./pages/Terms'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const ThankYouSell = lazy(() => import('./pages/Thank_You_Sell'));
const Distilleries = lazy(() => import('./pages/Distilleries'));

// Admin Pages - also lazy loaded
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));

// 3D Components
const FloatingPounds = lazy(() => import('./components/common/FloatingPounds'));

// Loading component that mimics hero section
const PageLoader: React.FC = () => (
  <div className="min-h-screen">
    {/* Hero skeleton */}
    <section className="relative h-screen min-h-[800px] overflow-hidden bg-gradient-to-br from-premium-gold/5 to-primary-dark">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-primary-dark animate-pulse" />
      
      {/* Content skeleton */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pt-24 md:pt-28 lg:pt-0">
          <div className="max-w-5xl mx-auto lg:mx-0 lg:ml-28">
            {/* Title skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-12 bg-premium-gold/20 rounded animate-pulse w-64"></div>
              <div className="h-16 bg-premium-gold/30 rounded animate-pulse w-96"></div>
              <div className="h-12 bg-premium-gold/20 rounded animate-pulse w-80"></div>
            </div>
            {/* Description skeleton */}
            <div className="h-24 bg-white/10 rounded animate-pulse w-full max-w-2xl mb-8"></div>
            {/* Buttons skeleton */}
            <div className="flex gap-4">
              <div className="h-14 bg-premium-gold/30 rounded animate-pulse w-48"></div>
              <div className="h-14 bg-white/10 rounded animate-pulse w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

function App() {
  // Load analytics (GTM, Search Console)
  useAnalytics();
  
  useEffect(() => {
    // Initialize AOS with optimized settings
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      disable: false, // Re-enabled on mobile
    });
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <ScrollToTop />
          {/* 3D Background Components */}
          <Suspense fallback={<div className="fixed inset-0" />}>
            <FloatingPounds count={4} color="gold" size="medium" speed="slow" />
            <FloatingPounds count={3} color="green" size="small" speed="normal" />
            <FloatingPounds count={2} color="silver" size="large" speed="fast" />
          </Suspense>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Admin Routes */}
              <Route 
                path="/admin/login" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminLogin />
                  </Suspense>
                } 
              />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route 
                  path="dashboard" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminDashboard />
                    </Suspense>
                  } 
                />
              </Route>

              {/* Public Routes with Layout */}
              <Route element={<PublicLayout />}>
                <Route 
                  path="/" 
                  element={<Home />} 
                />
                <Route 
                  path="/about" 
                  element={<About />} 
                />
                <Route 
                  path="/how-it-works" 
                  element={<HowItWorksNew />} 
                />
                <Route 
                  path="/buy-sell" 
                  element={<BuySell />} 
                />
                {/* Buy route temporarily disabled - redirects to contact */}
                <Route 
                  path="/buy" 
                  element={<Navigate to="/contact" replace />} 
                />
                <Route 
                  path="/sell-whisky" 
                  element={<SellWhisky />} 
                />
                <Route 
                  path="/distilleries" 
                  element={<Distilleries />} 
                />
                <Route 
                  path="/faq" 
                  element={<FAQ />} 
                />
                <Route 
                  path="/contact" 
                  element={<Contact />} 
                />
                <Route 
                  path="/blog" 
                  element={<Blog />} 
                />
                <Route 
                  path="/blog/:slug" 
                  element={<BlogPost />} 
                />
                <Route 
                  path="/privacy" 
                  element={<PrivacyPolicy />} 
                />
                <Route 
                  path="/privacy-policy" 
                  element={<PrivacyPolicy />} 
                />
                <Route 
                  path="/cookie-policy" 
                  element={<CookiePolicy />} 
                />
                <Route 
                  path="/data-rights" 
                  element={<DataRights />} 
                />
                <Route 
                  path="/terms" 
                  element={<Terms />} 
                />
                <Route 
                  path="/thank-you" 
                  element={<ThankYou />} 
                />
                <Route 
                  path="/Thank_You_Sell" 
                  element={<ThankYouSell />} 
                />
                
                {/* Catch-all route for debugging */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                        <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                        <p className="text-sm text-gray-500 mb-6">Current path: {window.location.pathname}</p>
                        <div className="space-x-4">
                          <a href="/" className="bg-premium-gold text-white px-6 py-2 rounded-lg hover:bg-antique-gold transition-colors">
                            Go Home
                          </a>
                          <a href="/how-it-works" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                            How It Works
                          </a>
                        </div>
                      </div>
                    </div>
                  } 
                />
              </Route>
            </Routes>
            <CookieConsent />
          </div>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;