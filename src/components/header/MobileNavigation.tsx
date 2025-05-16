
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
    <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur md:hidden animate-fade-in">
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
                onClick={handleLinkClick}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" className="min-h-[44px]" asChild>
                  <Link to="/area-cliente" onClick={handleLinkClick}>
                    <User size={16} className="mr-2" />
                    Área do Cliente
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="min-h-[44px]" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="min-h-[44px]" asChild>
                <Link to="/login" onClick={handleLinkClick}>
                  <User size={16} className="mr-2" />
                  Login
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" className="min-h-[44px]" asChild>
              <Link to="/carrinho" onClick={handleLinkClick}>
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
  );
}
