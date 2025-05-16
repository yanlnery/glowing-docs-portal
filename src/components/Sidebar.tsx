import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavigation from './sidebar/SidebarNavigation';
import { SidebarLinkDef } from './sidebar/sidebar.types';

// Sidebar items definition remains here as it's specific to this sidebar's content
const sidebarItems: SidebarLinkDef[] = [
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
        href: "/getting-started/installation" // Updated for better active state matching
      },
      {
        title: "Configuration",
        href: "/getting-started/configuration" // Updated for better active state matching
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
    icon: <ExternalLink size={14} className="opacity-80" />, // Added opacity for consistency
    isExternal: true
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Keep location here for isActive logic if needed, or rely on sub-components

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed z-50 left-4 top-4 text-foreground bg-background/80 hover:bg-accent hover:text-accent-foreground shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={22} />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out",
          "bg-serpente-700 md:bg-sidebar", // Retains mobile dark green background
          "border-r border-serpente-600 md:border-sidebar-border",
          "text-serpente-50 md:text-sidebar-foreground", // Base text color for sidebar
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 shadow-xl md:shadow-none"
        )}
        aria-label="Main navigation"
      >
        <SidebarHeader onClose={closeSidebar} />
        <SidebarNavigation items={sidebarItems} onLinkClick={closeSidebar} />
      </aside>
    </>
  );
}
