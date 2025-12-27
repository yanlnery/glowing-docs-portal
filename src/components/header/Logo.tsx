
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center">
      {/* Mobile: use original small logo */}
      <img
        src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png"
        alt="Pet Serpentes"
        className="h-9 w-9 rounded-full object-contain mr-1.5 md:hidden"
      />
      {/* Desktop: use high-quality logo, slightly larger */}
      <img
        src="/lovable-uploads/logo-hq.jpg"
        alt="Pet Serpentes"
        className="hidden md:block h-14 w-14 rounded-full object-cover mr-2"
      />
      <span className="font-semibold text-lg md:text-xl">PET SERPENTES</span>
    </Link>
  );
}
