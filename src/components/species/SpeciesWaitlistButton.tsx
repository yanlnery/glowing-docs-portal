import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Loader2, Check, ShoppingBag } from 'lucide-react';
import { Species } from '@/types/species';
import { SpeciesWaitlistForm } from './SpeciesWaitlistForm';
import { useAuth } from '@/hooks/useAuth';
import { speciesWaitlistService } from '@/services/speciesWaitlistService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SpeciesWaitlistButtonProps {
  species: Species;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function SpeciesWaitlistButton({ 
  species, 
  variant = 'default',
  size = 'default',
  className 
}: SpeciesWaitlistButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, profile } = useAuth();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phone, setPhone] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [hasAvailableProducts, setHasAvailableProducts] = useState(false);

  const checkAvailableProducts = async (speciesId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('species_id', speciesId)
      .eq('visible', true)
      .eq('available', true)
      .limit(1);
    
    return (data?.length || 0) > 0;
  };

  const handleQuickRegister = async (userPhone: string) => {
    if (!user || !profile) return;
    
    setIsLoading(true);
    
    try {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Usuário';
      
      const { error } = await speciesWaitlistService.addToWaitlist({
        species_id: species.id,
        name: fullName,
        email: user.email || '',
        phone: userPhone,
        contact_preference: 'whatsapp',
      });

      if (error) {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao cadastrar. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      // Check if there are available products
      const hasProducts = await checkAvailableProducts(species.id);
      setHasAvailableProducts(hasProducts);
      
      toast({
        title: 'Cadastro realizado!',
        description: `Você será avisado quando houver ${species.commonname} disponível.`,
      });
      
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      navigate('/login', { 
        state: { 
          returnTo: 'waitlist', 
          speciesId: species.id,
          speciesName: species.commonname 
        } 
      });
      return;
    }

    // Authenticated but no phone - ask for phone
    if (!profile?.phone) {
      setShowPhoneDialog(true);
      return;
    }

    // Authenticated with phone - quick register
    await handleQuickRegister(profile.phone);
  };

  const handlePhoneSubmit = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: 'Telefone inválido',
        description: 'Por favor, insira um telefone válido.',
        variant: 'destructive',
      });
      return;
    }

    // Save phone to profile
    if (user) {
      await supabase
        .from('profiles')
        .update({ phone, updated_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    setShowPhoneDialog(false);
    await handleQuickRegister(phone);
  };

  const handleGoToCatalog = () => {
    setShowSuccessDialog(false);
    navigate(`/catalogo?species=${species.id}`);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Bell className="w-4 h-4 mr-2" />
        )}
        Quero ser avisado
      </Button>

      {/* Form for non-logged users who need full form */}
      <SpeciesWaitlistForm
        species={species}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Phone dialog for logged users without phone */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Informe seu telefone</DialogTitle>
            <DialogDescription>
              Para completar seu cadastro na lista de espera, precisamos do seu telefone para contato.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPhoneDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handlePhoneSubmit} disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success dialog with option to see available products */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cadastro realizado!</h3>
            <p className="text-muted-foreground mb-6">
              Você será avisado quando houver <strong>{species.commonname}</strong> disponível.
            </p>
            
            {hasAvailableProducts ? (
              <div className="space-y-3">
                <div className="bg-serpente-50 dark:bg-serpente-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-serpente-700 dark:text-serpente-300 mb-2">
                    🎉 Ótima notícia! Temos animais desta espécie disponíveis agora!
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowSuccessDialog(false)} className="flex-1">
                    Fechar
                  </Button>
                  <Button onClick={handleGoToCatalog} className="flex-1">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Ver Animais
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
                Fechar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
