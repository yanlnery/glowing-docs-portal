import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const fromCheckout = location.state?.fromCheckout === true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'Erro', description: 'A senha deve ter pelo menos 8 caracteres.', variant: 'destructive'});
      return;
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
    }
     else {
      const isEmailConfirmationRequired = data?.user?.email_confirmed_at === null && data?.session === null;
      const redirectTo = fromCheckout ? '/carrinho' : '/login';

      if (isEmailConfirmationRequired) {
        toast({ title: 'Cadastro realizado!', description: 'Enviamos um e-mail de confirmação para você. Por favor, verifique sua caixa de entrada e spam.' });
        navigate(redirectTo);
      } else {
        toast({ title: 'Cadastro bem-sucedido!', description: fromCheckout ? 'Agora você pode finalizar sua compra!' : 'Você já pode fazer login.' });
        navigate(redirectTo);
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
            {fromCheckout ? 'Crie sua conta para continuar' : 'Criar sua Conta'}
          </CardTitle>
          <CardDescription>
            {fromCheckout ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Após o cadastro, você voltará ao carrinho
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
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
              state={fromCheckout ? { fromCheckout: true } : undefined}
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
