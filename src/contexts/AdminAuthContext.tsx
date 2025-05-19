
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session, AuthError, User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminUser: User | null;
  adminSession: Session | null;
  adminLoginLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  adminLogout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(true); // Start as true until session is checked
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting admin session:", error);
        toast({ title: "Erro de Sessão", description: "Não foi possível verificar a sessão do administrador.", variant: "destructive" });
      }
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAdminLoginLoading(false);

      if (session && location.pathname === '/admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (!session && location.pathname.startsWith('/admin/') && location.pathname !== '/admin') {
        // If not logged in and trying to access a protected admin route, redirect to admin login
        // navigate('/admin', { replace: true, state: { from: location } });
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAdminLoginLoading(false);
      if (_event === 'SIGNED_IN' && location.pathname === '/admin') {
        navigate('/admin/dashboard', { replace: true });
      }
      if (_event === 'SIGNED_OUT') {
        navigate('/admin', { replace: true });
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [navigate, location, toast]);

  const adminLogin = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setAdminLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAdminLoginLoading(false);
    return { error };
  };

  const adminLogout = async () => {
    setAdminLoginLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive"});
    }
    setAdminLoginLoading(false);
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAdminLoggedIn: !!adminUser && !!adminSession, 
      adminUser,
      adminSession,
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
