
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save } from 'lucide-react';

// In a real app, you'd have a proper API for this
const SETTINGS_STORAGE_KEY = 'pet_serpentes_admin_settings';

interface Settings {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  orderConfirmationEmail: string;
  minimumOrderValue: number;
}

const defaultSettings: Settings = {
  whatsappNumber: '5521999999999', // Default value, format: country+number
  whatsappDefaultMessage: 'Olá! Acabei de realizar a compra do [NOME DO ANIMAL] no site PetSerpentes. Este é o comprovante/link que recebi: [URL DO PAGAMENTO]. Aguardando confirmação. Obrigado!',
  orderConfirmationEmail: 'contato@petserpentes.com',
  minimumOrderValue: 100,
};

const Settings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: 'Erro ao carregar configurações',
        description: 'As configurações não puderam ser carregadas. Usando valores padrão.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações foram salvas com sucesso.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: 'As configurações não puderam ser salvas.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp</CardTitle>
              <CardDescription>
                Configure o número e mensagem padrão do WhatsApp para contato após a compra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={handleChange}
                  placeholder="5521999999999"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Formato: código do país + DDD + número (ex: 5521999999999)
                </p>
              </div>

              <div>
                <Label htmlFor="whatsappDefaultMessage">Mensagem Padrão</Label>
                <textarea
                  id="whatsappDefaultMessage"
                  name="whatsappDefaultMessage"
                  value={settings.whatsappDefaultMessage}
                  onChange={handleChange}
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Digite a mensagem que será enviada..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use [NOME DO ANIMAL] e [URL DO PAGAMENTO] como marcadores que serão substituídos automaticamente
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-commerce</CardTitle>
              <CardDescription>
                Configure preferências gerais para vendas online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderConfirmationEmail">E-mail para Cópia de Confirmações</Label>
                <Input
                  id="orderConfirmationEmail"
                  name="orderConfirmationEmail"
                  type="email"
                  value={settings.orderConfirmationEmail}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  E-mail que receberá cópias das confirmações de pagamento
                </p>
              </div>

              <div>
                <Label htmlFor="minimumOrderValue">Valor Mínimo para Compra (R$)</Label>
                <Input
                  id="minimumOrderValue"
                  name="minimumOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.minimumOrderValue}
                  onChange={handleChange}
                  placeholder="100"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Valor mínimo para aceitar pedidos (0 para desativar)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
