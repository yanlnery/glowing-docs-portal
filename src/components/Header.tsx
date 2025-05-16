
import React, { useState, useMemo, useEffect } from "react"; // Added useEffect
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Book, Syringe, Home, FileText, Users, Phone } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import type { MenuItem } from './header/menuItem.type';

import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import HeaderActions from './header/HeaderActions';
import MobileNavigation from './header/MobileNavigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { settings, isAcademyVisible } = useSettings(); // Changed to get settings object

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const baseMenuItems: MenuItem[] = [ // Added eslint-disable for baseMenuItems dependency issue with useMemo
    { title: "Início", path: "/", icon: <Home size={16} className="mr-2" /> },
    { title: "P. S. Academy", path: "/academy", icon: <Book size={16} className="mr-2" />, id: "academy" },
    { title: "Animais Disponíveis", path: "/catalogo", icon: <Syringe size={16} className="mr-2" /> },
    { title: "Espécies Criadas", path: "/especies", icon: <FileText size={16} className="mr-2" /> },
    { title: "Manuais de Criação", path: "/manuais", icon: <Book size={16} className="mr-2" /> },
    { title: "Quem Somos", path: "/sobre", icon: <Users size={16} className="mr-2" /> },
    { title: "Contato", path: "/contato", icon: <Phone size={16} className="mr-2" /> },
  ];

  const menuItems = useMemo(() => {
    // console.log("Recalculating menu items, isAcademyVisible:", isAcademyVisible);
    return baseMenuItems.filter(item => {
      if (item.id === "academy") {
        return isAcademyVisible;
      }
      return true;
    });
  }, [isAcademyVisible, baseMenuItems]);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6"> {/* Ensured padding for container */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        
        <DesktopNavigation menuItems={menuItems} isActive={isActive} />
        
        <div className="flex items-center gap-1 md:gap-2"> {/* Reduced gap for mobile */}
          <HeaderActions />
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md" // Ensured min size and focus styling
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Increased icon size */}
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

