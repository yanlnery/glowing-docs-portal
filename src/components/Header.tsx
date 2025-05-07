
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X, ShoppingCart, User, Book, Box, FileText, Users, Phone, Syringe, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const cartQuantity = useCartStore(state => state.getCartQuantity());
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { title: "Início", path: "/", icon: <Home size={16} className="mr-2" /> },
    { title: "P. S. Academy", path: "/academy", icon: <Book size={16} className="mr-2" /> },
    { title: "Animais Disponíveis", path: "/catalogo", icon: <Syringe size={16} className="mr-2" /> },
    { title: "Espécies Criadas", path: "/especies", icon: <FileText size={16} className="mr-2" /> },
    { title: "Manuais de Criação", path: "/manuais", icon: <Book size={16} className="mr-2" /> },
    { title: "Quem Somos", path: "/sobre", icon: <Users size={16} className="mr-2" /> },
    { title: "Contato", path: "/contato", icon: <Phone size={16} className="mr-2" /> },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png" 
              alt="Pet Serpentes" 
              className="h-12 w-12 rounded-full object-contain mr-2" 
            />
            <span className="hidden md:inline-flex font-semibold text-xl">PET SERPENTES</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link 
                  to={item.path}
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.path) 
                      ? "bg-accent text-accent-foreground" 
                      : "text-foreground/60 hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Right-side Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/area-cliente">
                <User size={20} />
                <span className="sr-only">Área do Cliente</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/carrinho">
                <ShoppingCart size={20} />
                {cartQuantity > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {cartQuantity}
                  </Badge>
                )}
                <span className="sr-only">Carrinho</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur md:hidden">
          <nav className="container py-8">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex w-full rounded-md p-4 text-base font-medium text-foreground min-h-[44px] items-center",
                      isActive(item.path) 
                        ? "bg-accent text-accent-foreground" 
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/area-cliente" onClick={() => setIsMenuOpen(false)}>
                    <User size={16} className="mr-2" />
                    Área do Cliente
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/carrinho" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart size={16} className="mr-2" />
                    Carrinho
                    {cartQuantity > 0 && (
                      <Badge className="ml-2">{cartQuantity}</Badge>
                    )}
                  </Link>
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
