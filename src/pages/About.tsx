import React from 'react';
import { Leaf, BookOpen, Award, Heart } from 'lucide-react';

const About = () => {
  const historiaText = {
    title: "Nossa História",
    subtitle: "Conheça a trajetória e a missão do Pet Serpentes & Companhia",
    paragraphs: [
      "O Pet Serpentes & Companhia é conduzido por Yan Nery, professor e biólogo apaixonado por herpetologia desde criança. Yan cresceu como aquarista entusiasta, sempre entre aquários e terrários, montando desde pequenos aquários até sistemas marinhos complexos, como também terrários bioativos, o que moldou sua curiosidade e respeito pela vida selvagem.",
      "Em 2023, Yan assumiu a frente do criadouro, dando continuidade ao trabalho iniciado por Daniel Leirião em 2015, quando o empreendimento nasceu como um criadouro de aves exóticas. A partir de 2019, os répteis passaram a fazer parte do manejo legalizado, e hoje representam o foco principal da operação.",
      "Localizado no Rio de Janeiro e com certificação do IBAMA e INEA-RJ, o criadouro se dedica à criação responsável, à promoção do bem-estar animal e à disseminação de conhecimento sobre espécies nativas. Atuamos com ética, transparência e compromisso com a educação ambiental e científica, incluindo parcerias com escolas públicas e apoio a pesquisas acadêmicas.",
      "Nosso propósito vai além da comercialização: queremos ser referência nacional em bem-estar animal, desenvolvendo recintos naturais e espaçosos que simulem o habitat das espécies — elevando o padrão do setor."
    ],
    ceo: "Yan Nery",
    ceoTitle: "CEO e Biólogo"
  };

  const missaoItens = [
    {
      icon: <Leaf size={40} className="mb-4 text-serpente-500" />,
      title: "Conservação",
      text: "Promovemos práticas sustentáveis de criação que contribuem para a conservação das espécies."
    },
    {
      icon: <BookOpen size={40} className="mb-4 text-serpente-500" />,
      title: "Educação",
      text: "Compartilhamos conhecimento para formar tutores mais conscientes e promover a posse responsável no Brasil."
    },
    {
      icon: <Award size={40} className="mb-4 text-serpente-500" />,
      title: "Excelência",
      text: "Asseguramos os mais altos padrões de qualidade no manejo, reprodução e venda de répteis para criadores responsáveis."
    },
    {
      icon: <Heart size={40} className="mb-4 text-serpente-500" />,
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
      year: "2025",
      title: "Visão de Futuro",
      text: "Em processo de crescimento e transformação, a Pet Serpentes segue com o objetivo de se tornar referência nacional em bem-estar animal, estrutura de manejo e educação ambiental."
    }
  ];

  return (
    <div className="bg-background text-foreground py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Nossa História Section - Com título e subtítulo centralizados */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{historiaText.title}</h2>
            <p className="text-muted-foreground mb-8 text-lg mx-auto max-w-2xl">{historiaText.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-1 md:order-1">
              <img 
                src="/lovable-uploads/13113c77-f713-4585-9041-1766e67545b8.png" 
                alt="Yan Nery, CEO e Biólogo do Pet Serpentes & Companhia" 
                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[4/5] md:aspect-auto" 
              />
            </div>
            <div className="order-2 md:order-2 prose prose-invert max-w-none text-foreground">
              <h3 className="text-xl font-semibold text-foreground">{historiaText.ceo}</h3>
              <p className="text-sm text-primary mb-4">{historiaText.ceoTitle}</p>
              {historiaText.paragraphs.map((p, index) => (
                <p key={index} className="mb-4 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Nossa Missão Section - Com título centralizado */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground mt-2 text-lg mx-auto max-w-2xl">Trabalhamos com pilares fundamentais que orientam todas as nossas atividades.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {missaoItens.map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nossa Trajetória Section - Com título centralizado */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nossa Trajetória</h2>
            <p className="text-muted-foreground mt-2 text-lg mx-auto max-w-2xl">Conheça os principais marcos na história do Pet Serpentes & Companhia.</p>
          </div>
          
          <div className="relative">
            {/* Central line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-border transform -translate-x-1/2"></div>
            
            {trajetoriaItens.map((item, index) => (
              <div key={index} className={`mb-12 md:flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center w-full`}>
                <div className="md:w-1/2"></div> {/* Spacer for timeline alignment */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8 lg:pl-12' : 'md:pr-8 lg:pr-12 md:text-right'} relative`}>
                  {/* Dot on the line */}
                  <div className="hidden md:block absolute top-1/2 -mt-2.5 transform -translate-y-1/2 z-10">
                    <div className={`w-5 h-5 rounded-full bg-primary border-4 border-background ${index % 2 === 0 ? 'md:-ml-[calc(50%+0.625rem)]' : 'md:-mr-[calc(50%+0.625rem)] md:left-auto md:right-0' } `}></div>
                  </div>
                   {/* Mobile line */}
                  <div className="md:hidden absolute top-0 left-0 w-0.5 h-full bg-border -ml-2.5"></div>
                  <div className="md:hidden absolute top-4 left-0 w-5 h-5 rounded-full bg-primary border-4 border-background transform -translate-x-1/2 -ml-0.5"></div>

                  <div className="bg-card p-6 rounded-lg shadow-md ml-4 md:ml-0">
                    <p className="text-sm font-semibold text-primary mb-1">{item.year}</p>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
