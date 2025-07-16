import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
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
import PageTransition from './components/common/PageTransition';

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
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col bg-primary-black">
                <Header />
                <main className="flex-grow bg-primary-black">
                  <PageTransition>
                    <Routes>
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
                    </Routes>
                  </PageTransition>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
