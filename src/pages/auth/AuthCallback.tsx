import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token_hash and type from URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setErrorMessage(error_description || 'Ocorreu um erro durante a verificação.');
          return;
        }

        if (token_hash && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'recovery' | 'email',
          });

          if (verifyError) {
            setStatus('error');
            setErrorMessage(verifyError.message);
            return;
          }

          setStatus('success');
          
          // Redirect after success
          setTimeout(() => {
            if (type === 'recovery') {
              navigate('/reset-password');
            } else {
              navigate('/login');
            }
          }, 3000);
        } else {
          // Check if we have a session (from OAuth or magic link)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            setStatus('error');
            setErrorMessage(sessionError.message);
            return;
          }

          if (session) {
            setStatus('success');
            setTimeout(() => navigate('/'), 2000);
          } else {
            setStatus('error');
            setErrorMessage('Link inválido ou expirado. Por favor, tente novamente.');
          }
        }
      } catch (err: any) {
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
                Seu e-mail foi confirmado com sucesso! Você será redirecionado em instantes...
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
