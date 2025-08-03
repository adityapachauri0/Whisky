import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layout Components
import PublicLayout from './components/layout/PublicLayout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorksNew';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BuySell from './pages/BuySell';
import Buy from './pages/Buy';
import SellWhisky from './pages/SellWhisky';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Common Components
import ScrollToTop from './components/common/ScrollToTop';
import FloatingPounds from './components/common/FloatingPounds';

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <ScrollToTop />
          <FloatingPounds count={8} color="gold" size="medium" speed="slow" />
          <div className="min-h-screen flex flex-col bg-primary-black">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Public Routes with Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/buy-sell" element={<BuySell />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell-whisky" element={<SellWhisky />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
