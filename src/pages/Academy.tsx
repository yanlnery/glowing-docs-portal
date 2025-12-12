import React, { useEffect, useState } from 'react';
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
import { useSettings } from '@/hooks/useSettings';
import { waitlistService } from '@/services/waitlistService';
import { toast } from 'sonner';

const Academy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isAcademyOpenForSubscription, isLoading: settingsLoading } = useSettings();
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);
  
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

  const handleWaitlistSubmit = async (data: any) => {
    try {
      const { error } = await waitlistService.addToWaitlist({
        name: data.name,
        email: data.email,
        phone: data.phone,
        contact_preference: data.contactPreference
      });

      if (error) throw error;

      setIsWaitlistDialogOpen(false);
      navigate('/confirmacao-inscricao');
    } catch (error) {
      toast.error("Erro ao fazer inscrição. Tente novamente.");
    }
  };

  const openWaitlistDialog = () => setIsWaitlistDialogOpen(true);

  // Determine which action to use based on settings
  const handleAction = isAcademyOpenForSubscription ? handleSubscribe : openWaitlistDialog;
  const actionLoading = isAcademyOpenForSubscription ? isLoading : false;

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
        onAction={handleAction} 
        isLoading={actionLoading}
        hasAccess={hasAcademyAccess}
        isOpenForSubscription={isAcademyOpenForSubscription}
      />
      <AcademyFeatures />
      <AcademyCommunityMotto 
        onAction={handleAction}
        isLoading={actionLoading}
        hasAccess={hasAcademyAccess}
        isOpenForSubscription={isAcademyOpenForSubscription}
      />
      <AcademyCoursePreview />
      <AcademyBenefitsCard 
        onAction={handleAction}
        isLoading={actionLoading}
        hasAccess={hasAcademyAccess}
        isOpenForSubscription={isAcademyOpenForSubscription}
      />
      <AcademyPricing 
        onAction={handleAction}
        isLoading={actionLoading}
        hasAccess={hasAcademyAccess}
        onManageSubscription={handleManageSubscription}
        isOpenForSubscription={isAcademyOpenForSubscription}
      />
      <AcademyGuarantee />
      {!hasAcademyAccess && (
        <AcademyCTA 
          onAction={handleAction}
          isLoading={actionLoading}
          isOpenForSubscription={isAcademyOpenForSubscription}
        />
      )}

      {/* Waitlist Dialog */}
      <Dialog open={isWaitlistDialogOpen} onOpenChange={setIsWaitlistDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <WaitlistForm
            onSubmit={handleWaitlistSubmit}
            onCancel={() => setIsWaitlistDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Academy;
