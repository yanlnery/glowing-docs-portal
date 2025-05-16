
import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Book, Syringe, Home, FileText, Users, Phone } from "lucide-react"; // Reduced icons
import { useSettings } from "@/hooks/useSettings";
import type { MenuItem } from './header/menuItem.type'; // Adjusted path

// Import new components
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import HeaderActions from './header/HeaderActions';
import MobileNavigation from './header/MobileNavigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAcademyVisible } = useSettings();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const baseMenuItems: MenuItem[] = [
    { title: "Início", path: "/", icon: <Home size={16} className="mr-2" /> },
    { title: "P. S. Academy", path: "/academy", icon: <Book size={16} className="mr-2" />, id: "academy" },
    { title: "Animais Disponíveis", path: "/catalogo", icon: <Syringe size={16} className="mr-2" /> },
    { title: "Espécies Criadas", path: "/especies", icon: <FileText size={16} className="mr-2" /> },
    { title: "Manuais de Criação", path: "/manuais", icon: <Book size={16} className="mr-2" /> }, // Using Book icon again, consider variety if needed
    { title: "Quem Somos", path: "/sobre", icon: <Users size={16} className="mr-2" /> },
    { title: "Contato", path: "/contato", icon: <Phone size={16} className="mr-2" /> },
  ];

  const menuItems = useMemo(() => {
    return baseMenuItems.filter(item => {
      if (item.id === "academy") {
        return isAcademyVisible;
      }
      return true;
    });
  }, [isAcademyVisible, baseMenuItems]); // Added baseMenuItems to dependency array
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        
        <DesktopNavigation menuItems={menuItems} isActive={isActive} />
        
        <div className="flex items-center gap-2">
          <HeaderActions />
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
