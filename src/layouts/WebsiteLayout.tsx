
import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalStructuredData from '@/components/GlobalStructuredData';

export default function WebsiteLayout() {
  const location = useLocation();
  
  // Smooth scroll to top when location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalStructuredData />
      <Header />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
