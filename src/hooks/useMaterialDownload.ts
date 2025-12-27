import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { materialLeadService } from "@/services/materialLeadService";
import { downloadAnalyticsService } from "@/services/downloadAnalyticsService";
import { useToast } from "@/hooks/use-toast";

interface PendingDownload {
  pdfUrl: string;
  title: string;
}

export function useMaterialDownload() {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<PendingDownload | null>(null);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const triggerDownload = useCallback((pdfUrl: string, title: string, source: 'lead_form' | 'authenticated' = 'authenticated') => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    const filename = title
      .replace(/[^a-z0-9_ \-]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase() + ".pdf";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track download event
    downloadAnalyticsService.trackDownloadStarted(title, source);
  }, []);

  const handleDownload = useCallback((pdfUrl: string | null, title: string) => {
    if (!pdfUrl) {
      toast({
        title: "PDF não disponível",
        description: "O arquivo PDF para este material não foi encontrado.",
        variant: "default",
      });
      return;
    }

    // If user is authenticated, allow direct download (skip modal)
    if (isAuthenticated) {
      triggerDownload(pdfUrl, title, 'authenticated');
      toast({
        title: "Download iniciado!",
        description: `O material "${title}" está sendo baixado.`,
      });
      return;
    }

    // Check if user already registered as lead
    if (materialLeadService.isLeadRegistered()) {
      triggerDownload(pdfUrl, title, 'lead_form');
      toast({
        title: "Download iniciado!",
        description: `O material "${title}" está sendo baixado.`,
      });
      return;
    }

    // Show the gate modal and track analytics
    setPendingDownload({ pdfUrl, title });
    setIsGateOpen(true);
    downloadAnalyticsService.trackModalOpen(title);
  }, [isAuthenticated, toast, triggerDownload]);

  const closeGate = useCallback(() => {
    setIsGateOpen(false);
    setPendingDownload(null);
  }, []);

  const onDownloadComplete = useCallback(() => {
    // Download already triggered in the modal
  }, []);

  return {
    isGateOpen,
    pendingDownload,
    handleDownload,
    closeGate,
    onDownloadComplete,
    triggerDownload,
  };
}
