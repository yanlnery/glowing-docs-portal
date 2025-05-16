import React, { useEffect, useState, useCallback } from "react";
import { Manual } from "@/types/manual";
import ManualsSearch from "@/components/manuals/ManualsSearch";
import ManualsGrid from "@/components/manuals/ManualsGrid";

export default function Manuals() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [filteredManuals, setFilteredManuals] = useState<Manual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const loadManuals = useCallback(() => {
    try {
      const savedManualsString = localStorage.getItem('manuals');
      const loadedManuals = savedManualsString ? JSON.parse(savedManualsString) : [];
      
      if (savedManualsString === null) {
        console.log("Nenhum manual encontrado no localStorage.");
      }
      setManuals(loadedManuals);
      // Apply search query if it exists, otherwise show all loaded manuals
      const query = searchQuery.toLowerCase();
      if (!query.trim()) {
        setFilteredManuals(loadedManuals);
      } else {
        const filtered = loadedManuals.filter((manual: Manual) => 
          manual.title.toLowerCase().includes(query) || 
          (manual.description && manual.description.toLowerCase().includes(query)) || // Added check for description
          manual.category.toLowerCase().includes(query)
        );
        setFilteredManuals(filtered);
      }

    } catch (error) {
      console.error("Failed to load manuals from localStorage:", error);
      setManuals([]);
      setFilteredManuals([]);
    }
  }, [searchQuery]); // searchQuery is a dependency for filtering after load

  useEffect(() => {
    window.scrollTo(0, 0);
    loadManuals();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'manuals') {
        console.log("Manuals storage changed, reloading manuals...");
        loadManuals();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadManuals]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query); // This will trigger re-filtering via loadManuals if needed, or apply filter locally
    
    if (!query.trim()) {
      setFilteredManuals(manuals); // Show all original manuals if query is cleared
      return;
    }
    
    const filtered = manuals.filter(manual => 
      manual.title.toLowerCase().includes(query) || 
      (manual.description && manual.description.toLowerCase().includes(query)) ||
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
    setFilteredManuals(manuals); // Reset to all manuals
  };

  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-12"> {/* Adjusted padding */}
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center"> {/* Adjusted margin */}
        <div className="docs-section-title">
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">Manuais de Criação</h1> {/* Added text-balance, adjusted size */}
        </div>
        <p className="text-muted-foreground max-w-2xl mt-3 sm:mt-4 text-sm sm:text-base">
          Conteúdo técnico e prático para criadores de répteis certificados
        </p>
      </div>
      
      <ManualsSearch 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      <ManualsGrid
        manuals={manuals} // Pass original manuals for reference if needed by grid
        displayedManuals={filteredManuals} // Pass filtered manuals for display
        searchQuery={searchQuery}
        onDownload={handleDownload}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}
