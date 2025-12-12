import React, { useEffect, useState, useCallback } from "react";
import { Manual } from "@/types/manual";
import ManualsSearch from "@/components/manuals/ManualsSearch";
import ManualsGrid from "@/components/manuals/ManualsGrid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useMaterialDownload } from "@/hooks/useMaterialDownload";
import MaterialDownloadGate from "@/components/materials/MaterialDownloadGate";

export default function Manuals() {
  const [allManuals, setAllManuals] = useState<Manual[]>([]);
  const [filteredManuals, setFilteredManuals] = useState<Manual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { isGateOpen, pendingDownload, handleDownload, closeGate, onDownloadComplete } = useMaterialDownload();

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

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredManuals(allManuals);
  };

  if (filteredManuals.length === 0 && !isLoading && searchQuery === '') {
    console.log("ManualsPage: No manuals found on initial load (or after clearing search), rendering fallback in grid.");
  }

  return (
    <div className="container px-4 md:px-6 py-8 sm:py-12">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">Manuais de Criação</h1>
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
        manuals={allManuals}
        displayedManuals={filteredManuals}
        searchQuery={searchQuery}
        onDownload={handleDownload}
        onClearSearch={handleClearSearch}
        isLoading={isLoading}
      />

      {/* Material Download Gate Modal */}
      {pendingDownload && (
        <MaterialDownloadGate
          isOpen={isGateOpen}
          onClose={closeGate}
          materialTitle={pendingDownload.title}
          pdfUrl={pendingDownload.pdfUrl}
          onDownloadComplete={onDownloadComplete}
        />
      )}
    </div>
  );
}
