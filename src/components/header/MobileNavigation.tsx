
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
    <div className="fixed inset-0 top-16 z-50 bg-black text-white md:hidden animate-fade-in mobile-nav">
      <nav className="container py-8">
        <ul className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={cn(
                  "flex w-full rounded-md p-4 text-base font-medium min-h-[44px] items-center text-white", // Ensure text is white
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground" // Active state remains, accent-foreground is usually light
                    : "hover:bg-gray-800" // Hover on black background
                )}
                onClick={handleLinkClick}
              >
                {item.icon && React.cloneElement(item.icon as React.ReactElement, { className: "mr-2 h-5 w-5" })}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-4"> {/* Adjusted border color for black bg */}
          <div className="flex items-center gap-4 flex-wrap">
            {isAuthenticated ? (
              <>
                <Button variant="secondary" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/area-cliente" onClick={handleLinkClick}>
                    <User size={16} className="mr-2" />
                    Área do Cliente
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" className="min-h-[44px]" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" className="min-h-[44px]" asChild>
                <Link to="/login" onClick={handleLinkClick}>
                  <User size={16} className="mr-2" />
                  Login
                </Link>
              </Button>
            )}
            <Button variant="secondary" size="sm" className="min-h-[44px]" asChild>
              <Link to="/carrinho" onClick={handleLinkClick}>
                <ShoppingCart size={16} className="mr-2" />
                Carrinho
                {cartQuantity > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">{cartQuantity}</Badge> /* Ensure badge contrasts */
                )}
              </Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
