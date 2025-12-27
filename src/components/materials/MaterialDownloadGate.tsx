import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Download, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { materialLeadService } from "@/services/materialLeadService";
import { downloadAnalyticsService } from "@/services/downloadAnalyticsService";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  consent: z.literal(true, { errorMap: () => ({ message: "Você precisa concordar para continuar" }) }),
});

interface MaterialDownloadGateProps {
  isOpen: boolean;
  onClose: () => void;
  materialTitle: string;
  pdfUrl: string;
  onDownloadComplete?: () => void;
}

type ViewState = "options" | "lead-form";

export default function MaterialDownloadGate({
  isOpen,
  onClose,
  materialTitle,
  pdfUrl,
  onDownloadComplete,
}: MaterialDownloadGateProps) {
  const [viewState, setViewState] = useState<ViewState>("options");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; consent?: string }>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Store pending download info in sessionStorage for post-login retrieval
  const storePendingDownload = () => {
    sessionStorage.setItem("pending_manual_download", JSON.stringify({
      pdfUrl,
      title: materialTitle,
    }));
  };

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    const filename = materialTitle
      .replace(/[^a-z0-9_ \-]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase() + ".pdf";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToSignup = () => {
    downloadAnalyticsService.trackOptionClicked('signup', materialTitle);
    storePendingDownload();
    onClose();
    navigate("/signup", { state: { from: "/manuais", pendingDownload: true } });
  };

  const handleGoToLogin = () => {
    downloadAnalyticsService.trackOptionClicked('login', materialTitle);
    storePendingDownload();
    onClose();
    navigate("/login", { state: { from: "/manuais", pendingDownload: true } });
  };

  const handleShowLeadForm = () => {
    downloadAnalyticsService.trackOptionClicked('lead_form', materialTitle);
    setViewState("lead-form");
  };

  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse({ name, email, consent });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    const { success, error } = await materialLeadService.registerLead({
      name: result.data.name,
      email: result.data.email,
      consent: result.data.consent,
      downloaded_material: materialTitle,
    });

    setIsSubmitting(false);

    if (success) {
      downloadAnalyticsService.trackLeadFormSubmitted(materialTitle);
      downloadAnalyticsService.trackDownloadStarted(materialTitle, 'lead_form');
      
      toast({
        title: "Cadastro realizado!",
        description: "Seu download começará em instantes.",
      });
      
      triggerDownload();
      onDownloadComplete?.();
      handleClose();
    } else {
      toast({
        title: "Erro ao cadastrar",
        description: error || "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setViewState("options");
    setName("");
    setEmail("");
    setConsent(false);
    setErrors({});
    onClose();
  };

  // Reset view state when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewState("options");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {viewState === "options" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Baixar Material</DialogTitle>
              <DialogDescription className="text-sm">
                Para baixar <strong>{materialTitle}</strong>, escolha uma opção:
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={handleGoToSignup} className="w-full gap-2">
                <UserPlus className="h-4 w-4" />
                Criar conta gratuita
              </Button>
              
              <Button onClick={handleGoToLogin} variant="outline" className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                Já tenho conta
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button 
                onClick={handleShowLeadForm} 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Baixar sem criar conta
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Ao criar uma conta você terá acesso a mais materiais exclusivos.
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setViewState("options")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-xl">Cadastro Rápido</DialogTitle>
              </div>
              <DialogDescription className="text-sm">
                Preencha seus dados para acessar: <strong>{materialTitle}</strong>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLeadFormSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="lead-name">Nome completo</Label>
                <Input
                  id="lead-name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-email">E-mail</Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="lead-consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  disabled={isSubmitting}
                  className={errors.consent ? "border-destructive" : ""}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="lead-consent"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Concordo em receber comunicações e materiais educativos.
                  </Label>
                  {errors.consent && (
                    <p className="text-sm text-destructive">{errors.consent}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Cadastrar e baixar
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
