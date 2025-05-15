
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ManualsSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ManualsSearch({ searchQuery, onSearchChange }: ManualsSearchProps) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar manual..."
          className="h-10 w-full rounded-md border border-input pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
}
