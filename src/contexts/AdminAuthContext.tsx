import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Session, AuthError, User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  isVerifiedAdmin: boolean;
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
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState<boolean>(false);
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is an admin route
  const isAdminRoute = useCallback((path: string) => {
    return path.startsWith('/admin');
  }, []);

  // Verify admin role from database
  const verifyAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error verifying admin role:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Failed to verify admin role:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting admin session:", error);
      }
      
      setAdminSession(session);
      setAdminUser(session?.user ?? null);

      // Only verify admin role if on admin route
      if (session?.user && isAdminRoute(location.pathname)) {
        const isAdmin = await verifyAdminRole(session.user.id);
        setIsVerifiedAdmin(isAdmin);
        
        // Only redirect to dashboard if verified admin and on login page
        if (isAdmin && (location.pathname === '/admin' || location.pathname === '/admin/login')) {
          navigate('/admin/dashboard', { replace: true });
        }
      } else if (session?.user) {
        // User is logged in but not on admin route - just track session without verifying admin
        setIsVerifiedAdmin(false);
      } else {
        setIsVerifiedAdmin(false);
      }
      
      setAdminLoginLoading(false);
    };
    getSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
      setAdminUser(session?.user ?? null);
      
      const currentPath = location.pathname;
      const onAdminRoute = isAdminRoute(currentPath);
      
      if (_event === 'SIGNED_IN' && session?.user) {
        // Only verify admin role if on admin routes
        if (onAdminRoute) {
          setTimeout(async () => {
            const isAdmin = await verifyAdminRole(session.user.id);
            setIsVerifiedAdmin(isAdmin);
            setAdminLoginLoading(false);
            
            if (isAdmin) {
              if (currentPath === '/admin' || currentPath === '/admin/login') {
                const from = location.state?.from?.pathname || "/admin/dashboard";
                navigate(from, { replace: true });
              }
            } else {
              // Not an admin trying to access admin area - sign out and show error
              toast({ 
                title: "Acesso Negado", 
                description: "Você não tem permissão de administrador.", 
                variant: "destructive" 
              });
              supabase.auth.signOut();
            }
          }, 0);
        } else {
          // Not on admin route - don't verify admin role, don't sign out
          setIsVerifiedAdmin(false);
          setAdminLoginLoading(false);
        }
      } else if (_event === 'SIGNED_OUT') {
        setIsVerifiedAdmin(false);
        setAdminLoginLoading(false);
        // Only redirect to admin login if on protected admin route
        if (currentPath.startsWith('/admin/') && currentPath !== '/admin' && currentPath !== '/admin/login') {
          navigate('/admin', { replace: true });
        }
      } else {
        setAdminLoginLoading(false);
      }
    });

    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, [navigate, location, toast, verifyAdminRole, isAdminRoute]);

  const adminLogin = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setAdminLoginLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAdminLoginLoading(false);
      return { error };
    }
    
    // Verify admin role after successful authentication
    if (data.session?.user) {
      const isAdmin = await verifyAdminRole(data.session.user.id);
      
      if (!isAdmin) {
        // Sign out non-admin users trying to access admin panel
        await supabase.auth.signOut();
        setAdminLoginLoading(false);
        return { 
          error: { 
            message: 'Você não tem permissão de administrador.',
            name: 'AuthApiError',
            status: 403
          } as AuthError 
        };
      }
      
      setIsVerifiedAdmin(true);
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
    
    setAdminLoginLoading(false);
    return { error: null };
  };

  const adminLogout = async () => {
    setAdminLoginLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive"});
    }
    setIsVerifiedAdmin(false);
    setAdminLoginLoading(false);
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAdminLoggedIn: !!adminUser && !!adminSession && isVerifiedAdmin, 
      isVerifiedAdmin,
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
