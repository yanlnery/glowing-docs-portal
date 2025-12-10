import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, GraduationCap, Users, Star } from 'lucide-react';

interface AcademyBenefitsCardProps {
  onOpenWaitlistDialog: () => void;
}

const AcademyBenefitsCard: React.FC<AcademyBenefitsCardProps> = ({ onOpenWaitlistDialog }) => {
  const educationBenefits = [
    'Cursos completos de criação e manejo',
    'Aulas sobre reprodução e genética',
    'Conteúdo sobre alimentação e nutrição',
    'Técnicas avançadas de herpecultura',
  ];

  const communityBenefits = [
    'Comunidade exclusiva de discussão',
    'Mentorias com especialistas',
    'Suporte direto com criadores experientes',
    'Networking com outros membros',
  ];

  const exclusiveBenefits = [
    'Acesso antecipado ao plantel',
    'Preferência na compra de animais',
    'Download de materiais exclusivos',
    'Certificados de conclusão',
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
          <Button 
            size="lg" 
            className="bg-serpente-600 hover:bg-serpente-700 text-white px-12 py-6 text-lg"
            onClick={onOpenWaitlistDialog}
          >
            Quero fazer parte
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AcademyBenefitsCard;
