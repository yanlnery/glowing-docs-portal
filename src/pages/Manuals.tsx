
import React, { useEffect, useState } from "react";
import { Manual } from "@/types/manual";
import ManualsSearch from "@/components/manuals/ManualsSearch";
import ManualsGrid from "@/components/manuals/ManualsGrid";

export default function Manuals() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [filteredManuals, setFilteredManuals] = useState<Manual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const savedManualsString = localStorage.getItem('manuals');
      const savedManuals = savedManualsString ? JSON.parse(savedManualsString) : [];
      
      if (savedManualsString === null) {
        console.log("Nenhum manual encontrado no localStorage. A lista estará vazia até que sejam adicionados pelo painel.");
      }
      setManuals(savedManuals);
      setFilteredManuals(savedManuals);

    } catch (error) {
      console.error("Failed to load manuals from localStorage:", error);
      setManuals([]);
      setFilteredManuals([]);
    }
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredManuals(manuals);
      return;
    }
    
    const filtered = manuals.filter(manual => 
      manual.title.toLowerCase().includes(query) || 
      manual.description.toLowerCase().includes(query) ||
      manual.category.toLowerCase().includes(query)
    );
    
    setFilteredManuals(filtered);
  };

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title.replace(/\s+/g, '-').toLowerCase() + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredManuals(manuals);
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
      
      <ManualsSearch 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      <ManualsGrid
        manuals={manuals}
        displayedManuals={filteredManuals}
        searchQuery={searchQuery}
        onDownload={handleDownload}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}
