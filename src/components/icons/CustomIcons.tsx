import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const SnakeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg 
    width={size}
    height={size}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={2}
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    {/* Serpente em "S" suave com cabeça triangular e cauda afinando */}
    <path d="M5 5 L7 3 L9 5 Q13 5 13 9 Q13 13 9 13 Q5 13 5 17 Q5 21 9 21 L13 21 Q17 21 19 19" />
  </svg>
);

export const LizardIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg 
    width={size}
    height={size}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={2}
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    {/* Lagarto de perfil: cabeça, corpo horizontal, 4 patas, cauda longa curvada */}
    {/* Cabeça */}
    <path d="M2 11 L5 10 L6 11" />
    {/* Corpo principal */}
    <path d="M6 11 L14 11" />
    {/* Cauda longa curvada */}
    <path d="M14 11 Q18 11 20 14 Q21 16 22 18" />
    {/* Patas dianteiras */}
    <path d="M7 11 L5 14" />
    <path d="M9 11 L11 14" />
    {/* Patas traseiras */}
    <path d="M12 11 L10 14" />
    <path d="M14 11 L16 14" />
  </svg>
);
