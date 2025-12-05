import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import WaitlistForm from '@/components/WaitlistForm';
import AcademyHero from '@/components/academy/AcademyHero';
import AcademyFeatures from '@/components/academy/AcademyFeatures';
import AcademyCoursePreview from '@/components/academy/AcademyCoursePreview';
import AcademyPricing from '@/components/academy/AcademyPricing';
import AcademyCTA from '@/components/academy/AcademyCTA';
import { waitlistService } from '@/services/waitlistService';
import { toast } from 'sonner';

const Academy = () => {
  const navigate = useNavigate();
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
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
      <AcademyCoursePreview />
      <AcademyPricing onOpenWaitlistDialog={openWaitlistDialog} />
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
