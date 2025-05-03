
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const carouselImages = [
  {
    url: "/lovable-uploads/921c3722-02d0-419b-b003-caa6b5de021d.png", // Imagem 1 (teiú)
    title: "Animais silvestres legalizados",
    subtitle: "Venha conhecer as espécies mais fascinantes em um criadouro 100% legalizado pelo IBAMA e INEA-RJ"
  },
  {
    url: "/lovable-uploads/cd48f5e3-6ae0-4436-b893-4ebe6a08efa6.png", // Imagem 2 (iguanas verdes)
    title: "Criação com manejo responsável",
    subtitle: "Nossos animais recebem alimentação balanceada, ambiente adequado e acompanhamento técnico"
  },
  {
    url: "/lovable-uploads/610934d9-5fa0-47d8-9148-cc584b051100.png", // Imagem 3 (cobra padrão)
    title: "Animais legalizados com procedência",
    subtitle: "Criação responsável, com autorização dos órgãos ambientais e acompanhamento veterinário"
  },
  {
    url: "/lovable-uploads/13d1c8e0-23bb-4652-b53a-f364cfcefb70.png", // Imagem 4 (teiú na vegetação)
    title: "Compromisso com o bem-estar animal",
    subtitle: "Trabalhamos para garantir qualidade de vida, segurança e respeito em cada etapa da criação"
  }
];

export default function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Image Carousel */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          )}
          style={{
            backgroundImage: `url(${image.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-20 flex flex-col items-start justify-center h-full py-10 px-4 sm:px-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl animate-slide-in pt-6 sm:pt-0">
          {carouselImages[currentImageIndex].title}
        </h1>
        <p className="text-md md:text-xl text-white/90 max-w-xl mb-8 animate-fade-in">
          {carouselImages[currentImageIndex].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center sm:items-start">
          <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[44px] w-full sm:w-auto" asChild>
            <Link to="/catalogo">
              Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] w-full sm:w-auto" asChild>
            <Link to="/sobre">
              Conheça nossa História
            </Link>
          </Button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full focus:outline-none transition-all",
              index === currentImageIndex
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/60"
            )}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
