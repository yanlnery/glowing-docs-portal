import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ProfileForm: React.FC<{
  profile: Profile | null;
}> = ({ profile }) => {
  const { updateProfile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Update local state when profile prop changes
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    try {
      const { error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
      });
      
      if (error) {
        setFormError(error.message || "Erro ao atualizar perfil");
        toast({ 
          title: "Erro ao atualizar perfil", 
          description: error.message || "Não foi possível salvar suas informações", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Perfil atualizado!", 
          description: "Suas informações foram salvas com sucesso." 
        });
        // Refresh profile data to ensure we have the latest
        await refreshProfile();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao atualizar perfil";
      setFormError(errorMessage);
      toast({ 
        title: "Erro ao atualizar perfil", 
        description: errorMessage,
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar autenticado para editar seu perfil.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            value={user?.email || ''} 
            readOnly 
            disabled 
            className="bg-muted/50" 
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Informações Pessoais'}
        </Button>
      </div>
    </form>
  );
};
