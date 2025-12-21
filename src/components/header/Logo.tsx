
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png"
        alt="Pet Serpentes"
        className="h-9 w-9 md:h-12 md:w-12 rounded-full object-contain mr-1.5 md:mr-2"
      />
      <span className="font-semibold text-lg md:text-xl">PET SERPENTES</span>
    </Link>
  );
}
