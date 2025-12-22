
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Book, Home, FileText, Users, Phone, Worm, MonitorPlay, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";
import type { MenuItem } from './header/menuItem.type';

import Logo from './header/Logo';
import HeaderActions from './header/HeaderActions';
import MobileNavigation from './header/MobileNavigation';

const iconComponents = {
  Home, Book, FileText, Users, Phone, Worm, MonitorPlay, Bug
};

// Define a more specific type for static menu items
interface StaticMenuItem extends Omit<MenuItem, 'icon'> {
  iconName: keyof typeof iconComponents | null;
}

const staticBaseMenuItems: StaticMenuItem[] = [
  { title: "Início", path: "/", iconName: "Home" },
  { title: "Animais Disponíveis", path: "/catalogo", iconName: "Worm" },
  { title: "P. S. Academy", path: "/academy", iconName: "MonitorPlay", id: "academy" },
  { title: "Espécies Criadas", path: "/especies", iconName: "Bug" },
  { title: "Manuais de Criação", path: "/manuais", iconName: "Book" },
  { title: "Quem Somos", path: "/sobre", iconName: "Users" },
  { title: "Contato", path: "/contato", iconName: "Phone" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings(); 
  const isAcademyVisible = settings.isAcademyVisible;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const baseMenuItems = useMemo((): MenuItem[] => {
    return staticBaseMenuItems.map(item => {
      const { iconName, ...menuItemProps } = item; 
      const IconComponent = iconName ? iconComponents[iconName] : null;
      return {
        ...menuItemProps, 
        icon: IconComponent ? <IconComponent size={16} className="mr-2" /> : undefined,
      };
    });
  }, []);

  const menuItems = useMemo(() => {
    return baseMenuItems.filter(item => {
      if (item.id === "academy") {
        return isAcademyVisible;
      }
      return true;
    });
  }, [isAcademyVisible, baseMenuItems]);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/60 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-1 md:gap-2">
          <HeaderActions />
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="sr-only">{isMenuOpen ? "Fechar menu" : "Abrir menu"}</span>
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <MobileNavigation 
          menuItems={menuItems} 
          isActive={isActive} 
          setIsMenuOpen={setIsMenuOpen} 
        />
      )}
    </header>
  );
}
