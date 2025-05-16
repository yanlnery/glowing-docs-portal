
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { MenuItem } from './menuItem.type';

interface DesktopNavigationProps {
  menuItems: MenuItem[];
  isActive: (path: string) => boolean;
}

export default function DesktopNavigation({ menuItems, isActive }: DesktopNavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <Link
              to={item.path}
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/60 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.title}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
