import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, ShoppingCart, ExternalLink } from 'lucide-react';
import { Species } from '@/types/species';
import { SpeciesWaitlistForm } from './SpeciesWaitlistForm';
import { supabase } from '@/integrations/supabase/client';

interface SpeciesActionButtonProps {
  species: Species;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

interface AvailableProduct {
  id: string;
  name: string;
  slug: string | null;
  price: number;
}

export function SpeciesActionButton({ 
  species, 
  variant = 'default',
  size = 'default',
  className 
}: SpeciesActionButtonProps) {
  const navigate = useNavigate();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, price')
          .eq('species_id', species.id)
          .eq('available', true)
          .eq('visible', true)
          .eq('status', 'disponivel')
          .gt('stock', 0);

        if (!error && data) {
          setAvailableProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products for species:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableProducts();
  }, [species.id]);

  const handleBuyClick = () => {
    if (availableProducts.length === 1) {
      // Single product - go directly to product page
      const product = availableProducts[0];
      navigate(`/produtos/${product.slug || product.id}`);
    } else {
      // Multiple products - go to catalog filtered by species
      navigate(`/catalogo?especie=${species.id}`);
    }
  };

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        Carregando...
      </Button>
    );
  }

  // Has available products - show buy button
  if (availableProducts.length > 0) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleBuyClick}
        className={`bg-serpente-500 hover:bg-serpente-600 text-white ${className}`}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {availableProducts.length === 1 ? 'Comprar agora' : `Ver ${availableProducts.length} disponíveis`}
      </Button>
    );
  }

  // No products available - show waitlist button
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsWaitlistOpen(true)}
        className={className}
      >
        <Bell className="w-4 h-4 mr-2" />
        Quero ser avisado
      </Button>

      <SpeciesWaitlistForm
        species={species}
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}
