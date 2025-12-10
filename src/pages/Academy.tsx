import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { waitlistService } from '@/services/waitlistService';
import { toast } from 'sonner';

const Academy = () => {
  const navigate = useNavigate();
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="container py-12 px-4 sm:px-6">
      <AcademyHero onOpenWaitlistDialog={openWaitlistDialog} />
      <AcademyFeatures />
      <AcademyCommunityMotto onOpenWaitlistDialog={openWaitlistDialog} />
      <AcademyCoursePreview />
      <AcademyBenefitsCard onOpenWaitlistDialog={openWaitlistDialog} />
      <AcademyPricing onOpenWaitlistDialog={openWaitlistDialog} />
      <AcademyGuarantee />
      <AcademyCTA onOpenWaitlistDialog={openWaitlistDialog} />

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
