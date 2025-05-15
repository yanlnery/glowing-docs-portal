
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types/client";

export const ProfileForm: React.FC<{
  profile: Profile | null;
}> = ({ profile }) => {
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await updateProfile({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });
    
    if (error) {
      toast({ title: "Erro ao atualizar perfil", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
    }
  };
  
  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4">
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
            value={profile?.id || ''} 
            readOnly 
            disabled 
            className="bg-muted/50" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          Salvar Informações Pessoais
        </Button>
      </div>
    </form>
  );
};
