
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidebarNavItem from './SidebarNavItem';
import { SidebarLinkDef } from './sidebar.types';

interface SidebarNavigationProps {
  items: SidebarLinkDef[];
  onLinkClick: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ items, onLinkClick }) => {
  const location = useLocation();

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="py-4 px-2">
        <div className="text-xs font-medium text-serpente-200 md:text-muted-foreground px-3 py-2">
          DOCUMENTATION
        </div>
        <div className="space-y-1">
          {items.map((item, i) => (
            <SidebarNavItem
              key={i}
              item={item}
              isActive={
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href + '/')) || // for parent active state
                (item.children?.some(child => location.pathname === child.href || (child.href !== "/" && location.pathname.startsWith(child.href + '/'))) ?? false)
              }
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default SidebarNavigation;
