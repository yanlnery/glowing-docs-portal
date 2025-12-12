import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import WaitlistForm from '@/components/WaitlistForm';
import AcademyHero from '@/components/academy/AcademyHero';
import AcademyFeatures from '@/components/academy/AcademyFeatures';
import AcademyCommunityMotto from '@/components/academy/AcademyCommunityMotto';
import AcademyCoursePreview from '@/components/academy/AcademyCoursePreview';
import AcademyBenefitsCard from '@/components/academy/AcademyBenefitsCard';
import AcademyPricing from '@/components/academy/AcademyPricing';
import AcademyGuarantee from '@/components/academy/AcademyGuarantee';
import AcademyCTA from '@/components/academy/AcademyCTA';
import AcademySubscriberBanner from '@/components/academy/AcademySubscriberBanner';
import { useSubscription, STRIPE_PRODUCTS } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Academy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { 
    isLoading, 
    hasAcademyAccess, 
    subscriptionEnd, 
    subscribe, 
    openCustomerPortal,
    checkSubscription 
  } = useSubscription();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle success/cancel from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Assinatura realizada com sucesso! Aguarde alguns segundos...');
      setTimeout(() => {
        checkSubscription();
      }, 3000);
    } else if (canceled === 'true') {
      toast.info('Assinatura cancelada');
    }
  }, [searchParams, checkSubscription]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar');
      navigate('/login?redirect=/academy');
      return;
    }

    try {
      await subscribe(STRIPE_PRODUCTS.academy.price_id);
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Erro ao iniciar assinatura. Tente novamente.');
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Error opening portal:', error);
      toast.error('Erro ao abrir portal de gerenciamento');
    }
  };

  return (
    <div className="container py-12 px-4 sm:px-6">
      {/* Subscriber Banner */}
      {hasAcademyAccess && (
        <AcademySubscriberBanner 
          subscriptionEnd={subscriptionEnd}
          onManageSubscription={handleManageSubscription}
        />
      )}

      <AcademyHero 
        onSubscribe={handleSubscribe} 
        isLoading={isLoading}
        hasAccess={hasAcademyAccess}
      />
      <AcademyFeatures />
      <AcademyCommunityMotto 
        onSubscribe={handleSubscribe}
        isLoading={isLoading}
        hasAccess={hasAcademyAccess}
      />
      <AcademyCoursePreview />
      <AcademyBenefitsCard 
        onSubscribe={handleSubscribe}
        isLoading={isLoading}
        hasAccess={hasAcademyAccess}
      />
      <AcademyPricing 
        onSubscribe={handleSubscribe}
        isLoading={isLoading}
        hasAccess={hasAcademyAccess}
        onManageSubscription={handleManageSubscription}
      />
      <AcademyGuarantee />
      {!hasAcademyAccess && (
        <AcademyCTA 
          onSubscribe={handleSubscribe}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Academy;
