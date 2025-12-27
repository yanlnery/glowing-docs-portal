import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { downloadAnalyticsService } from '@/services/downloadAnalyticsService';
import PasswordRequirements, { validatePassword, getPasswordRequirements } from '@/components/auth/PasswordRequirements';
import { cn } from '@/lib/utils';

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const fromCheckout = location.state?.fromCheckout === true;
  const pendingDownload = location.state?.pendingDownload === true;
  const fromPath = location.state?.from || (fromCheckout ? "/carrinho" : "/manuais");

  const passwordValidation = validatePassword(password);
  const isPasswordInvalid = passwordTouched && !passwordValidation.valid;
  const isConfirmPasswordInvalid = confirmPasswordTouched && password !== confirmPassword;

  // Handle pending download after successful signup
  const handlePendingDownload = () => {
    const pendingData = sessionStorage.getItem("pending_manual_download");
    if (pendingData) {
      try {
        const { pdfUrl, title } = JSON.parse(pendingData);
        sessionStorage.removeItem("pending_manual_download");
        
        // Trigger download
        const link = document.createElement("a");
        link.href = pdfUrl;
        const filename = title
          .replace(/[^a-z0-9_ \-]/gi, "")
          .replace(/\s+/g, "-")
          .toLowerCase() + ".pdf";
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Track analytics
        downloadAnalyticsService.trackAuthComplete('signup');
        downloadAnalyticsService.trackDownloadStarted(title, 'authenticated');

        toast({
          title: "Download iniciado!",
          description: `O material "${title}" está sendo baixado.`,
        });
      } catch (e) {
        console.error("Error processing pending download:", e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark fields as touched on submit
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    
    if (password !== confirmPassword) {
      return; // Visual feedback via red border is enough
    }
    
    if (!passwordValidation.valid) {
      return; // Visual feedback via red border is enough
    }

    const { error, data } = await signup({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) {
      toast({ title: 'Erro no Cadastro', description: error.message, variant: 'destructive' });
    } else if (data?.user?.identities?.length === 0) {
      toast({ title: 'Erro no Cadastro', description: "Este e-mail já pode estar cadastrado mas não confirmado. Tente fazer login ou recuperar senha.", variant: 'destructive' });
    } else {
      const isEmailConfirmationRequired = data?.user?.email_confirmed_at === null && data?.session === null;

      if (isEmailConfirmationRequired) {
        toast({ 
          title: 'Cadastro realizado!', 
          description: 'Enviamos um e-mail de confirmação para você. Por favor, verifique sua caixa de entrada e spam.' 
        });
        // Keep pending download in session storage for when user confirms email
        navigate('/login', { state: pendingDownload ? { pendingDownload: true, from: fromPath } : undefined });
      } else {
        toast({ 
          title: 'Cadastro bem-sucedido!', 
          description: fromCheckout ? 'Agora você pode finalizar sua compra!' : 'Bem-vindo à Pet Serpentes!' 
        });
        
        // Handle any pending download
        handlePendingDownload();
        
        navigate(fromPath, { replace: true });
      }
    }
  };

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
            {fromCheckout ? 'Crie sua conta para continuar' : pendingDownload ? 'Crie sua conta para baixar' : 'Criar sua Conta'}
          </CardTitle>
          <CardDescription>
            {fromCheckout ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Após o cadastro, você voltará ao carrinho
              </span>
            ) : pendingDownload ? (
              <span className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                Após o cadastro, o download será iniciado automaticamente
              </span>
            ) : (
              'Junte-se à Pet Serpentes para uma experiência exclusiva.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Popover open={isPasswordFocused && password.length > 0}>
                <PopoverTrigger asChild>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      setPasswordTouched(true);
                    }}
                    className={cn(
                      isPasswordInvalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    required 
                  />
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80" 
                  side="top" 
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <PasswordRequirements password={password} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                onBlur={() => setConfirmPasswordTouched(true)}
                className={cn(
                  isConfirmPasswordInvalid && "border-destructive focus-visible:ring-destructive"
                )}
                required 
              />
              {isConfirmPasswordInvalid && (
                <p className="text-sm text-destructive">As senhas não coincidem.</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p>Já tem uma conta?{' '}
            <Link 
              to="/login" 
              state={fromCheckout ? { fromCheckout: true } : pendingDownload ? { pendingDownload: true, from: fromPath } : undefined}
              className="font-medium text-primary hover:underline"
            >
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
