import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuthLinkType =
  | 'signup'
  | 'invite'
  | 'magiclink'
  | 'recovery'
  | 'email_change'
  | 'email';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get params from URL (Supabase may send token_hash+type OR code+type OR session tokens)
        const token_hash = searchParams.get('token_hash');
        const code = searchParams.get('code');
        const type = (searchParams.get('type') || undefined) as AuthLinkType | undefined;
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setErrorMessage(error_description || 'Ocorreu um erro durante a verificação.');
          return;
        }

        // Persist link type for downstream pages (e.g. /resetar-senha guard)
        if (type) {
          try {
            sessionStorage.setItem('supabase_auth_link_type', type);
          } catch {
            // ignore
          }
        }

        // 1) token_hash + type flow (OTP)
        if (token_hash && type) {
          console.log('[AuthCallback] verifyOtp', { type });
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (verifyError) {
            console.error('[AuthCallback] verifyOtp error', verifyError);
            setStatus('error');
            setErrorMessage(verifyError.message);
            return;
          }

          setStatus('success');

          // Never send recovery links to home/dashboard before password update
          setTimeout(() => {
            if (type === 'recovery') {
              navigate('/resetar-senha', { replace: true });
              return;
            }

            if (type === 'signup' || type === 'invite') {
              navigate('/login', { replace: true });
              return;
            }

            // magiclink/email/email_change: session is already handled by Supabase
            navigate('/', { replace: true });
          }, 500);
          return;
        }

        // 2) code + type flow (PKCE)
        if (code) {
          console.log('[AuthCallback] exchangeCodeForSession', { type });
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('[AuthCallback] exchangeCodeForSession error', exchangeError);
            setStatus('error');
            setErrorMessage(exchangeError.message);
            return;
          }

          setStatus('success');
          setTimeout(() => {
            if (type === 'recovery') {
              navigate('/resetar-senha', { replace: true });
              return;
            }
            if (type === 'signup' || type === 'invite') {
              navigate('/login', { replace: true });
              return;
            }
            navigate('/', { replace: true });
          }, 500);
          return;
        }

        // 3) Session token flow (e.g. access_token in hash). We must still respect type.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[AuthCallback] getSession error', sessionError);
          setStatus('error');
          setErrorMessage(sessionError.message);
          return;
        }

        if (!session) {
          setStatus('error');
          setErrorMessage('Link inválido ou expirado. Por favor, tente novamente.');
          return;
        }

        setStatus('success');
        setTimeout(() => {
          // CRITICAL: Recovery must always go to reset password page first.
          if (type === 'recovery') {
            navigate('/resetar-senha', { replace: true });
            return;
          }
          // Default behavior
          if (type === 'signup' || type === 'invite') {
            navigate('/login', { replace: true });
            return;
          }
          navigate('/', { replace: true });
        }, 500);
      } catch (err: any) {
        console.error('[AuthCallback] unexpected error', err);
        setStatus('error');
        setErrorMessage(err.message || 'Erro desconhecido');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png" 
            alt="PET SERPENTES" 
            className="w-20 h-20 mx-auto mb-4 rounded-full" 
          />
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Verificando...'}
            {status === 'success' && 'E-mail Confirmado!'}
            {status === 'error' && 'Erro na Verificação'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Aguarde enquanto verificamos seu e-mail...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-muted-foreground">
                Verificação concluída! Você será redirecionado em instantes...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-muted-foreground">{errorMessage}</p>
              <Button onClick={() => navigate('/login')} className="mt-4">
                Voltar para Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
