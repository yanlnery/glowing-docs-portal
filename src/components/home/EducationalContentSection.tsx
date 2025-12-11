import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { waitlistService } from "@/services/waitlistService";
import manualCriacaoImg from "@/assets/manual-criacao.png";
import academyPreviewImg from "@/assets/academy-preview.png";
import especiesPreviewImg from "@/assets/especies-preview.png";

export default function EducationalContentSection() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPreference: "email"
  });

  const handleSubmitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await waitlistService.addToWaitlist({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        contact_preference: formData.contactPreference
      });

      if (error) throw error;

      toast.success("Inscrição realizada com sucesso! Entraremos em contato em breve.");
      setIsWaitlistOpen(false);
      setFormData({ name: "", email: "", phone: "", contactPreference: "email" });
    } catch (error: any) {
      toast.error("Erro ao fazer inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cards = [
    {
      image: manualCriacaoImg,
      title: "Manuais de Criação",
      description: "Guias técnicos com tudo o que você precisa saber sobre cuidados, alimentação e estrutura ideal.",
      linkTo: "/manuais-de-criacao",
      buttonText: "Acessar Manuais",
      isLink: true
    },
    {
      image: academyPreviewImg,
      title: "Pet Serpentes Academy",
      description: "Plataforma com aulas, vídeos exclusivos e uma comunidade ativa para entusiastas do hobby.",
      buttonText: "Entrar na Lista de Espera",
      isLink: false
    },
    {
      image: especiesPreviewImg,
      title: "Conheça nossas Espécies",
      description: "Explore nosso catálogo completo de espécies e encontre o réptil ideal para você.",
      linkTo: "/especies",
      buttonText: "Conheça nossas Espécies",
      isLink: true
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="docs-section-title">
            <h2 className="text-3xl font-bold">Aprenda a Criar com Responsabilidade</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-4">
            Conteúdo gratuito e acessível para promover a posse responsável de répteis no Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="docs-card-gradient rounded-lg border hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl mb-4">{card.title}</h3>
                <p className="text-muted-foreground mb-6 flex-1">
                  {card.description}
                </p>
                {card.isLink ? (
                  <Button
                    className="w-full group-hover:translate-y-[-2px] transition-transform"
                    variant="outline"
                    asChild
                  >
                    <Link to={card.linkTo!} className="flex items-center justify-center">
                      {card.buttonText} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full group-hover:translate-y-[-2px] transition-transform"
                    variant="outline"
                    onClick={() => setIsWaitlistOpen(true)}
                  >
                    {card.buttonText} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Waitlist Dialog */}
        <Dialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Entre para nossa lista de espera</DialogTitle>
              <DialogDescription className="text-center">
                Seja o primeiro a saber quando a Pet Serpentes Academy abrir suas portas
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitWaitlist} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Celular / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Como prefere ser contatado?</Label>
                <RadioGroup
                  value={formData.contactPreference}
                  onValueChange={(value) => setFormData({ ...formData, contactPreference: value })}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-only" />
                    <label htmlFor="email-only" className="text-sm font-medium leading-none cursor-pointer">
                      Desejo ser contatado apenas por e-mail
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <label htmlFor="both" className="text-sm font-medium leading-none cursor-pointer">
                      Autorizo contato por e-mail e celular
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsWaitlistOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
