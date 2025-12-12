import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, GraduationCap, Users, Star, Loader2 } from 'lucide-react';

interface AcademyBenefitsCardProps {
  onSubscribe: () => void;
  isLoading?: boolean;
  hasAccess?: boolean;
}

const AcademyBenefitsCard: React.FC<AcademyBenefitsCardProps> = ({ onSubscribe, isLoading, hasAccess }) => {
  const educationBenefits = [
    'Conteúdos educativos sobre herpetocultura responsável',
    'Orientações gerais sobre manejo e cuidados básicos',
    'Boas práticas de rotina, ambiente e bem-estar',
  ];

  const communityBenefits = [
    'Comunidade exclusiva para troca de experiências',
    'Discussões moderadas e informativas',
    'Contato com criadores experientes para troca de vivências',
    'Networking entre membros da comunidade',
  ];

  const exclusiveBenefits = [
    'Acesso antecipado ao plantel',
    'Preferência na compra de animais',
    'Download de materiais exclusivos',
    'Atualizações de conteúdo',
  ];

  return (
    <section className="mb-16">
      <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-8 md:p-12 text-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Tudo o que você precisa para dominar a herpecultura
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Educação PSA */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-serpente-600 rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Educação PSA</h3>
            </div>
            <ul className="space-y-3">
              {educationBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidade PSA */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-serpente-600 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Comunidade PSA</h3>
            </div>
            <ul className="space-y-3">
              {communityBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefícios Exclusivos */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-serpente-600 rounded-lg">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Benefícios Exclusivos</h3>
            </div>
            <ul className="space-y-3">
              {exclusiveBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preço e CTA */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 mb-2">Tudo isso por apenas</p>
          <div className="mb-6">
            <span className="text-4xl md:text-5xl font-bold">R$ 17,90</span>
            <span className="text-gray-400 text-lg">/mês</span>
          </div>
          {!hasAccess && (
            <Button 
              size="lg" 
              className="btn-premium px-12 py-6 text-lg font-semibold"
              onClick={onSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Quero fazer parte'
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default AcademyBenefitsCard;
