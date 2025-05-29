import React, { useEffect, useState, useCallback } from "react";
import { Manual } from "@/types/manual";
import ManualsSearch from "@/components/manuals/ManualsSearch";
import ManualsGrid from "@/components/manuals/ManualsGrid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Manuals() {
  const [allManuals, setAllManuals] = useState<Manual[]>([]);
  const [filteredManuals, setFilteredManuals] = useState<Manual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadManuals = useCallback(async () => {
    console.log("ManualsPage: Attempting to load manuals...");
    setIsLoading(true);
    const { data, error } = await supabase
      .from('manuals')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      console.error("ManualsPage: Failed to load manuals from Supabase:", error);
      toast({ title: "Erro ao carregar manuais", description: "Não foi possível buscar os manuais.", variant: "destructive" });
      setAllManuals([]);
      setFilteredManuals([]);
    } else {
      console.log("ManualsPage: Manuals fetched successfully:", data);
      setAllManuals(data as Manual[]);
      setFilteredManuals(data as Manual[]); 
    }
    setIsLoading(false);
    console.log("ManualsPage: Loading finished.");
  }, [toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadManuals();
  }, [loadManuals]);
  
  useEffect(() => {
    // Filter logic when searchQuery or allManuals changes
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredManuals(allManuals);
      return;
    }
    const filtered = allManuals.filter(manual => 
      manual.title.toLowerCase().includes(query) || 
      (manual.description && manual.description.toLowerCase().includes(query)) ||
      (manual.category && manual.category.toLowerCase().includes(query))
    );
    setFilteredManuals(filtered);
  }, [searchQuery, allManuals]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDownload = (pdfUrl: string | null, title: string) => {
    if (!pdfUrl) {
        toast({title: "PDF não disponível", description: "O arquivo PDF para este manual não foi encontrado.", variant: "default"});
        return;
    }
    const link = document.createElement('a');
    link.href = pdfUrl;
    // Sanitize title for filename
    const filename = title.replace(/[^a-z0-9_ \-]/gi, '').replace(/\s+/g, '-').toLowerCase() + '.pdf';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredManuals(allManuals);
  };

  if (filteredManuals.length === 0 && !isLoading && searchQuery === '') {
    console.log("ManualsPage: No manuals found on initial load (or after clearing search), rendering fallback in grid.");
  }

  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-3xl sm:text-4xl font-bold text-balance">Manuais de Criação</h1>
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
        manuals={allManuals} // Pass all manuals for context if needed by grid (e.g. total count)
        displayedManuals={filteredManuals}
        searchQuery={searchQuery}
        onDownload={handleDownload}
        onClearSearch={handleClearSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
