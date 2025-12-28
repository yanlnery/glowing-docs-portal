
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, X } from "lucide-react";
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

  // Robust scroll lock for iOS/Android
  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    
    // Save original styles
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;
    
    // Apply scroll lock
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    
    return () => {
      // Restore original styles
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      body.style.width = originalBodyWidth;
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);

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

  const menuContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-background text-foreground md:hidden animate-fade-in"
      style={{ isolation: 'isolate' }}
    >
      {/* Header fixo dentro do menu - sempre visível independente do scroll */}
      <div className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center" onClick={handleLinkClick}>
          <img
            src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png"
            alt="Pet Serpentes"
            className="h-9 w-9 rounded-full object-contain mr-1.5"
          />
          <span className="font-semibold text-lg">PET SERPENTES</span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-foreground hover:bg-accent transition-colors"
          aria-label="Fechar menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="container py-6 h-[calc(100%-4rem)] px-5 overflow-y-auto overscroll-contain">
        
        {/* Header actions - design mais elegante */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex-1">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button 
                  className="flex-1 justify-start gap-3 h-12 text-base font-medium"
                  asChild
                >
                  <Link to="/area-cliente" onClick={handleLinkClick}>
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    Minha Conta
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full justify-start gap-3 h-12 text-base font-medium"
                asChild
              >
                <Link to="/login" onClick={handleLinkClick}>
                  <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  Entrar / Criar conta
                </Link>
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground relative"
              asChild
            >
              <Link to="/carrinho" onClick={handleLinkClick}>
                <ShoppingCart size={20} />
                {cartQuantity > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground font-bold">
                    {cartQuantity}
                  </Badge>
                )}
              </Link>
            </Button>
            
            <div className="h-12 w-12 flex items-center justify-center border border-border rounded-md bg-background">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Separador elegante */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">Menu</span>
          </div>
        </div>

        {/* Navigation menu - design limpo */}
        <ul className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex w-full rounded-xl px-4 h-14 text-sm font-sans tracking-wide items-center transition-all duration-200", 
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-foreground hover:bg-muted/50" 
                  )}
                  onClick={handleLinkClick}
                >
                  {item.mobileIcon && (
                    <div className="w-10 h-10 mr-4 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={item.mobileIcon} 
                        alt="" 
                        className={cn(
                          "w-10 h-10 object-contain transition-all",
                          isActive(item.path) 
                            ? "brightness-0 invert" 
                            : ""
                        )}
                      />
                    </div>
                  )}
                  <span className="leading-none">{item.title}</span>
                </Link>
            </li>
          ))}
        </ul>

        {/* Footer com branding */}
        <div className="mt-auto pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pet Serpentes
          </p>
        </div>
      </nav>
    </div>
  );

  // Render via portal to escape any stacking context issues
  return createPortal(menuContent, document.body);
}
