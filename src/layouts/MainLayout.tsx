
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/auth';
import { SidebarProvider } from '@/contexts/SidebarContext';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {isAuthenticated && <Sidebar />}
        <main className={cn(
          "flex-1 overflow-auto",
          isAuthenticated ? "pl-0 lg:pl-4" : ""
        )}>
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
