import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Book, Syringe, FileText, Users, Phone, Settings, ShoppingCart, ListChecks } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function Sidebar() {
  const links: NavLinkProps[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/products", label: "Produtos", icon: Syringe },
    { href: "/admin/species", label: "Espécies Criadas", icon: FileText },
    { href: "/admin/manuals", label: "Manuais", icon: Book },
    { href: "/admin/waitlist", label: "Lista de Espera", icon: ListChecks },
    { href: "/admin/contact-submissions", label: "Contatos", icon: Phone },
    { href: "/admin/cart-analytics", label: "Carrinho", icon: ShoppingCart },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ];
  
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-background py-4 md:block">
      <div className="px-6 pb-4">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          Painel Administrativo
        </NavLink>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6">
        <ul className="space-y-1">
          {
            links.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                      isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                    )
                  }
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))
          }
        </ul>
      </div>
      
      <div className="border-t px-6 py-4">
        <Button variant="outline" className="w-full">
          <a href="/" target="_blank" rel="noopener noreferrer">
            Ver Loja
          </a>
        </Button>
      </div>
    </aside>
  );
}
