
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
  const cartQuantity = useCartStore(state => state.getCartQuantity());
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
    <div className="fixed inset-0 top-16 z-[100] bg-black text-white md:hidden animate-fade-in mobile-nav">
      <nav className="container py-8 h-full overflow-y-auto">
        <ul className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={cn(
                  "flex w-full rounded-md p-4 text-base font-medium min-h-[44px] items-center text-white", // Ensure min-h for touch target
                  isActive(item.path)
                    ? "bg-serpente-700 text-white"
                    : "hover:bg-gray-800" 
                )}
                onClick={handleLinkClick}
              >
                {item.icon && React.cloneElement(item.icon as React.ReactElement, { className: "mr-2 h-5 w-5", color: "white" })}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between border-t border-gray-700 pt-4 pb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:gap-2 flex-wrap">
            {isAuthenticated ? (
              <>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" asChild>
                  <Link to="/area-cliente" onClick={handleLinkClick}>
                    <User size={20} className="mr-2" /> {/* Increased icon size */}
                    Área do Cliente
                  </Link>
                </Button>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" onClick={handleLogout}>
                  <LogOut size={20} className="mr-2" /> {/* Increased icon size */}
                  Sair
                </Button>
              </>
            ) : (
              <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" asChild>
                <Link to="/login" onClick={handleLinkClick}>
                  <User size={20} className="mr-2" /> {/* Increased icon size */}
                  Login
                </Link>
              </Button>
            )}
            <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white min-h-[44px] w-full sm:w-auto justify-start sm:justify-center" asChild>
              <Link to="/carrinho" onClick={handleLinkClick}>
                <ShoppingCart size={20} className="mr-2" /> {/* Increased icon size */}
                Carrinho
                {cartQuantity > 0 && (
                  <Badge className="ml-2 bg-serpente-600 text-white">{cartQuantity}</Badge>
                )}
              </Link>
            </Button>
          </div>
          <div className="self-center sm:self-auto mt-4 sm:mt-0"> {/* Added margin top for mobile spacing if ThemeToggle is below */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}

