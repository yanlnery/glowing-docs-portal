import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, Star, Users, Sparkles } from 'lucide-react';

const AcademyConfirmation: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated success icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 bg-serpente-500/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-serpente-500 to-serpente-600 rounded-full flex items-center justify-center shadow-2xl shadow-serpente-500/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Community badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border border-amber-500/30 rounded-full mb-6">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            PSA One • Membro Exclusivo
          </span>
          <Crown className="w-4 h-4 text-amber-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-serpente-500 via-serpente-600 to-serpente-500 bg-clip-text text-transparent">
          Você está na lista!
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          Sua inscrição na <span className="font-semibold text-foreground">PS Academy</span> foi confirmada com sucesso.
        </p>

        {/* Exclusive card */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">O que acontece agora?</h2>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>

          <div className="grid gap-4 text-left">
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-serpente-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-serpente-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Confirmação por e-mail</h3>
                <p className="text-gray-400 text-sm">
                  Você receberá um e-mail de confirmação com mais detalhes sobre a comunidade.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-serpente-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-serpente-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Acesso antecipado</h3>
                <p className="text-gray-400 text-sm">
                  Quando abrirmos as portas, você será um dos primeiros a ter acesso exclusivo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-serpente-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-serpente-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Benefícios VIP</h3>
                <p className="text-gray-400 text-sm">
                  Membros da lista de espera terão condições especiais de lançamento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mb-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-serpente-500" />
            <span>Comunidade ativa</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span>Conteúdo exclusivo</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white">
            <Link to="/">Voltar para o site</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/catalogo">Conhecer nossos animais</Link>
          </Button>
        </div>

        {/* Thank you message */}
        <p className="mt-8 text-sm text-muted-foreground">
          Obrigado por confiar na <span className="font-semibold">Pet Serpentes</span>. 
          Em breve, você fará parte de algo incrível.
        </p>
      </div>
    </div>
  );
};

export default AcademyConfirmation;
