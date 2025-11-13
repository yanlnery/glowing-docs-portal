
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from './menuItem.type';

interface MobileNavigationProps {
  menuItems: MenuItem[];
  isActive: (path: string) => boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function MobileNavigation({ menuItems, isActive, setIsMenuOpen }: MobileNavigationProps) {
  const { isAuthenticated, logout } = useAuth();
  const cartQuantity = useCartStore(state => state.getTotalItems());
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logout realizado", description: "Você foi desconectado." });
      navigate("/");
    }
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 top-16 z-[100] bg-black text-white md:hidden animate-fade-in mobile-nav h-[calc(100vh-4rem)] overflow-y-auto pb-8">
      <nav className="container py-4 h-full px-4">
        
        {/* Header actions moved to top with improved layout */}
        <div className="border-b border-gray-700 pb-4 mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] flex-1 justify-start" asChild>
                    <Link to="/area-cliente" onClick={handleLinkClick} className="flex items-center">
                      <User size={20} className="mr-2" />
                      Área do Cliente
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] min-w-[44px] px-3" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span className="sr-only">Sair</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] flex-1 justify-start" asChild>
                  <Link to="/login" onClick={handleLinkClick} className="flex items-center">
                    <User size={20} className="mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] min-w-[44px] px-3 relative" asChild>
                <Link to="/carrinho" onClick={handleLinkClick}>
                  <ShoppingCart size={20} />
                  {cartQuantity > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-serpente-600 text-white">
                      {cartQuantity}
                    </Badge>
                  )}
                  <span className="sr-only">Carrinho</span>
                </Link>
              </Button>
              
              <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation menu */}
        <ul className="flex flex-col space-y-2">
          {menuItems
            .filter(item => item.path !== '/academy') // Hide Academy on mobile
            .map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={cn(
                  "flex w-full rounded-md p-4 text-base font-medium min-h-[44px] items-center text-white", 
                  isActive(item.path)
                    ? "bg-serpente-700 text-white"
                    : "hover:bg-gray-800" 
                )}
                onClick={handleLinkClick}
              >
                {item.icon && React.cloneElement(item.icon as React.ReactElement, { className: "mr-3 h-5 w-5", color: "white" })}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
