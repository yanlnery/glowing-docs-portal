
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Download, Video } from "lucide-react";

interface ConfirmationModalProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    contactPreference: string;
  };
  onClose: () => void;
}

export default function ConfirmationModal({ userData, onClose }: ConfirmationModalProps) {
  // Extract first name to personalize the message
  const firstName = userData.name.split(" ")[0];

  const handleDownload = () => {
    // In a real implementation, this would download a PDF or redirect to one
    console.log("Downloading material...");
    
    // Create a temporary link to simulate download
    const link = document.createElement("a");
    link.href = "#"; // In real implementation, this would be a file URL
    link.setAttribute("download", "material-exclusivo-petserpentes.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-serpente-600">
          Você está na lista!
        </DialogTitle>
        <DialogDescription className="text-lg mt-2">
          Enquanto não abrimos as portas da PetSerpentes Academy, aqui vai um conteúdo exclusivo pra você.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-8">
        {/* Video placeholder */}
        <div className="bg-muted aspect-video rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <Video className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">Vídeo de apresentação da Academy</p>
          </div>
        </div>

        <div className="mb-8 text-left">
          <h3 className="text-lg font-semibold mb-2">
            Olá, {firstName}!
          </h3>
          <p className="text-muted-foreground mb-4">
            A PetSerpentes Academy está sendo preparada com muito carinho para ser a maior comunidade de 
            entusiastas e criadores de répteis do Brasil. Como membro da lista de espera, você terá acesso prioritário:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
            <li>Conteúdo exclusivo dos nossos especialistas</li>
            <li>Desconto especial de pré-lançamento</li>
            <li>Acesso antecipado aos cursos</li>
            <li>Suporte personalizado da nossa equipe</li>
          </ul>
          <p className="text-muted-foreground">
            Fique atento ao seu {userData.contactPreference === "email" ? "e-mail" : "e-mail e celular"} para 
            novidades incríveis que estamos preparando.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" /> 
            Baixar Material Exclusivo
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Voltar para Academia
          </Button>
        </div>
      </div>
    </div>
  );
}
