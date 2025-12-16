import React from "react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-12 bg-serpente-600 text-white">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Pronto para ter seu próprio réptil?</h2>
            <p className="text-white/80">Entre em contato conosco e descubra as espécies disponíveis</p>
          </div>
          <Button size="lg" variant="premium-light" asChild>
            <a 
              href="https://wa.me/5521967802174?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20falar%20com%20um%20especialista!%20%F0%9F%90%8D"
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com um Especialista
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
