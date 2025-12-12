import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, MapPin, Loader2 } from 'lucide-react';

interface AcademyCommunityMottoProps {
  onAction: () => void;
  isLoading?: boolean;
  hasAccess?: boolean;
  isOpenForSubscription?: boolean;
}

const AcademyCommunityMotto: React.FC<AcademyCommunityMottoProps> = ({ 
  onAction, 
  isLoading, 
  hasAccess,
  isOpenForSubscription 
}) => {
  const getButtonText = () => {
    if (isLoading) return 'Carregando...';
    return 'Quero fazer parte';
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-serpente-50 to-serpente-100 dark:from-serpente-950 dark:to-gray-900 rounded-2xl mb-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm uppercase tracking-wider text-serpente-600 dark:text-serpente-400 mb-6 font-medium">
          Na PS Academy, o lema é:
        </p>
        
        <div className="relative mb-8">
          <span className="absolute -top-6 -left-2 text-6xl text-serpente-300 dark:text-serpente-700 font-serif">"</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-relaxed px-8">
            A paixão pela herpecultura nos une. O conhecimento nos transforma.
          </h2>
          <span className="absolute -bottom-8 -right-2 text-6xl text-serpente-300 dark:text-serpente-700 font-serif">"</span>
        </div>
        
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 mt-12">
          Mais do que uma plataforma de cursos, a PS Academy é uma comunidade de criadores 
          apaixonados que compartilham conhecimento, experiências e a mesma paixão por répteis.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-serpente-600" />
            <span className="font-bold text-xl">Comunidade</span>
            <span className="text-muted-foreground">Ativa</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-serpente-600" />
            <span className="font-bold text-xl">50+</span>
            <span className="text-muted-foreground">Espécies</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-serpente-600" />
            <span className="font-bold text-xl">26</span>
            <span className="text-muted-foreground">Estados</span>
          </div>
        </div>
        
        {!hasAccess && (
          <Button 
            size="lg" 
            className="btn-premium px-10 py-6 text-base font-semibold"
            onClick={onAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              getButtonText()
            )}
          </Button>
        )}
      </div>
    </section>
  );
};

export default AcademyCommunityMotto;
