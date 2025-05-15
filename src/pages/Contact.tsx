
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageSquare, Instagram, Youtube } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import emailjs from 'emailjs-com';

// Note: You'll need to create an EmailJS account and add these IDs for this to work:
// Sign up at https://www.emailjs.com/
const EMAILJS_SERVICE_ID = "pet_serpentes"; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = "contact_form"; // Replace with your template ID
const EMAILJS_USER_ID = "YOUR_USER_ID"; // Replace with your user ID

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store the submission in localStorage for the admin panel
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      const newSubmission = {
        ...formData,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      
      // Send email using EmailJS
      const templateParams = {
        to_email: "contato@petserpentes.com.br",
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || "Não informado",
        subject: formData.subject,
        message: formData.message
      };
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );
      
      toast({
        title: "Mensagem enviada!",
        description: "Em breve entraremos em contato com você.",
        variant: "default",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Houve um problema ao enviar sua mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu.email@exemplo.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="(00) 00000-0000" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input 
                  id="subject" 
                  placeholder="Assunto da sua mensagem" 
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descreva sua dúvida ou solicitação..." 
                  rows={5} 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full min-h-[44px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="order-1 lg:order-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-serpente-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-muted-foreground">
                    <a href="tel:+5521967802174" className="hover:text-serpente-600 transition-colors">+55 21 96780-2174</a>
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
                    <a href="https://wa.me/message/PQ7BIYW7H5ARK1" className="hover:text-serpente-600 transition-colors">Fale pelo WhatsApp</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-3">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/petserpentes/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 bg-card border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@PETSerpentes" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 bg-card border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="https://wa.me/message/PQ7BIYW7H5ARK1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 bg-card border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
