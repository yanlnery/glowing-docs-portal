
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const fromCheckout = location.state?.fromCheckout === true;
  const from = fromCheckout ? "/carrinho" : (location.state?.from?.pathname || "/area-cliente");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await login(email, password);
    if (error) {
      toast({ title: 'Erro no Login', description: error.message, variant: 'destructive' });
    } else {
      toast({ 
        title: 'Login bem-sucedido!', 
        description: fromCheckout ? 'Agora você pode finalizar sua compra!' : 'Redirecionando...' 
      });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
           <img 
            src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png" 
            alt="PET SERPENTES" 
            className="w-20 h-20 mx-auto mb-4 rounded-full" 
          />
          <CardTitle className="text-2xl font-bold">
            {fromCheckout ? 'Faça login para continuar' : 'Acessar sua Conta'}
          </CardTitle>
          <CardDescription>
            {fromCheckout ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Após o login, você voltará ao carrinho
              </span>
            ) : (
              'Bem-vindo de volta! Faça login para continuar.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="text-sm text-right">
              <Link to="/forgot-password"className="font-medium text-primary hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p>Não tem uma conta?{' '}
            <Link 
              to="/signup" 
              state={fromCheckout ? { fromCheckout: true } : undefined}
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
