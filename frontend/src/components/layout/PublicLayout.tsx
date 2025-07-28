import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageTransition from '../common/PageTransition';

const PublicLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;