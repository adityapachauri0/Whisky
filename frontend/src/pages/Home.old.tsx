import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import InvestmentOptions from '../components/sections/InvestmentOptions';
import OurWhisky from '../components/sections/OurWhisky';
import DistilleryPartners from '../components/sections/DistilleryPartners';
import BuySellWhisky from '../components/sections/BuySellWhisky';
import WhiskyGallery from '../components/sections/WhiskyGallery';
import Testimonials from '../components/sections/Testimonials';
import BlogPreview from '../components/sections/BlogPreview';
import CTA from '../components/sections/CTA';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ViticultWhisky - Premium Whisky Investment Platform</title>
        <meta 
          name="description" 
          content="Invest in premium whisky casks with ViticultWhisky. Build a portfolio of rare and exclusive whiskys with potential returns that mature over time." 
        />
        <meta name="keywords" content="whisky investment, cask investment, alternative investments, Irish whisky, premium spirits" />
      </Helmet>

      <Hero />
      <Features />
      <HowItWorksSection />
      <OurWhisky />
      <DistilleryPartners />
      <WhiskyGallery />
      <BuySellWhisky />
      <InvestmentOptions />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  );
};

export default Home;