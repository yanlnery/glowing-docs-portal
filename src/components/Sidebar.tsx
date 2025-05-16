import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, ExternalLink, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: SidebarItemProps[];
  isExternal?: boolean;
}

const sidebarItems: SidebarItemProps[] = [
  {
    title: "Introduction",
    href: "/",
    icon: <div className="w-1.5 h-1.5 rounded-full bg-serpente-50" />
  },
  {
    title: "Getting Started",
    href: "/getting-started",
    icon: <div className="w-1.5 h-1.5 rounded-full bg-serpente-50" />,
    children: [
      {
        title: "Installation",
        href: "/getting-started#installation"
      },
      {
        title: "Configuration",
        href: "/getting-started#configuration"
      }
    ]
  },
  {
    title: "API Reference",
    href: "/api",
    icon: <div className="w-1.5 h-1.5 rounded-full bg-serpente-50" />,
    children: [
      {
        title: "Authentication",
        href: "/api/auth"
      },
      {
        title: "Endpoints",
        href: "/api/endpoints"
      },
      {
        title: "Response Codes",
        href: "/api/codes"
      }
    ]
  },
  {
    title: "Examples",
    href: "/examples",
    icon: <div className="w-1.5 h-1.5 rounded-full bg-serpente-50" />
  },
  {
    title: "GitHub",
    href: "https://github.com/pet-serpentes",
    icon: <ExternalLink size={14} />,
    isExternal: true
  }
];

const SidebarItem: React.FC<{ 
  item: SidebarItemProps, 
  isActive: boolean,
  onLinkClick?: () => void 
}> = ({ item, isActive, onLinkClick }) => {
  const [expanded, setExpanded] = useState(isActive && item.children?.some(child => child.href === useLocation().pathname));
  const location = useLocation();

  const handleToggle = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const handleClick = () => {
    if (!item.children && onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={item.href}
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md text-sm",
          isActive 
            ? "bg-accent text-accent-foreground font-medium" 
            : "text-gray-200 md:text-foreground/70 hover:text-white md:hover:text-foreground hover:bg-accent/50",
          item.isExternal && "text-gray-300 md:text-foreground/60 hover:text-gray-100 md:hover:text-foreground/90"
        )}
        onClick={(e) => {
          if (item.children) handleToggle(e);
          else handleClick();
        }}
        target={item.isExternal ? "_blank" : undefined}
        rel={item.isExternal ? "noopener noreferrer" : undefined}
      >
        <div className="flex items-center gap-2">
          {item.icon && <span>{item.icon}</span>}
          <span>{item.title}</span>
          {item.isExternal && <ExternalLink size={12} className="ml-1" />}
        </div>
        {item.children && (
          <div className="text-gray-400 md:text-foreground/50">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </Link>

      {expanded && item.children && (
        <div className="ml-4 pl-2 border-l border-border/50 mt-1 space-y-1">
          {item.children.map((child, i) => (
            <Link
              key={i}
              to={child.href}
              className={cn(
                "flex items-center py-1.5 px-2 rounded-md text-sm",
                child.href === location.pathname
                  ? "text-white md:text-foreground font-medium bg-accent/50"
                  : "text-gray-300 md:text-foreground/60 hover:text-white md:hover:text-foreground hover:bg-accent/30"
              )}
              onClick={onLinkClick}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed z-40 left-4 top-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={22} />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 transition-transform duration-300",
          "bg-serpente-700 md:bg-sidebar",
          "border-r border-serpente-600 md:border-sidebar-border",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className={cn(
          "flex items-center justify-between h-16 px-4 border-b",
          "border-serpente-600 md:border-sidebar-border"
        )}>
          <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <img 
              src="/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png" 
              alt="PET SERPENTES" 
              className="h-10 w-10 rounded-full"
            />
            <div className="font-medium">
              <div className="text-sm font-bold text-white md:text-foreground">PET SERPENTES</div>
              <div className="text-xs text-serpente-200 md:text-muted-foreground">Documentation</div>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-white/10"
            onClick={closeSidebar}
          >
            <X size={18} />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-4rem)] py-4 px-2">
          <div className="space-y-4 px-2">
            <div className="text-xs font-medium text-serpente-200 md:text-muted-foreground px-3 py-2">
              DOCUMENTATION
            </div>
            <div className="space-y-1">
              {sidebarItems.map((item, i) => (
                <SidebarItem
                  key={i}
                  item={item}
                  isActive={
                    location.pathname === item.href ||
                    (item.children?.some(child => location.pathname === child.href) ?? false)
                  }
                  onLinkClick={closeSidebar}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
