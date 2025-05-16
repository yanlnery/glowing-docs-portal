
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarLinkDef } from './sidebar.types';

interface SidebarNavItemProps {
  item: SidebarLinkDef;
  isActive: boolean;
  onLinkClick?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive, onLinkClick }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(isActive && (item.children?.some(child => child.href === location.pathname || location.pathname.startsWith(child.href + '/')) ?? false));

  const handleToggle = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };
  
  const effectiveIsActive = isActive || (item.href !== "/" && location.pathname.startsWith(item.href));


  return (
    <div className="mb-1">
      <Link
        to={item.href}
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md text-sm",
          effectiveIsActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-serpente-100 md:text-foreground/70 hover:text-white md:hover:text-foreground hover:bg-accent/50",
          item.isExternal && "text-serpente-200 md:text-foreground/60 hover:text-serpente-50 md:hover:text-foreground/90"
        )}
        onClick={(e) => {
          if (item.children) handleToggle(e);
          handleClick();
        }}
        target={item.isExternal ? "_blank" : undefined}
        rel={item.isExternal ? "noopener noreferrer" : undefined}
      >
        <div className="flex items-center gap-2">
          {item.icon && <span>{item.icon}</span>}
          <span>{item.title}</span>
        </div>
        {item.children && (
          <div className="text-serpente-300 md:text-foreground/50">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </Link>

      {expanded && item.children && (
        <div className="ml-4 pl-2 border-l border-serpente-500 md:border-border/50 mt-1 space-y-1">
          {item.children.map((child, i) => (
            <Link
              key={i}
              to={child.href}
              className={cn(
                "flex items-center py-1.5 px-2 rounded-md text-sm",
                location.pathname === child.href || (child.href !== "/" && location.pathname.startsWith(child.href + '/'))
                  ? "text-white md:text-foreground font-medium bg-accent/50"
                  : "text-serpente-200 md:text-foreground/60 hover:text-white md:hover:text-foreground hover:bg-accent/30"
              )}
              onClick={onLinkClick} // Ensure mobile sidebar closes on child link click too
            >
              <div className="flex items-center gap-2">
                {child.icon && <span>{child.icon}</span>}
                <span>{child.title}</span>
                {child.isExternal && <ExternalLink size={12} className="ml-1 opacity-70" />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarNavItem;
