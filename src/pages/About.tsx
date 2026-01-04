import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Leaf, BookOpen, Award, Heart, Shield, Target } from 'lucide-react';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AboutImageCarousel } from '@/components/about/AboutImageCarousel';

const About = () => {
  const sobreCriadouroText = {
    title: "Sobre o Criadouro",
    paragraphs: [
      "O Pet Serpentes & Companhia é um criadouro comercial legalizado que atua com a criação de répteis silvestres nativos no Brasil, devidamente inscrito no Cadastro Técnico Federal do IBAMA CTF nº 6654937. A operação foi adquirida e segue em processo contínuo de aprimoramento estrutural e operacional, com Yan Nery atuando na gestão técnica do criadouro.",
      "O projeto teve início em 2015, com foco inicial em aves exóticas, e passou a atuar prioritariamente com répteis a partir de 2019. Atualmente, o criadouro opera de forma regularizada e vem passando por ajustes graduais, com planos de aprimoramento dos recintos, do manejo e dos protocolos técnicos ao longo do tempo.",
      "O objetivo é elevar progressivamente o padrão da operação, mantendo conformidade legal, responsabilidade no manejo e compromisso com o bem-estar animal."
    ]
  };

  const oQueFazemosText = {
    title: "O Que Fazemos",
    paragraphs: [
      "Localizado no Rio de Janeiro e certificado pelo IBAMA e INEA-RJ, o criadouro trabalha com criação responsável de répteis nativos. Oferecemos animais saudáveis, nascidos sob cuidados humanos, com toda documentação necessária.",
      "Além da comercialização, fazemos um trabalho educativo. Orientamos compradores sobre as reais necessidades de cada espécie, ajudamos pesquisadores com informações sobre reprodução e manejo, e recebemos estudantes interessados em aprender sobre herpetocultura."
    ]
  };

  const propositoText = {
    title: "Nosso Propósito",
    paragraphs: [
      "Nosso propósito é a criação responsável de répteis no Brasil. Isso significa investir constantemente em bem-estar animal, recintos melhores, compartilhar conhecimento de forma honesta e contribuir para que mais pessoas entendam e respeitem nossa fauna nativa.",
      "Trabalhamos para elevar o padrão da herpetocultura brasileira, mostrando que é possível criar répteis com qualidade, dentro da lei e com respeito aos animais."
    ]
  };

  const missaoItens = [
    {
      icon: <Leaf size={36} className="text-serpente-500" />,
      title: "Conservação",
      text: "Promovemos práticas sustentáveis de criação que contribuem para a conservação das espécies."
    },
    {
      icon: <BookOpen size={36} className="text-serpente-500" />,
      title: "Educação",
      text: "Compartilhamos conhecimento para formar tutores mais conscientes e promover a posse responsável no Brasil."
    },
    {
      icon: <Award size={36} className="text-serpente-500" />,
      title: "Excelência",
      text: "Asseguramos os mais altos padrões de qualidade no manejo, reprodução e venda de répteis para criadores responsáveis."
    },
    {
      icon: <Heart size={36} className="text-serpente-500" />,
      title: "Bem-estar Animal",
      text: "Garantimos ambiente, alimentação e estímulos adequados para o desenvolvimento saudável de cada animal."
    }
  ];

  const trajetoriaItens = [
    {
      year: "2015",
      title: "Fundação do Criadouro Araranguá",
      text: "Início do criadouro sob o nome \"Criadouro Araranguá\", com foco exclusivo em aves exóticas legalizadas."
    },
    {
      year: "2019",
      title: "Nascimento da Pet Serpentes & Companhia",
      text: "O criadouro passa a se chamar oficialmente \"Pet Serpentes & Companhia LTDA\" e inicia a criação de serpentes legalizadas."
    },
    {
      year: "2022",
      title: "Diversificação: Lagartos e Quelônios",
      text: "A operação se expande com a inclusão de novas espécies no manejo legalizado, como lagartos (Tupinambis, Iguanas) e quelônios."
    },
    {
      year: "2023",
      title: "Nova Direção: Yan Nery assume o Criadouro",
      text: "Yan Nery assume a liderança do criadouro, promovendo modernização, foco em bem-estar animal e projetos educacionais."
    },
    {
      year: "2026",
      title: "Visão de Futuro",
      text: "Em processo de crescimento e transformação, a Pet Serpentes segue com o objetivo de se tornar referência nacional em bem-estar animal, estrutura de manejo e educação ambiental."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Quem Somos | Pet Serpentes & Companhia</title>
        <meta 
          name="description" 
          content="Conheça a história do Pet Serpentes & Companhia, criadouro comercial legalizado no Rio de Janeiro. Nossa missão, valores e trajetória na criação responsável de répteis nativos." 
        />
      </Helmet>
      
      <div className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
            <div className="docs-section-title">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">Quem Somos</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-3 sm:mt-4 text-sm sm:text-base">
              Conheça a trajetória e a missão do Pet Serpentes & Companhia, criadouro comercial legalizado focado em criação responsável de répteis nativos.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
          {/* Sobre o Criadouro Section */}
          <section className="mb-20 md:mb-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Desktop: Imagem estática */}
              <div className="order-2 lg:order-1 hidden md:block rounded-2xl shadow-2xl overflow-hidden">
                <OptimizedImage
                  src="/lovable-uploads/13113c77-f713-4585-9041-1766e67545b8.png" 
                  alt="Yan Nery, CEO e Biólogo do Pet Serpentes & Companhia"
                  className="w-full h-auto"
                  style={{ objectFit: 'contain' }}
                  priority={true}
                />
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-serpente-100 dark:bg-serpente-900/30 text-serpente-700 dark:text-serpente-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Shield size={16} />
                  <span>CTF IBAMA nº 6654937</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {sobreCriadouroText.title}
                </h2>
                
                <div className="space-y-5">
                  {/* Primeiro parágrafo */}
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    {sobreCriadouroText.paragraphs[0]}
                  </p>
                  
                  {/* Mobile: Carrossel após primeiro parágrafo */}
                  <div className="md:hidden my-6">
                    <AboutImageCarousel />
                  </div>
                  
                  {/* Parágrafos restantes */}
                  {sobreCriadouroText.paragraphs.slice(1).map((p, index) => (
                    <p key={index} className="text-lg text-foreground/80 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* O Que Fazemos Section */}
          <section className="mb-20 md:mb-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Target size={16} />
                  <span>Nossa Atuação</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {oQueFazemosText.title}
                </h2>
                
                <div className="space-y-5">
                  {oQueFazemosText.paragraphs.map((p, index) => (
                    <p key={index} className="text-lg text-foreground/80 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Desktop only: Segunda imagem */}
              <div className="order-1 lg:order-2 hidden md:block">
                <ImageWithLoader
                  src="/lovable-uploads/c988fe8f-9ba2-4b94-a8e7-a7347e0d0a84.png" 
                  alt="Instalações do Pet Serpentes & Companhia"
                  containerClassName="rounded-2xl shadow-2xl overflow-hidden"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </section>

          {/* Nosso Propósito Section */}
          <section className="mb-20 md:mb-28">
            <div className="bg-gradient-to-br from-serpente-50 to-serpente-100/50 dark:from-serpente-950/40 dark:to-serpente-900/20 rounded-3xl p-8 md:p-12 lg:p-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                  {propositoText.title}
                </h2>
                
                <div className="space-y-6">
                  {propositoText.paragraphs.map((p, index) => (
                    <p key={index} className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Nossa Missão Section */}
          <section className="mb-20 md:mb-28">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trabalhamos com pilares fundamentais que orientam todas as nossas atividades.
              </p>
            </div>
            
            {/* Mobile: Carrossel horizontal com Bem-estar primeiro */}
            <div className="flex md:hidden overflow-x-auto gap-4 snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
              {[missaoItens[3], missaoItens[0], missaoItens[1], missaoItens[2]].map((item, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[80vw] snap-center bg-card border border-border/50 p-6 rounded-2xl text-center"
                >
                  <div className="w-16 h-16 bg-serpente-100 dark:bg-serpente-900/50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            
            {/* Desktop: Grid normal */}
            <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {missaoItens.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl text-center hover:shadow-xl hover:border-serpente-200 dark:hover:border-serpente-800 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-serpente-100 dark:bg-serpente-900/50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Nossa Trajetória Section */}
          <section>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nossa Trajetória</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça os principais marcos na história do Pet Serpentes & Companhia.
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Central line - Desktop */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-serpente-300 via-serpente-500 to-serpente-300 dark:from-serpente-700 dark:via-serpente-500 dark:to-serpente-700 transform -translate-x-1/2" />
              
              {trajetoriaItens.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative mb-8 md:mb-12 md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot - Desktop */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 bg-serpente-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {item.year.slice(2)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    {/* Mobile timeline */}
                    <div className="md:hidden flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-serpente-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0">
                        {item.year.slice(2)}
                      </div>
                      <span className="text-serpente-600 dark:text-serpente-400 font-bold">{item.year}</span>
                    </div>
                    
                    <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ml-14 md:ml-0">
                      <p className="hidden md:block text-sm font-bold text-serpente-600 dark:text-serpente-400 mb-2">{item.year}</p>
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                  
                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
