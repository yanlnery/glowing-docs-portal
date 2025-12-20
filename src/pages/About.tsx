import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Leaf, BookOpen, Award, Heart } from 'lucide-react';

const About = () => {
  const origemText = {
    title: "A Origem do Criadouro",
    paragraphs: [
      "O Pet Serpentes & Companhia nasceu da paixão por répteis e do desejo de trabalhar com criação legalizada no Brasil. O que começou como um interesse pessoal em terrários e aquários se transformou em um criadouro comercial focado em espécies nativas.",
      "O projeto começou oficialmente em 2015 com aves exóticas, mas foi em 2019 que os répteis se tornaram o foco principal da operação. Desde então, o criadouro vem crescendo e se consolidando no mercado de herpetocultura."
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
      "Queremos ser referência em criação responsável de répteis no Brasil. Isso significa investir constantemente em bem-estar animal, recintos melhores, compartilhar conhecimento de forma honesta e contribuir para que mais pessoas entendam e respeitem nossa fauna nativa.",
      "Trabalhamos para elevar o padrão da herpetocultura brasileira, mostrando que é possível criar répteis com qualidade, dentro da lei e com respeito aos animais."
    ]
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
    <>
      <Helmet>
        <title>Quem Somos | Pet Serpentes & Companhia</title>
        <meta 
          name="description" 
          content="Conheça a história do Pet Serpentes & Companhia, criadouro comercial legalizado no Rio de Janeiro. Nossa missão, valores e trajetória na criação responsável de répteis nativos." 
        />
      </Helmet>
      <div className="bg-background text-foreground py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Nossa História Section - Header */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Quem Somos</h2>
            <p className="text-muted-foreground mb-8 text-lg mx-auto max-w-2xl">
              Conheça a trajetória e a missão do Pet Serpentes & Companhia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
            <div className="order-1 md:order-1">
              <img 
                src="/lovable-uploads/13113c77-f713-4585-9041-1766e67545b8.png" 
                alt="Yan Nery, CEO e Biólogo do Pet Serpentes & Companhia" 
                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[4/5] md:aspect-auto" 
              />
            </div>
            <div className="order-2 md:order-2 prose prose-invert max-w-none text-foreground">
              <h3 className="text-2xl font-semibold text-foreground mb-4">{origemText.title}</h3>
              {origemText.paragraphs.map((p, index) => (
                <p key={index} className="mb-4 leading-relaxed text-foreground/90">{p}</p>
              ))}
            </div>
          </div>

          {/* O Que Fazemos */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
            <div className="order-2 md:order-1 prose prose-invert max-w-none text-foreground">
              <h3 className="text-2xl font-semibold text-foreground mb-4">{oQueFazemosText.title}</h3>
              {oQueFazemosText.paragraphs.map((p, index) => (
                <p key={index} className="mb-4 leading-relaxed text-foreground/90">{p}</p>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="/lovable-uploads/c988fe8f-9ba2-4b94-a8e7-a7347e0d0a84.png" 
                alt="Instalações do Pet Serpentes & Companhia" 
                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[4/3]" 
              />
            </div>
          </div>

          {/* Nosso Propósito */}
          <div className="bg-card p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-foreground mb-4 text-center">{propositoText.title}</h3>
            <div className="max-w-3xl mx-auto">
              {propositoText.paragraphs.map((p, index) => (
                <p key={index} className="mb-4 leading-relaxed text-foreground/90 text-center">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Nossa Missão Section */}
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

        {/* Nossa Trajetória Section */}
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
                <div className="md:w-1/2"></div>
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8 lg:pl-12' : 'md:pr-8 lg:pr-12 md:text-right'} relative`}>
                  <div className="hidden md:block absolute top-1/2 -mt-2.5 transform -translate-y-1/2 z-10">
                    <div className={`w-5 h-5 rounded-full bg-primary border-4 border-background ${index % 2 === 0 ? 'md:-ml-[calc(50%+0.625rem)]' : 'md:-mr-[calc(50%+0.625rem)] md:left-auto md:right-0' } `}></div>
                  </div>
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
    </>
  );
};

export default About;
