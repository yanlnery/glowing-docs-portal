import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const isAcademyVisible = settings.isAcademyVisible;
  const isAcademyOpenForSubscription = settings.isAcademyOpenForSubscription;

  const handleAcademyToggle = (checked: boolean) => {
    updateSettings({ isAcademyVisible: checked });
    toast({
      title: checked ? "Academy ativado" : "Academy desativado",
      description: checked 
        ? "A página Academy agora está visível no site." 
        : "A página Academy foi ocultada do site.",
    });
  };

  const handleSubscriptionModeToggle = (checked: boolean) => {
    updateSettings({ isAcademyOpenForSubscription: checked });
    toast({
      title: checked ? "Assinaturas abertas" : "Lista de espera ativada",
      description: checked 
        ? "Os usuários agora podem assinar a Academy diretamente." 
        : "Os usuários serão direcionados para a lista de espera.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configurações do Site</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visibilidade de Páginas</CardTitle>
            <CardDescription>
              Controle quais páginas estão visíveis no site público.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="academy-visibility">P.S. Academy</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar/desativar a exibição da página Academy no site.
                </p>
              </div>
              <Switch 
                id="academy-visibility" 
                checked={isAcademyVisible}
                onCheckedChange={handleAcademyToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Modo de Inscrição da Academy
              <Badge variant={isAcademyOpenForSubscription ? "default" : "secondary"}>
                {isAcademyOpenForSubscription ? "Assinaturas Abertas" : "Lista de Espera"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Controle se a Academy está aberta para assinaturas ou em modo de lista de espera.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="subscription-mode">Abrir para Assinaturas</Label>
                <p className="text-sm text-muted-foreground">
                    {isAcademyOpenForSubscription 
                    ? 'Os visitantes podem assinar diretamente via Stripe (R$27,90/mês).' 
                    : 'Os visitantes são direcionados para a lista de espera.'}
                </p>
              </div>
              <Switch 
                id="subscription-mode" 
                checked={isAcademyOpenForSubscription}
                onCheckedChange={handleSubscriptionModeToggle}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
