import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Animais Disponíveis", href: "/catalogo" },
  { label: "P. S. Academy", href: "/academy", id: "academy" },
  { label: "Espécies Criadas", href: "/especies" },
  { label: "Manuais de Criação", href: "/manuais" },
  { label: "Quem Somos", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 44px) 32px)`,
    transition: { type: "spring" as const, stiffness: 20, restDelta: 2 },
  }),
  closed: {
    clipPath: "circle(24px at calc(100% - 44px) 32px)",
    transition: { delay: 0.2, type: "spring" as const, stiffness: 400, damping: 40 },
  },
};

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: { y: { stiffness: 1000 } },
  },
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
  const { settings } = useSettings();
  const isAcademyVisible = settings.isAcademyVisible;

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

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
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const visibleItems = navItems.filter((item) => {
    if (item.id === "academy") return isAcademyVisible;
    return true;
  });

  const isActive = (href: string) => location.pathname === href;

  return (
    <div ref={containerRef} className="md:hidden">
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        variants={sidebarVariants}
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl z-[60]",
          "flex flex-col justify-center px-8"
        )}
      >
        <motion.ul variants={listVariants} className="space-y-2">
          {visibleItems.map((item) => (
            <motion.li key={item.href} variants={itemVariants}>
              <Link
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 py-4 px-3 rounded-xl text-lg font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
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
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
