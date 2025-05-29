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
      <nav className="container py-8 h-full px-4">
        <ul className="flex flex-col space-y-4">
          {menuItems.map((item) => (
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
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between border-t border-gray-700 pt-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:gap-2 flex-wrap">
            {isAuthenticated ? (
              <>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" asChild>
                  <Link to="/area-cliente" onClick={handleLinkClick} className="flex items-center">
                    <User size={20} className="mr-2" />
                    Área do Cliente
                  </Link>
                </Button>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" onClick={handleLogout}>
                  <LogOut size={20} className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" asChild>
                <Link to="/login" onClick={handleLinkClick} className="flex items-center">
                  <User size={20} className="mr-2" />
                  Login
                </Link>
              </Button>
            )}
            <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" asChild>
              <Link to="/carrinho" onClick={handleLinkClick} className="flex items-center">
                <ShoppingCart size={20} className="mr-2" />
                Carrinho
                {cartQuantity > 0 && (
                  <Badge className="ml-2 bg-serpente-600 text-white">{cartQuantity}</Badge>
                )}
              </Link>
            </Button>
          </div>
          <div className="self-center sm:self-auto mt-4 sm:mt-0">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}
