import React from 'react';

const AcademyGuarantee: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge circular */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-serpente-500 flex items-center justify-center relative">
              <span className="text-5xl font-bold text-serpente-500">7</span>
              {/* Texto circular ao redor */}
              <svg className="absolute w-40 h-40" viewBox="0 0 160 160">
                <defs>
                  <path
                    id="circlePath"
                    d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                  />
                </defs>
                <text className="fill-serpente-400 text-xs uppercase tracking-widest">
                  <textPath href="#circlePath" startOffset="0%">
                    DIAS DE GARANTIA • DIAS DE GARANTIA •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            7 DIAS DE GARANTIA
          </h2>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Assinando agora, você terá acesso ao conteúdo completo da PS Academy. 
            Se, em 7 dias, você não gostar, nós devolvemos todo o seu dinheiro de 
            forma simples e segura.
          </p>
          
          <p className="text-gray-400">
            Sua satisfação é nossa prioridade. Sem perguntas, sem burocracia.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AcademyGuarantee;
