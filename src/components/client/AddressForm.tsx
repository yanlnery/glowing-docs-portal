
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Address } from "@/types/client";
import { useAuth } from "@/contexts/AuthContext";

export const AddressForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({});
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchAddress();
    }
  }, [user]);
  
  const fetchAddress = async () => {
    if (!user) return;
    
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (addressError) {
      toast({ title: "Erro ao buscar endereços", description: addressError.message, variant: "destructive" });
    } else if (addressData && addressData.length > 0) {
      const defaultAddress = addressData.find(a => a.is_default) || addressData[0];
      setCurrentAddress(defaultAddress);
      setStreet(defaultAddress.street);
      setNumber(defaultAddress.number);
      setComplement(defaultAddress.complement || '');
      setNeighborhood(defaultAddress.neighborhood);
      setCity(defaultAddress.city);
      setState(defaultAddress.state);
      setZipcode(defaultAddress.zipcode);
    } else {
      setCurrentAddress({ user_id: user.id, is_default: true });
    }
  };
  
  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const addressPayload: Partial<Address> = {
      user_id: user.id,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode,
      is_default: currentAddress.is_default !== undefined ? currentAddress.is_default : true,
    };

    let error;
    if (currentAddress.id) {
      const { error: updateError } = await supabase
        .from('addresses')
        .update({ ...addressPayload, updated_at: new Date().toISOString() })
        .eq('id', currentAddress.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('addresses')
        .insert(addressPayload as Address);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao atualizar endereço", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Endereço atualizado!", description: "Seu endereço foi salvo." });
      fetchAddress();
    }
  };

  return (
    <form onSubmit={handleAddressUpdate} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">Rua</Label>
          <Input id="street" value={street} onChange={e => setStreet(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input id="number" value={number} onChange={e => setNumber(e.target.value)} /> 
        </div>
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" value={complement} onChange={e => setComplement(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado (UF)</Label>
          <Input id="state" value={state} onChange={e => setState(e.target.value)} maxLength={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipcode">CEP</Label>
          <Input id="zipcode" value={zipcode} onChange={e => setZipcode(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          {currentAddress.id ? "Atualizar Endereço" : "Salvar Endereço"}
        </Button>
      </div>
    </form>
  );
};
