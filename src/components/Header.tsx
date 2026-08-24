
import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Book, Home, FileText, Users, Phone, MonitorPlay } from "lucide-react";
import { SnakeIcon, LizardIcon } from '@/components/icons/CustomIcons';
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";
import type { MenuItem } from './header/menuItem.type';

import Logo from './header/Logo';
import HeaderActions from './header/HeaderActions';
import { MobileMenu } from "@/components/MobileMenu";

// Mobile menu icons (PNG images)
import menuHomeIcon from '@/assets/icons/menu-home.png';
import menuSnakeIcon from '@/assets/icons/menu-snake.png';
import menuAcademyIcon from '@/assets/icons/menu-academy.png';
import menuLizardIcon from '@/assets/icons/menu-lizard.png';
import menuBookIcon from '@/assets/icons/menu-book.png';
import menuUsersIcon from '@/assets/icons/menu-users.png';
import menuPhoneIcon from '@/assets/icons/menu-phone.png';

const iconComponents = {
  Home, Book, FileText, Users, Phone, MonitorPlay,
  Snake: SnakeIcon,
  Lizard: LizardIcon,
};

const mobileIconImages: Record<string, string> = {
  Home: menuHomeIcon,
  Snake: menuSnakeIcon,
  MonitorPlay: menuAcademyIcon,
  Lizard: menuLizardIcon,
  Book: menuBookIcon,
  Users: menuUsersIcon,
  Phone: menuPhoneIcon,
};

// Define a more specific type for static menu items
interface StaticMenuItem extends Omit<MenuItem, 'icon' | 'mobileIcon'> {
  iconName: keyof typeof iconComponents | null;
}

const staticBaseMenuItems: StaticMenuItem[] = [
  { title: "Início", path: "/", iconName: "Home" },
  { title: "Animais Disponíveis", path: "/catalogo", iconName: "Snake" },
  { title: "P. S. Academy", path: "/academy", iconName: "MonitorPlay", id: "academy" },
  { title: "Espécies Criadas", path: "/especies", iconName: "Lizard" },
  { title: "Manuais de Criação", path: "/manuais", iconName: "Book" },
  { title: "Quem Somos", path: "/sobre", iconName: "Users" },
  { title: "Contato", path: "/contato", iconName: "Phone" },
];

export default function Header() {
  const location = useLocation();
  const { settings } = useSettings(); 
  const isAcademyVisible = settings.isAcademyVisible;

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const baseMenuItems = useMemo((): MenuItem[] => {
    return staticBaseMenuItems.map(item => {
      const { iconName, ...menuItemProps } = item; 
      const IconComponent = iconName ? iconComponents[iconName] : null;
      const mobileIcon = iconName ? mobileIconImages[iconName] : undefined;
      return {
        ...menuItemProps, 
        icon: IconComponent ? <IconComponent size={16} className="mr-2" /> : undefined,
        mobileIcon,
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
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
