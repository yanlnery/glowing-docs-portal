
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Animais silvestres legalizados",
    subtitle: "Venha conhecer as espécies mais fascinantes em um criadouro 100% legalizado pelo IBAMA e INEA-RJ"
  },
  {
    url: "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "A maior coleção de serpentes do Brasil",
    subtitle: "Conheça nossa variedade de serpentes, lagartos e quelônios criados com os mais altos padrões de bem-estar"
  },
  {
    url: "https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Experiência e confiança",
    subtitle: "Mais de 5 anos de experiência na criação e conservação de répteis e outros animais"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-20 flex flex-col items-start justify-center h-full py-10 px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl animate-slide-in">
          {carouselImages[currentImageIndex].title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 animate-fade-in">
          {carouselImages[currentImageIndex].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white" asChild>
            <Link to="/catalogo">
              Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
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
