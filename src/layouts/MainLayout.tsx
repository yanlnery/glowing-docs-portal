
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
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
      <Sidebar />
      <Header />
      
      <main className={cn("flex-1", !fullWidth && "md:pl-64")}>
        <div className={cn(fullWidth ? "w-full" : "docs-container py-6")}>
          {children}
        </div>
      </main>
      
      <footer className={cn("border-t py-6 bg-muted/30", !fullWidth && "md:pl-64")}>
        <div className="docs-container">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png" 
                alt="PET SERPENTES" 
                className="h-6 w-6" 
              />
              <span className="font-medium">PET SERPENTES & COMPANHIA</span>
            </div>
            <div>
              <p className="text-center md:text-right">
                © {new Date().getFullYear()} PET SERPENTES. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
