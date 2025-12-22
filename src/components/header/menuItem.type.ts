
import type React from 'react';

export interface MenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode; // Ícone usado no desktop
  mobileIcon?: string; // Imagem PNG para o menu mobile
  id?: string; // Para lógica condicional como 'academy'
}
