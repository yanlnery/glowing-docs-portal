
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Defina o nome de usuário e senha do administrador aqui
// Idealmente, isso deveria vir de variáveis de ambiente, mas para simplicidade:
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "serpentes2024";

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminLoginLoading: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Verificar se há uma sessão de administrador salva
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        if (session.isAdmin && session.expiresAt > Date.now()) {
          setIsAdminLoggedIn(true);
        } else {
          // Se expirado, limpa a sessão
          localStorage.removeItem('admin_session');
        }
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    setAdminLoginLoading(true);
    
    try {
      // Simular um atraso para parecer uma verificação real
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Criar uma sessão de administrador válida por 24 horas
        const adminSession = {
          isAdmin: true,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        };
        
        localStorage.setItem('admin_session', JSON.stringify(adminSession));
        setIsAdminLoggedIn(true);
        return true;
      }
      
      return false;
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAdminLoggedIn(false);
    navigate('/admin');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAdminLoggedIn, 
      adminLoginLoading, 
      adminLogin,
      adminLogout 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
