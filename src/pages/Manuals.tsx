
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search } from "lucide-react";

const manuals = [
  {
    id: 1,
    title: "Manual de Criação de Boídeos",
    description: "Guia completo para criação e reprodução de serpentes da família Boidae.",
    pages: 32,
    image: "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    pdfUrl: "#"
  },
  {
    id: 2,
    title: "Manual de Criação de Cobra d'Água",
    description: "Técnicas e cuidados específicos para a criação de Erythrolamprus miliaris em cativeiro.",
    pages: 28,
    image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    pdfUrl: "#"
  },
  {
    id: 3,
    title: "Manual de Criação de Iguanas",
    description: "Habitat, alimentação e reprodução de iguanas em ambiente controlado.",
    pages: 45,
    image: "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    pdfUrl: "#"
  },
  {
    id: 4,
    title: "Manual de Criação de Jabutis",
    description: "Guia detalhado para manejo de quelônios terrestres brasileiros.",
    pages: 36,
    image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    pdfUrl: "#"
  },
  {
    id: 5,
    title: "Manual de Criação de Diploglossus",
    description: "Práticas recomendadas para a criação da Cobra-de-vidro (Diploglossus fasciatus).",
    pages: 24,
    image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    pdfUrl: "#"
  },
  {
    id: 6,
    title: "Manual de Criação de Teiús",
    description: "Técnicas profissionais para o manejo de Tupinambis spp. em cativeiro.",
    pages: 40,
    image: "https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    pdfUrl: "#"
  }
];

export default function Manuals() {
  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Manuais de Criação</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Conteúdo técnico e prático para criadores de répteis certificados
        </p>
      </div>
      
      {/* Search */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar manual..."
            className="h-10 w-full rounded-md border border-input pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      {/* Manuals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {manuals.map((manual) => (
          <div key={manual.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={manual.image}
                alt={manual.title} 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4">
                  <span className="inline-flex items-center gap-1 bg-white/90 text-serpente-800 text-xs px-2 py-1 rounded">
                    <FileText className="h-3 w-3" /> {manual.pages} páginas
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-bold text-lg mb-2">{manual.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{manual.description}</p>
            </div>
            <div className="p-4 pt-0 mt-auto">
              <Button className="w-full" variant="outline" asChild>
                <a href={manual.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Baixar PDF
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
