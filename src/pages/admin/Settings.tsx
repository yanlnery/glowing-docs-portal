
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/hooks/useSettings';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const isAcademyVisible = settings.isAcademyVisible;

  const handleAcademyToggle = (checked: boolean) => {
    updateSettings({ isAcademyVisible: checked });
    toast({
      title: checked ? "Academy ativado" : "Academy desativado",
      description: checked 
        ? "A página Academy agora está visível no site." 
        : "A página Academy foi ocultada do site.",
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
            {/* Adicionar aqui outros toggles de configuração se necessário */}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
