
import React from 'react';
import Sidebar from '@/components/Sidebar';

interface MainDashboardProps {
  children: React.ReactNode;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};
