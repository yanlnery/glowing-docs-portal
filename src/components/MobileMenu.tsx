import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/components/ui/use-toast";

import menuHomeIcon from "@/assets/icons/menu-home.png";
import menuSnakeIcon from "@/assets/icons/menu-snake.png";
import menuAcademyIcon from "@/assets/icons/menu-academy.png";
import menuLizardIcon from "@/assets/icons/menu-lizard.png";
import menuBookIcon from "@/assets/icons/menu-book.png";
import menuUsersIcon from "@/assets/icons/menu-users.png";
import menuPhoneIcon from "@/assets/icons/menu-phone.png";

const navItems = [
  { label: "Início", href: "/", icon: menuHomeIcon },
  { label: "Animais Disponíveis", href: "/catalogo", icon: menuSnakeIcon },
  { label: "P. S. Academy", href: "/academy", icon: menuAcademyIcon, id: "academy" },
  { label: "Espécies Criadas", href: "/especies", icon: menuLizardIcon },
  { label: "Manuais de Criação", href: "/manuais", icon: menuBookIcon },
  { label: "Quem Somos", href: "/sobre", icon: menuUsersIcon },
  { label: "Contato", href: "/contato", icon: menuPhoneIcon },
];

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
    transition: { type: "spring" as const, stiffness: 20, restDelta: 2 },
  }),
  closed: {
    clipPath: "circle(28px at calc(100% - 40px) 40px)",
    transition: { delay: 0.2, type: "spring" as const, stiffness: 400, damping: 40 },
  },
};

const itemVariants: Variants = {
  open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
  closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
};

const listVariants: Variants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { isAuthenticated, logout } = useAuth();
  const cartQuantity = useCartStore((state) => state.getTotalItems());
  const { toast } = useToast();
  const isAcademyVisible = settings.isAcademyVisible;

  useEffect(() => {
    setHeight(window.innerHeight);
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    if (isOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      if (isOpen) window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const visibleItems = navItems.filter((item) =>
    item.id === "academy" ? isAcademyVisible : true
  );

  const isActive = (href: string) => location.pathname === href;
  const close = () => setIsOpen(false);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logout realizado", description: "Você foi desconectado." });
      navigate("/");
    }
    close();
  };

  return (
    <div ref={containerRef} className="md:hidden">
      <motion.nav
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        custom={height}
        variants={sidebarVariants}
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-background text-foreground shadow-2xl z-[60]",
          "flex flex-col",
          !isOpen && "pointer-events-none"
        )}
      >
        {/* Topo: logo + fechar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/60 shrink-0">
          <Link to="/" onClick={close} className="flex items-center">
            <img
              src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png"
              alt="Pet Serpentes"
              className="h-8 w-8 rounded-full object-contain mr-2"
            />
            <span className="font-semibold text-base">PET SERPENTES</span>
          </Link>
          <button
            onClick={close}
            aria-label="Fechar menu"
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          {/* Ações */}
          <div className="flex items-center gap-2 mb-6">
            {isAuthenticated ? (
              <>
                <Button className="flex-1 justify-start gap-2 h-11" asChild>
                  <Link to="/area-cliente" onClick={close}>
                    <User size={18} />
                    Minha Conta
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11"
                  onClick={handleLogout}
                  aria-label="Sair"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <Button className="flex-1 justify-start gap-2 h-11" asChild>
                <Link to="/login" onClick={close}>
                  <User size={18} />
                  Entrar / Criar conta
                </Link>
              </Button>
            )}

            <Button variant="outline" size="icon" className="h-11 w-11 relative" asChild>
              <Link to="/carrinho" onClick={close} aria-label="Carrinho">
                <ShoppingCart size={18} />
                {cartQuantity > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {cartQuantity}
                  </Badge>
                )}
              </Link>
            </Button>

            <div className="h-11 w-11 flex items-center justify-center border border-border rounded-md">
              <ThemeToggle />
            </div>
          </div>

          {/* Separador MENU */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground uppercase tracking-wider">
                Menu
              </span>
            </div>
          </div>

          <motion.ul variants={listVariants} className="space-y-1">
            {visibleItems.map((item) => (
              <motion.li key={item.href} variants={itemVariants}>
                <Link
                  to={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 h-14 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-foreground hover:bg-muted/60"
                  )}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className={cn(
                      "w-11 h-11 object-contain shrink-0",
                      isActive(item.href) && "brightness-0 invert"
                    )}
                  />
                  <span className="leading-none">{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          <div className="pt-8 pb-4 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Pet Serpentes
            </p>
          </div>
        </div>
      </motion.nav>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[70] w-11 h-11 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
