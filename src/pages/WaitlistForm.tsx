
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";

const WaitlistForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotification, setEmailNotification] = useState(true);
  const [phoneNotification, setPhoneNotification] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, forneça um endereço de email válido.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate phone (simple validation for Brazilian numbers)
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, forneça um número de telefone válido no formato (XX) XXXXX-XXXX.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Save to localStorage for demo purposes (in a real app, this would go to a database)
    const waitlistData = {
      id: `waitlist-${Date.now()}`,
      name,
      email,
      phone,
      emailNotification,
      phoneNotification,
      marketingConsent,
      planType: selectedPlan,
      date: new Date().toISOString()
    };
    
    // Get existing waitlist or create new array
    const existingWaitlist = JSON.parse(localStorage.getItem('academy-waitlist') || '[]');
    localStorage.setItem('academy-waitlist', JSON.stringify([...existingWaitlist, waitlistData]));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Inscrição realizada!",
        description: "Você foi adicionado à nossa lista de espera com sucesso.",
      });
      navigate('/confirmacao-inscricao');
    }, 1500);
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Apply format based on length
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  return (
    <div className="container max-w-2xl py-12 px-4 sm:px-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Entre para a Lista de Espera</CardTitle>
          <CardDescription>
            Seja o primeiro a saber quando novas vagas da Pet Serpentes Academy estiverem disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome Completo*
                </label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email*
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Celular*
                </label>
                <Input
                  id="phone"
                  placeholder="(XX) XXXXX-XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Escolha seu plano</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  {/* Premium Plan */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer relative overflow-hidden transition-all ${
                      selectedPlan === 'premium' ? 'border-serpente-500 bg-serpente-50 dark:bg-serpente-900/20' : ''
                    }`}
                    onClick={() => setSelectedPlan('premium')}
                  >
                    {selectedPlan === 'premium' && (
                      <div className="absolute right-2 top-2">
                        <div className="bg-serpente-500 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">Plano Premium</h3>
                    <p className="text-2xl font-bold mt-2 mb-4">R$9,90<span className="text-sm text-gray-500">/mês</span></p>
                    <ul className="text-sm space-y-1 mb-6">
                      <li>• Acesso a conteúdo exclusivo</li>
                      <li>• Grupo de suporte dedicado</li>
                      <li>• Certificados de conclusão</li>
                    </ul>
                  </div>
                  
                  {/* Professional Plan */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer relative overflow-hidden transition-all ${
                      selectedPlan === 'professional' ? 'border-serpente-500 bg-serpente-50 dark:bg-serpente-900/20' : ''
                    }`}
                    onClick={() => setSelectedPlan('professional')}
                  >
                    {selectedPlan === 'professional' && (
                      <div className="absolute right-2 top-2">
                        <div className="bg-serpente-500 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">Plano Professional</h3>
                    <p className="text-2xl font-bold mt-2 mb-4">R$17,90<span className="text-sm text-gray-500">/mês</span></p>
                    <ul className="text-sm space-y-1 mb-6">
                      <li>• Tudo do Plano Premium</li>
                      <li>• Mentorias mensais exclusivas</li>
                      <li>• Acesso a arquivos para download</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Preferências de notificação</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-notifications" 
                      checked={emailNotification}
                      onCheckedChange={(checked) => setEmailNotification(!!checked)}
                    />
                    <label 
                      htmlFor="email-notifications"
                      className="text-sm leading-none cursor-pointer"
                    >
                      Quero receber notificações por e-mail
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="phone-notifications" 
                      checked={phoneNotification}
                      onCheckedChange={(checked) => setPhoneNotification(!!checked)}
                    />
                    <label 
                      htmlFor="phone-notifications"
                      className="text-sm leading-none cursor-pointer"
                    >
                      Quero receber notificações por celular
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="marketing-consent" 
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(!!checked)}
                    />
                    <label 
                      htmlFor="marketing-consent"
                      className="text-sm leading-none cursor-pointer"
                    >
                      Desejo receber novidades e atualizações do Pet Serpentes Academy
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-serpente-600 hover:bg-serpente-700" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Entrar para Lista de Espera"
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Ao entrar na lista de espera, você concorda com nossa{' '}
              <a href="/privacidade" className="text-serpente-600 hover:underline">
                Política de Privacidade
              </a>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistForm;
