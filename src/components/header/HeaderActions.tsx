import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/components/ui/use-toast";

export default function HeaderActions() {
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
  };

  return (
    <div className="hidden md:flex items-center gap-2">
      {isAuthenticated ? (
        <>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/area-cliente">
              <User size={20} />
              <span className="sr-only">Área do Cliente</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
            <LogOut size={20} />
            <span className="sr-only">Sair</span>
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="icon" asChild>
          <Link to="/login">
            <User size={20} />
            <span className="sr-only">Login / Área do Cliente</span>
          </Link>
        </Button>
      )}
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
  );
}
