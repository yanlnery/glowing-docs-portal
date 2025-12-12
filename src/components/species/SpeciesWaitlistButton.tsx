import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Species } from '@/types/species';
import { SpeciesWaitlistForm } from './SpeciesWaitlistForm';

interface SpeciesWaitlistButtonProps {
  species: Species;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function SpeciesWaitlistButton({ 
  species, 
  variant = 'default',
  size = 'default',
  className 
}: SpeciesWaitlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Bell className="w-4 h-4 mr-2" />
        Quero ser avisado
      </Button>

      <SpeciesWaitlistForm
        species={species}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
