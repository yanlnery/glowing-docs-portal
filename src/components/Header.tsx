
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get title based on route
  const getTitle = () => {
    if (location.pathname === '/') return 'Home';
    if (location.pathname === '/api') return 'API Reference';
    if (location.pathname === '/examples') return 'Examples';
    
    // Remove leading slash and capitalize
    const path = location.pathname.substring(1);
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-20 w-full transition-all duration-200 bg-background/80 backdrop-blur-md",
        isScrolled ? "border-b shadow-sm" : ""
      )}
    >
      <div className="md:pl-64">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="hidden md:block ml-auto">
            <div className="font-medium text-lg md:hidden">
              {getTitle()}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com/pet-serpentes" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
