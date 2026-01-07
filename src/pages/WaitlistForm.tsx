import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { waitlistService } from '@/services/waitlistService';

const WaitlistForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [phoneNotifications, setPhoneNotifications] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine contact preference based on checkboxes
      const contactPreference = emailNotifications && phoneNotifications ? 'both' : 'email';
      
      const { error } = await waitlistService.addToWaitlist({
        name,
        email,
        phone,
        contact_preference: contactPreference
      });

      if (error) throw error;

      toast({
        title: "Inscrição realizada!",
        description: "Você foi adicionado à lista de espera com sucesso.",
      });

      // Navigate to confirmation page
      navigate('/confirmacao-inscricao');
    } catch (error) {
      toast({
        title: "Erro ao fazer inscrição",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-xl mx-auto py-12 px-4 md:px-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Lista de Espera</CardTitle>
          <CardDescription>
            Entre para a lista de espera da Pet Serpentes Academy e seja notificado quando novas vagas estiverem disponíveis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome completo</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">E-mail</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Celular</label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(DDD) 99999-9999"
                required
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium">Plano de interesse</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between ${
                    selectedPlan === 'premium' 
                      ? 'border-serpente-500 bg-serpente-50 dark:bg-serpente-900/20' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedPlan('premium')}
                >
                  <div>
                    <h3 className="font-medium">Premium</h3>
                    <p className="text-sm text-muted-foreground">R$9,90/mês</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full ${
                    selectedPlan === 'premium' ? 'bg-serpente-500' : 'border'
                  }`} />
                </div>
                <div 
                  className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between ${
                    selectedPlan === 'professional' 
                      ? 'border-serpente-500 bg-serpente-50 dark:bg-serpente-900/20' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedPlan('professional')}
                >
                  <div>
                    <h3 className="font-medium">Professional</h3>
                    <p className="text-sm text-muted-foreground">R$27,90/mês</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full ${
                    selectedPlan === 'professional' ? 'bg-serpente-500' : 'border'
                  }`} />
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emailNotifications" 
                  checked={emailNotifications} 
                  onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                />
                <label 
                  htmlFor="emailNotifications" 
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Quero receber notificações por e-mail
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="phoneNotifications" 
                  checked={phoneNotifications} 
                  onCheckedChange={(checked) => setPhoneNotifications(checked as boolean)}
                />
                <label 
                  htmlFor="phoneNotifications" 
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Quero receber notificações por celular
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="marketingConsent" 
                  checked={marketingConsent} 
                  onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                />
                <label 
                  htmlFor="marketingConsent" 
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Desejo receber novidades e atualizações do Pet Serpentes Academy
                </label>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Entrar para a Lista de Espera"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-center text-xs text-muted-foreground">
          <p>
            Ao se inscrever, você concorda com nossa{' '}
            <Link to="/politica-de-privacidade" className="hover:underline text-serpente-600">Política de Privacidade</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WaitlistForm;
