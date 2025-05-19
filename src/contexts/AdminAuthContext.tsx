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
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(true);
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

      // Redirect logic based on session and current path
      if (session && (location.pathname === '/admin' || location.pathname === '/admin/login')) {
        navigate('/admin/dashboard', { replace: true });
      }
      // Protected route redirection is handled by AdminProtectedRoute
    };
    getSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      setAdminLoginLoading(false);
      
      const currentPath = location.pathname;
      if (_event === 'SIGNED_IN') {
        if (currentPath === '/admin' || currentPath === '/admin/login') {
           const from = location.state?.from?.pathname || "/admin/dashboard";
           navigate(from, { replace: true });
        }
      } else if (_event === 'SIGNED_OUT') {
        if (currentPath.startsWith('/admin/') && currentPath !== '/admin' && currentPath !== '/admin/login') {
          navigate('/admin', { replace: true });
        }
      }
    });

    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, [navigate, location, toast]);

  const adminLogin = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setAdminLoginLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    // The onAuthStateChange listener will handle setting session and user
    setAdminLoginLoading(false);
    if (!error && data.session) {
        // Explicitly navigate after successful login if onAuthStateChange doesn't cover all cases quickly
        // This helps ensure redirection even if onAuthStateChange is slightly delayed
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
    }
    return { error };
  };

  const adminLogout = async () => {
    setAdminLoginLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive"});
    }
    // onAuthStateChange handles navigation to /admin on SIGNED_OUT
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
