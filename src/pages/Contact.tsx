
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, MessageSquare, Instagram, Facebook, Youtube } from "lucide-react";

export default function Contact() {
  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Fale Conosco</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Entre em contato com nossa equipe para esclarecer dúvidas, consultar disponibilidade ou agendar uma visita
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="order-2 lg:order-1">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Envie-nos uma mensagem</h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu.email@exemplo.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Assunto da sua mensagem" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descreva sua dúvida ou solicitação..." 
                  rows={5} 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full">Enviar Mensagem</Button>
            </form>
          </div>
        </div>
        
        {/* Contact Info & Map */}
        <div className="order-1 lg:order-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-serpente-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <address className="not-italic text-muted-foreground">
                    Estrada do Criadouro, 123<br />
                    Bairro Verde - Rio de Janeiro, RJ<br />
                    CEP: 22000-000
                  </address>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-serpente-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-muted-foreground">
                    <a href="tel:+552199999999" className="hover:text-serpente-600 transition-colors">+55 21 99999-9999</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-serpente-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">E-mail</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:contato@petserpentes.com.br" className="hover:text-serpente-600 transition-colors">contato@petserpentes.com.br</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-serpente-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p className="text-muted-foreground">
                    <a href="https://wa.me/5521999999999" className="hover:text-serpente-600 transition-colors">Fale pelo WhatsApp</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-3">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com" 
                  className="h-10 w-10 bg-card border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  className="h-10 w-10 bg-card border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://youtube.com" 
                  className="h-10 w-10 bg-card border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden border shadow-sm h-80 bg-card">
            {/* Embed Google Maps here */}
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Mapa do Google será carregado aqui</p>
              {/* Uncomment and replace API_KEY with your Google Maps API key
              <iframe
                title="Pet Serpentes Location"
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps/embed/v1/place?key=API_KEY&q=Rio+de+Janeiro,Brasil"
                allowFullScreen
              ></iframe>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
