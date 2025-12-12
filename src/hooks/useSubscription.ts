import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Product IDs from Stripe
export const STRIPE_PRODUCTS = {
  academy: {
    product_id: 'prod_TapgRAsjsT5SlS',
    price_id: 'price_1Sde1YRtgvUJvytjQTGxsHD6',
    name: 'PetSerpentes Academy',
    price: 17.90,
  },
} as const;

interface SubscriptionState {
  isLoading: boolean;
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  error: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isLoading: false,
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, subscribed: false, productId: null, subscriptionEnd: null }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) throw error;

      setState({
        isLoading: false,
        subscribed: data.subscribed || false,
        productId: data.product_id || null,
        subscriptionEnd: data.subscription_end || null,
        error: null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar assinatura',
      }));
    }
  }, [user]);

  const subscribe = async (priceId: string) => {
    if (!user) {
      throw new Error('Você precisa estar logado para assinar');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
    });

    if (error) throw error;

    if (data?.url) {
      window.open(data.url, '_blank');
    }

    return data;
  };

  const openCustomerPortal = async () => {
    if (!user) {
      throw new Error('Você precisa estar logado');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal');

    if (error) throw error;

    if (data?.url) {
      window.open(data.url, '_blank');
    }

    return data;
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds if subscribed
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const hasAcademyAccess = state.subscribed && state.productId === STRIPE_PRODUCTS.academy.product_id;

  return {
    ...state,
    hasAcademyAccess,
    checkSubscription,
    subscribe,
    openCustomerPortal,
  };
};
