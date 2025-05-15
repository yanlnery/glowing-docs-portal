
import React from 'react';

const About = () => {
  return (
    <div className="container px-4 py-12 sm:px-6 mx-auto">
      {/* Title section - updated to match Manuals page style */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Quem Somos</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Conheça a história e a equipe por trás do Pet Serpentes & Companhia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p>
              O Pet Serpentes & Companhia é conduzido por Yan Nery, professor e biólogo apaixonado por herpetologia desde criança. Yan cresceu como aquarista entusiasta, sempre entre aquários e terrários, montando desde pequenos aquários até sistemas marinhos complexos, como também terrários bioativos, o que moldou sua curiosidade e respeito pela vida selvagem.
            </p>
            <p>
              Em 2023, Yan assumiu a frente do criadouro, dando continuidade ao trabalho iniciado por Daniel Leirião em 2015, quando o empreendimento nasceu como um criadouro de aves exóticas. A partir de 2019, os répteis passaram a fazer parte do manejo legalizado, e hoje representam o foco principal da operação.
            </p>
            <p>
              Localizado no Rio de Janeiro e com certificação do IBAMA e INEA-RJ, o criadouro se dedica à criação responsável, à promoção do bem-estar animal e à disseminação de conhecimento sobre espécies nativas. Atuamos com ética, transparência e compromisso com a educação ambiental e científica, incluindo parcerias com escolas públicas e apoio a pesquisas acadêmicas.
            </p>
            <p>
              Nosso propósito vai além da comercialização: queremos ser referência nacional em bem-estar animal, desenvolvendo recintos naturais e espaçosos que simulem o habitat das espécies — elevando o padrão do setor.
            </p>
          </div>
        </div>
        
        <div>
          <img 
            src="/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png" 
            alt="Instalações do Pet Serpentes" 
            className="w-full h-auto rounded-lg shadow-lg" 
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Nossa Equipe</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative mx-auto w-40 h-40 mb-4 overflow-hidden rounded-full">
              <img 
                src="/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png" 
                alt="Yan Nery" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Yan Nery</h3>
            <p className="text-serpente-600">CEO e Biólogo</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fundador e biólogo especialista em herpetologia, com ampla experiência em manejo de répteis e difusão do conhecimento científico.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative mx-auto w-40 h-40 mb-4 overflow-hidden rounded-full bg-muted flex items-center justify-center">
              <img 
                src="/lovable-uploads/d7cd39f5-e491-4eb3-a10d-6cf8ad24669a.png" 
                alt="Dara Nery" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Dara Nery</h3>
            <p className="text-serpente-600">Diretora de Operações</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Responsável pela gestão operacional e administrativa do criadouro, garantindo o bem-estar de todos os animais.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative mx-auto w-40 h-40 mb-4 overflow-hidden rounded-full bg-muted flex items-center justify-center">
              <img 
                src="/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png" 
                alt="Equipe Técnica" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-xl font-semibold">Equipe Técnica</h3>
            <p className="text-serpente-600">Suporte e Manejo</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Nossa equipe técnica é formada por profissionais especializados no manejo e cuidado de répteis e aves exóticas.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Nossos Valores</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Bem-estar animal</h3>
            <p>
              Todos os nossos animais são criados em condições que priorizam seu bem-estar, com recintos amplos e adequados às necessidades de cada espécie.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Educação Ambiental</h3>
            <p>
              Acreditamos que o conhecimento é a chave para a conservação. Por isso, promovemos iniciativas educacionais sobre a importância das diferentes espécies.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Sustentabilidade</h3>
            <p>
              Adotamos práticas sustentáveis em todas as nossas operações, desde a alimentação dos animais até o descarte responsável de resíduos.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-serpente-50 dark:bg-serpente-950/30 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Visite Nosso Criadouro</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Agende uma visita ao nosso criadouro para conhecer de perto nosso trabalho e os animais que criamos com tanto carinho e dedicação.
        </p>
        <a 
          href="/contato" 
          className="inline-block bg-serpente-600 hover:bg-serpente-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Agendar Visita
        </a>
      </div>
    </div>
  );
};

export default About;
