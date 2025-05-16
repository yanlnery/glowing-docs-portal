
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    setIsSessionLoading(true);
    setAuthError(null);

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        const authUser = currentSession?.user ?? null;
        setUser(authUser);
        setAuthError(null); // Limpa o erro de autenticação na mudança de estado

        // A lógica de carregamento do perfil será tratada separadamente,
        // mas precisamos garantir que isSessionLoading seja definido como false.
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (!authUser) { // Se não houver usuário autenticado após esses eventos, paramos o carregamento.
            setIsSessionLoading(false);
          }
          // Se houver usuário, isSessionLoading será tratado após o fetch do perfil no AuthProvider/useUserProfile
        } else if (event === 'SIGNED_OUT') {
          setIsSessionLoading(false);
        } else if (event === 'PASSWORD_RECOVERY') {
          setIsSessionLoading(false);
        } else {
          // Para outros eventos, garanta que o carregamento seja falso se não houver usuário
           if (!authUser) setIsSessionLoading(false);
        }
      }
    );

    const fetchInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession?.user) {
          setIsSessionLoading(false); // Se não houver sessão inicial, paramos o carregamento
        }
        // Se houver sessão, o onAuthStateChange com INITIAL_SESSION será acionado
        // e o carregamento será tratado após o fetch do perfil.
      } catch (error) {
        setAuthError(error as AuthError);
        setIsSessionLoading(false);
      }
    };

    fetchInitialSession();

    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, []);

  return { user, session, isSessionLoading, authError, setIsSessionLoading };
};
