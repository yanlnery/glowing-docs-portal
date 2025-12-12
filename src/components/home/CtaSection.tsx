
import React from "react";
import { Link } from "react-router-dom";
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
            <Link to="/contato">Falar com um Especialista</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
