
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import WaitlistForm from '@/components/WaitlistForm';
import AcademyHero from '@/components/academy/AcademyHero';
import AcademyFeatures from '@/components/academy/AcademyFeatures';
import AcademyCoursePreview from '@/components/academy/AcademyCoursePreview';
import AcademyPricing from '@/components/academy/AcademyPricing';
import AcademyCTA from '@/components/academy/AcademyCTA';

const Academy = () => {
  const navigate = useNavigate();
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleWaitlistSubmit = (data: any) => {
    // Store in localStorage for demonstration purposes
    const waitlistEntry = {
      ...data,
      date: new Date().toISOString()
    };

    // Get current waitlist entries or initialize empty array
    const currentEntries = JSON.parse(localStorage.getItem('waitlist') || '[]');
    localStorage.setItem('waitlist', JSON.stringify([...currentEntries, waitlistEntry]));

    setIsWaitlistDialogOpen(false);
    navigate('/confirmacao-inscricao');
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
