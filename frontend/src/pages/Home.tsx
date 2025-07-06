import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import InvestmentOptions from '../components/sections/InvestmentOptions';
import OurWhiskey from '../components/sections/OurWhiskey';
import BuySellWhiskey from '../components/sections/BuySellWhiskey';
import Testimonials from '../components/sections/Testimonials';
import BlogPreview from '../components/sections/BlogPreview';
import CTA from '../components/sections/CTA';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ViticultWhisky - Premium Whiskey Investment Platform</title>
        <meta 
          name="description" 
          content="Invest in premium whiskey casks with ViticultWhisky. Build a portfolio of rare and exclusive whiskeys with potential returns that mature over time." 
        />
        <meta name="keywords" content="whiskey investment, cask investment, alternative investments, Irish whiskey, premium spirits" />
      </Helmet>

      <Hero />
      <Features />
      <HowItWorksSection />
      <OurWhiskey />
      <BuySellWhiskey />
      <InvestmentOptions />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  );
};

export default Home;