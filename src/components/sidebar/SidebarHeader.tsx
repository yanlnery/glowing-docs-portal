
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  return (
    <div className={cn(
      "flex items-center justify-between h-16 px-4 border-b",
      "border-serpente-600 md:border-sidebar-border"
    )}>
      <Link to="/" className="flex items-center gap-2" onClick={onClose}>
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
        className="md:hidden text-serpente-50 hover:bg-serpente-600/80 focus-visible:ring-serpente-500"
        onClick={onClose}
      >
        <X size={18} />
        <span className="sr-only">Close sidebar</span>
      </Button>
    </div>
  );
};

export default SidebarHeader;
