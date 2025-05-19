
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin, adminLoginLoading, isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isAdminLoggedIn, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await adminLogin(email, password);
    if (error) {
      toast({
        title: "Falha no login",
        description: error.message || "Usuário ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
      // Navigation is handled by onAuthStateChange in AdminAuthContext
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png" 
            alt="PET SERPENTES" 
            className="w-20 h-20 mx-auto mb-4" 
          />
          <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
          <CardDescription>Faça login para acessar o painel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={adminLoginLoading}
            >
              {adminLoginLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-center text-sm">
          <p className="text-muted-foreground">
            Este é o painel de administração.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
