
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  category: string;
}

const searchDatabase: SearchResult[] = [
  { 
    title: "Getting Started", 
    path: "/", 
    excerpt: "Learn how to set up and start using our product", 
    category: "Guide"
  },
  { 
    title: "API Reference", 
    path: "/api", 
    excerpt: "Comprehensive API documentation for developers", 
    category: "API"
  },
  { 
    title: "Examples", 
    path: "/examples", 
    excerpt: "Code examples and interactive playground", 
    category: "Example"
  },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const filteredResults = searchDatabase.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setResults(filteredResults);
  };

  const handleResultClick = (path: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <Button 
        variant="outline" 
        className="w-full md:w-64 lg:w-80 justify-start text-muted-foreground px-3 gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        <span>Quick search...</span>
        <kbd className="hidden md:inline-flex ml-auto h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-24">
          <div className="bg-card border shadow-xl rounded-lg w-full max-w-2xl mx-4 overflow-hidden animate-fade-in">
            <div className="flex items-center border-b p-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Type to search..."
                className="bg-transparent border-0 shadow-none focus-visible:ring-0 text-base px-0"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <Button size="sm" variant="ghost" className="ml-2" onClick={() => setIsOpen(false)}>
                <X size={18} />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            {results.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.map((result, i) => (
                  <div 
                    key={i} 
                    className="p-3 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleResultClick(result.path)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.title}</h3>
                      <span className="text-xs bg-accent/30 text-accent-foreground px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{result.excerpt}</p>
                  </div>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-8 text-center">
                <p>No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : null}
            
            <div className="bg-muted/40 px-4 py-2 text-xs flex items-center justify-between border-t">
              <div className="flex gap-2">
                <span>↑↓ Navigate</span>
                <span>↩ Select</span>
                <span>ESC Dismiss</span>
              </div>
              <span className="text-muted-foreground">Search by PET SERPENTES</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
