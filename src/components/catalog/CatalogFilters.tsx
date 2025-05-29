
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ProductCategory, ProductSubcategory } from "@/types/product";

interface CatalogFiltersProps {
  searchQuery: string;
  categoryFilter: ProductCategory | 'all';
  subcategoryFilter: ProductSubcategory | 'all';
  onSearchChange: (query: string) => void;
  onFilterClick: (category: ProductCategory | 'all', subcategory: ProductSubcategory | 'all') => void;
}

export default function CatalogFilters({
  searchQuery,
  categoryFilter,
  subcategoryFilter,
  onSearchChange,
  onFilterClick
}: CatalogFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  // Category filter structure
  const filterCategories = [
    { 
      id: 'all', 
      label: 'Todos', 
      subcategories: [] 
    },
    { 
      id: 'serpente', 
      label: 'Serpentes', 
      subcategories: [
        { id: 'colubrideos', label: 'Colubrídeos' },
        { id: 'boideos', label: 'Boídeos' },
      ] 
    },
    { 
      id: 'lagarto', 
      label: 'Lagartos', 
      subcategories: [
        { id: 'pequenos', label: 'Pequenos' },
        { id: 'grandes', label: 'Grandes' },
      ]
    },
    { 
      id: 'quelonio', 
      label: 'Quelônios', 
      subcategories: [
        { id: 'terrestres', label: 'Terrestres' },
        { id: 'aquaticos', label: 'Aquáticos' },
      ]
    }
  ];

  return (
    <div className="bg-muted/30 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou espécie..."
            className="pl-9 h-11 sm:h-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((category) => (
            <div key={category.id} className="relative">
              <Button 
                variant={
                  (category.id === 'all' && categoryFilter === 'all') ||
                  (category.id !== 'all' && categoryFilter === category.id && subcategoryFilter === 'all')
                    ? "secondary" 
                    : "outline"
                } 
                size="sm"
                onClick={() => {
                  if (category.id === 'all') {
                    onFilterClick('all', 'all');
                  } else if (category.subcategories.length === 0) {
                    onFilterClick(category.id as ProductCategory, 'all');
                  } else {
                    toggleDropdown(category.id);
                  }
                }}
                className="min-h-[44px] flex items-center gap-1 px-3 text-xs sm:text-sm"
              >
                {category.label}
                {category.subcategories.length > 0 && (
                  openDropdown === category.id ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {/* Subcategory Dropdown */}
              {category.subcategories.length > 0 && openDropdown === category.id && (
                <div className="absolute z-10 mt-1 w-full min-w-[180px] sm:w-56 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white/20">
                  <div className="py-1">
                    <button
                      onClick={() => onFilterClick(category.id as ProductCategory, 'all')}
                      className={`block px-4 py-2.5 text-sm w-full text-left ${
                        categoryFilter === category.id && subcategoryFilter === 'all' 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      Todos {category.label}
                    </button>
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onFilterClick(category.id as ProductCategory, sub.id as ProductSubcategory)}
                        className={`block px-4 py-2.5 text-sm w-full text-left ${
                          categoryFilter === category.id && subcategoryFilter === sub.id 
                            ? 'bg-accent text-accent-foreground' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
