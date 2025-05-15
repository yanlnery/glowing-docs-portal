
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
      year: "2012",
      title: "Fundação do Criadouro",
      text: "Pet Serpentes inicia oficialmente o criadouro com apenas 10 espécimes e obtém os primeiros registros junto aos órgãos ambientais."
    },
    {
      year: "2015",
      title: "Expansão do Plantel",
      text: "O criadouro se expande para mais de 50 animais de diversas espécies e começa a realizar as primeiras vendas comerciais."
    },
    {
      year: "2018",
      title: "Início do Programa Educacional",
      text: "Lançamento do primeiro material educativo voltado para escolas e universidades, promovendo o conhecimento sobre répteis."
    },
    {
      year: "2020",
      title: "Lançamento da Pet Serpentes Academy",
      text: "Criação da plataforma online com cursos e conteúdos exclusivos para entusiastas e criadores de répteis."
    },
    {
      year: "2023",
      title: "Expansão Nacional",
      text: "O criadouro alcança reconhecimento nacional, realizando vendas para todo o Brasil e firmando parcerias com instituições de pesquisa."
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
                src="/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png" 
                alt="Yan Nery no Pet Serpentes & Companhia" 
                className="w-full h-auto rounded-lg shadow-lg object-cover" 
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
