
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search } from "lucide-react"; // Removed Upload as it's not used here
import { Input } from "@/components/ui/input";

interface Manual {
  id: string;
  title: string;
  description: string;
  pages: number;
  image: string;
  category: string;
  pdfUrl: string;
  pdfFile?: File; // This might be relevant if manuals are created client-side then stored
}

export default function Manuals() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [filteredManuals, setFilteredManuals] = useState<Manual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const savedManualsString = localStorage.getItem('manuals');
      const savedManuals = savedManualsString ? JSON.parse(savedManualsString) : [];
      setManuals(savedManuals);
      setFilteredManuals(savedManuals);
      if (savedManuals.length === 0) {
        console.log("Nenhum manual encontrado no localStorage.");
      }
    } catch (error) {
      console.error("Falha ao carregar manuais do localStorage:", error);
      setManuals([]);
      setFilteredManuals([]);
    }
  }, []);
  
  // REMOVED: defaultManuals array and logic to fall back to it.
  // The component will now show an empty state if no manuals are in localStorage.

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredManuals(manuals); // Show all loaded manuals
      return;
    }
    
    const filtered = manuals.filter(manual => 
      manual.title.toLowerCase().includes(query) || 
      manual.description.toLowerCase().includes(query) ||
      manual.category.toLowerCase().includes(query)
    );
    
    setFilteredManuals(filtered);
  };

  // Use filteredManuals directly. If manuals from localStorage is empty, filteredManuals will also be empty.
  const displayedManuals = filteredManuals;

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title.replace(/\s+/g, '-').toLowerCase() + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <Input
            type="text"
            placeholder="Buscar manual..."
            className="h-10 w-full rounded-md border border-input pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Manuals Grid */}
      {manuals.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">Nenhum manual cadastrado</h3>
          <p className="text-sm text-muted-foreground">
            Ainda não há manuais disponíveis. Volte em breve!
          </p>
        </div>
      ) : displayedManuals.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum manual encontrado para "{searchQuery}".
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setFilteredManuals(manuals);
            }}
          >
            Limpar Busca
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedManuals.map((manual) => (
            <div key={manual.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={manual.image}
                  alt={manual.title} 
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
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
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => handleDownload(manual.pdfUrl, manual.title)}
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
