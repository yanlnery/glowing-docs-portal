import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Updated import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updatePassword, isLoading } = useAuth(); // uses updated import
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasSession, setHasSession] = useState(false); // This state can be used to conditionally render the form

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setHasSession(true); 
      }
      // If the session becomes null or user logs out, it means recovery is no longer active
      if (!session) {
        setHasSession(false);
      }
    });
    
    // Check current session on mount to see if already in recovery mode
    supabase.auth.getSession().then(({ data }) => {
        // A password recovery "session" doesn't give full access, it's specific for `updateUser`
        // We can assume if there is a session and the current URL indicates password recovery,
        // it's likely a recovery context. Or rely on PASSWORD_RECOVERY event.
        // For now, the PASSWORD_RECOVERY event is the most reliable indicator.
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


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

    const { error } = await updatePassword(password);
    if (error) {
      toast({ title: 'Erro ao Redefinir Senha', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Senha Redefinida!', description: 'Sua senha foi alterada com sucesso. Faça login com sua nova senha.' });
      // It's good practice to also sign the user out after password update to ensure clean session
      await supabase.auth.signOut(); 
      navigate('/login');
    }
  };
  
  // Conditionally render the form only if `hasSession` is true, or show a message.
  // For simplicity, we'll keep showing the form, but this logic can be expanded.

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/4d77b820-b366-45b8-b64b-1568abded363.png" 
            alt="PET SERPENTES" 
            className="w-20 h-20 mx-auto mb-4 rounded-full" 
          />
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>Crie uma nova senha para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Redefinir Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
