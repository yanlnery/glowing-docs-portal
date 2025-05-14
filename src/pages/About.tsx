import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, BookOpen, Flag, Heart } from "lucide-react";

export default function About() {
  const newBiography = [
    "O Pet Serpentes & Companhia é conduzido por Yan Nery, professor e biólogo apaixonado por herpetologia desde criança. Yan cresceu como aquarista entusiasta, sempre entre aquários e terrários, montando desde pequenos aquários até sistemas marinhos complexos, como também terrários bioativos, o que moldou sua curiosidade e respeito pela vida selvagem.",
    "Em 2023, Yan assumiu a frente do criadouro, dando continuidade ao trabalho iniciado por Daniel Leirião em 2015, quando o empreendimento nasceu como um criadouro de aves exóticas. A partir de 2019, os répteis passaram a fazer parte do manejo legalizado, e hoje representam o foco principal da operação.",
    "Localizado no Rio de Janeiro e com certificação do IBAMA e INEA-RJ, o criadouro se dedica à criação responsável, à promoção do bem-estar animal e à disseminação de conhecimento sobre espécies nativas. Atuamos com ética, transparência e compromisso com a educação ambiental e científica, incluindo parcerias com escolas públicas e apoio a pesquisas acadêmicas.",
    "Nosso propósito vai além da comercialização: queremos ser referência nacional em bem-estar animal, desenvolvendo recintos naturais e espaçosos que simulem o habitat das espécies — elevando o padrão do setor."
  ];

  return (
    <div>
      {/* Hero Section - Background image removed */}
      <section className="relative bg-serpente-900 text-white">
        {/* The div with background image and opacity-30 has been removed */}
        <div className="container relative z-10 px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossa História</h1>
            <p className="text-xl text-white/80 mb-6">
              Conheça a trajetória e a missão do Pet Serpentes & Companhia
            </p>
          </div>
        </div>
      </section>
      
      {/* Founder Story - Updated subtitle and biography */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <img 
                src="/lovable-uploads/6a2fd199-0d12-4c44-986a-c3bd3551768e.png" 
                alt="Yan Nery" 
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="docs-section-title">
                <h2 className="text-3xl font-bold">Yan Nery</h2>
              </div>
              <p className="text-muted-foreground mb-6">CEO e Biólogo</p> {/* Removed "especialista" */}
              
              <div className="space-y-4 text-lg">
                {newBiography.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="inline-flex items-center text-xs bg-muted px-2.5 py-1 rounded-full">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Biólogo
                </span>
                <span className="inline-flex items-center text-xs bg-muted px-2.5 py-1 rounded-full">
                  {/* Using Heart as a generic "Creator" icon if Users icon was for something else */}
                  <Heart className="h-3 w-3 mr-1" /> 
                  Criador
                </span>
                 {/* Removed "Pesquisador" tag as it's not directly mentioned in the new bio summary as a primary current role like "CEO e Biólogo" or "Criador" */}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Values */}
      <section className="py-16 bg-muted/30 snake-pattern-bg">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Nossa Missão</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Trabalhamos com três pilares fundamentais que orientam todas as nossas atividades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Conservação</h3>
              <p className="text-muted-foreground">
                Promovemos práticas sustentáveis de criação que contribuem para a conservação das espécies.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Educação</h3>
              <p className="text-muted-foreground">
                Compartilhamos conhecimento para formar tutores mais conscientes e promover a posse responsável no Brasil.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Flag className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excelência</h3>
              <p className="text-muted-foreground">
                Asseguramos os mais altos padrões de qualidade no manejo, reprodução e venda de répteis para criadores responsáveis.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Heart className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bem-estar Animal</h3>
              <p className="text-muted-foreground">
                Garantimos ambiente, alimentação e estímulos adequados para o desenvolvimento saudável de cada animal.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Nossa Trajetória</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Conheça os principais marcos na história do Pet Serpentes & Companhia
            </p>
          </div>
          
          <div className="relative border-l border-serpente-600 pl-8 ml-4 md:ml-0 md:mx-auto md:max-w-3xl space-y-12">
            <div className="relative">
              <div className="absolute -left-[2.15rem] bg-serpente-600 rounded-full w-4 h-4"></div>
              <div>
                <span className="text-sm text-muted-foreground">2012</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Fundação do Criadouro</h3>
                <p className="text-foreground/80">
                  Pet Serpentes inicia oficialmente o criadouro com apenas 10 espécimes e obtém os primeiros registros junto aos órgãos ambientais.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[2.15rem] bg-serpente-600 rounded-full w-4 h-4"></div>
              <div>
                <span className="text-sm text-muted-foreground">2015</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Expansão do Plantel</h3>
                <p className="text-foreground/80">
                  O criadouro se expande para mais de 50 animais de diversas espécies e começa a realizar as primeiras vendas comerciais.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[2.15rem] bg-serpente-600 rounded-full w-4 h-4"></div>
              <div>
                <span className="text-sm text-muted-foreground">2018</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Início do Programa Educacional</h3>
                <p className="text-foreground/80">
                  Lançamento do primeiro material educativo voltado para escolas e universidades, promovendo o conhecimento sobre répteis.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[2.15rem] bg-serpente-600 rounded-full w-4 h-4"></div>
              <div>
                <span className="text-sm text-muted-foreground">2020</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Lançamento da Pet Serpentes Academy</h3>
                <p className="text-foreground/80">
                  Criação da plataforma online com cursos e conteúdos exclusivos para entusiastas e criadores de répteis.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[2.15rem] bg-serpente-600 rounded-full w-4 h-4"></div>
              <div>
                <span className="text-sm text-muted-foreground">2023</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Expansão Nacional</h3>
                <p className="text-foreground/80">
                  O criadouro alcança reconhecimento nacional, realizando vendas para todo o Brasil e firmando parcerias com instituições de pesquisa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-serpente-600 text-white">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Conheça nossas espécies</h2>
              <p className="text-white/80">Descubra as serpentes e lagartos disponíveis para venda</p>
            </div>
            <Button size="lg" variant="outline" className="bg-white text-serpente-600 hover:bg-white/90 border-none" asChild>
              <Link to="/catalogo">Explorar Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Certifications */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Certificações e Licenças</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4 mb-12">
              Atuamos em total conformidade com a legislação ambiental brasileira
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="bg-muted p-6 rounded-full mb-4">
                  <img src="https://via.placeholder.com/80x80" alt="IBAMA" className="h-20 w-20" />
                </div>
                <h3 className="font-semibold">IBAMA</h3>
                <p className="text-sm text-muted-foreground">Reg. 123456</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-muted p-6 rounded-full mb-4">
                  <img src="https://via.placeholder.com/80x80" alt="INEA" className="h-20 w-20" />
                </div>
                <h3 className="font-semibold">INEA</h3>
                <p className="text-sm text-muted-foreground">Reg. ABC123</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-muted p-6 rounded-full mb-4">
                  <img src="https://via.placeholder.com/80x80" alt="SisPass" className="h-20 w-20" />
                </div>
                <h3 className="font-semibold">SisPass</h3>
                <p className="text-sm text-muted-foreground">Reg. XYZ789</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-muted p-6 rounded-full mb-4">
                  <img src="https://via.placeholder.com/80x80" alt="CRMV-RJ" className="h-20 w-20" />
                </div>
                <h3 className="font-semibold">CRMV-RJ</h3>
                <p className="text-sm text-muted-foreground">Parceria Técnica</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
