
import type React from 'react';

export interface MenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode; // Ícone é usado principalmente no menu mobile
  id?: string; // Para lógica condicional como 'academy'
}
