
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
import { Menu, X, ShoppingCart, User, Book, Box, FileText, Users, Phone, Syringe } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { title: "Início", path: "/" },
    { title: "P. S. Academy", path: "/academy" },
    { title: "Animais Disponíveis", path: "/catalogo" },
    { title: "Espécies Criadas", path: "/especies" },
    { title: "Manuais de Criação", path: "/manuais" },
    { title: "Quem Somos", path: "/sobre" },
    { title: "Contato", path: "/contato" },
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
            <Button variant="ghost" size="icon" asChild>
              <Link to="/carrinho">
                <ShoppingCart size={20} />
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
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <nav className="container py-8">
            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex w-full rounded-md p-3 text-base font-medium",
                      isActive(item.path) 
                        ? "bg-accent text-accent-foreground" 
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/area-cliente" onClick={() => setIsMenuOpen(false)}>
                    <User size={16} className="mr-2" />
                    Área do Cliente
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/carrinho" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart size={16} className="mr-2" />
                    Carrinho
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
