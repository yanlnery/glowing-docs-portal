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
import { Loader2, Download, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { materialLeadService } from "@/services/materialLeadService";
import { useAuth } from "@/hooks/useAuth";
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

export default function MaterialDownloadGate({
  isOpen,
  onClose,
  materialTitle,
  pdfUrl,
  onDownloadComplete,
}: MaterialDownloadGateProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; consent?: string }>({});
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  
  const { toast } = useToast();
  const { isAuthenticated, user, profile } = useAuth();
  const navigate = useNavigate();

  // Pre-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email || "");
      if (profile) {
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
        setName(fullName);
      }
    }
  }, [isAuthenticated, user, profile]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
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
      toast({
        title: "Cadastro realizado!",
        description: "Seu download começará em instantes.",
      });
      
      // Trigger download
      triggerDownload();
      setDownloadCompleted(true);
      onDownloadComplete?.();
    } else {
      toast({
        title: "Erro ao cadastrar",
        description: error || "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleGoToSignup = () => {
    onClose();
    navigate("/auth/signup");
  };

  const handleClose = () => {
    setDownloadCompleted(false);
    setName("");
    setEmail("");
    setConsent(false);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!downloadCompleted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Cadastre-se para baixar</DialogTitle>
              <DialogDescription className="text-sm">
                Preencha seus dados para acessar: <strong>{materialTitle}</strong>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-center">Download iniciado!</DialogTitle>
              <DialogDescription className="text-center">
                O material está sendo baixado. Que tal criar uma conta completa para ter acesso a mais benefícios?
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={handleGoToSignup} className="w-full">
                Criar conta completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleClose} className="w-full">
                Continuar navegando
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
