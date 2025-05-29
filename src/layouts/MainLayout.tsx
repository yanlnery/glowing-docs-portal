
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  const location = useLocation();
  
  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">      
      <div className="flex flex-1">
        <Sidebar />
        <main className={cn("flex-1", !fullWidth && "md:pl-64")}>
          <div className={cn(
            fullWidth 
              ? "w-full" 
              : "docs-container py-4 sm:py-6 px-4 sm:px-6"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
