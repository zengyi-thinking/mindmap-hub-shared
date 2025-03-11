
import React, { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;
