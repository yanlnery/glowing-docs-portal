import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product, ProductCategory, ProductSubcategory } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<ProductSubcategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    loadProducts();
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    try {
      // Get visible products, regardless of availability status
      const visibleProducts = productService.getAvailableProducts();
      
      if (!visibleProducts || visibleProducts.length === 0) {
        console.log("No visible products found");
      } else {
        console.log(`Found ${visibleProducts.length} visible products`);
      }
      
      setProducts(visibleProducts);
      applyFilters(visibleProducts, searchQuery, categoryFilter, subcategoryFilter);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (
    productList: Product[],
    query: string,
    category: ProductCategory | 'all',
    subcategory: ProductSubcategory | 'all'
  ) => {
    if (!productList || productList.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    let result = [...productList];
    
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.speciesName.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    // Apply subcategory filter
    if (subcategory !== 'all') {
      result = result.filter(product => product.subcategory === subcategory);
    }
    
    console.log(`Applied filters: ${result.length} products remain after filtering`);
    setFilteredProducts(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(products, query, categoryFilter, subcategoryFilter);
  };

  const handleFilterClick = (category: ProductCategory | 'all', subcategory: ProductSubcategory | 'all') => {
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    applyFilters(products, searchQuery, category, subcategory);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
    <div className="container px-4 py-12 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Catálogo de Animais</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore nossa seleção de animais disponíveis para aquisição. Todos com procedência, documentação e saúde garantida.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 rounded-lg p-4 mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou espécie..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          {/* Category Filters with Dropdowns */}
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
                      handleFilterClick('all', 'all');
                    } else if (category.subcategories.length === 0) {
                      handleFilterClick(category.id as ProductCategory, 'all');
                    } else {
                      toggleDropdown(category.id);
                    }
                  }}
                  className="min-h-[44px] flex items-center gap-1"
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
                  <div className="absolute z-10 mt-1 w-full min-w-[220px] sm:w-56 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white/20">
                    <div className="py-1">
                      <button
                        onClick={() => handleFilterClick(category.id as ProductCategory, 'all')}
                        className={`block px-4 py-2 text-sm w-full text-left ${
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
                          onClick={() => handleFilterClick(category.id as ProductCategory, sub.id as ProductSubcategory)}
                          className={`block px-4 py-2 text-sm w-full text-left ${
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

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-serpente-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Nenhum produto cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Não há animais disponíveis no momento.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Não encontramos nenhum animal com os filtros selecionados.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setSubcategoryFilter('all');
            applyFilters(products, '', 'all', 'all');
          }}>
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col h-full docs-card-gradient hover:shadow-md transition-shadow">
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center rounded-t-lg">
                    <div className="h-16 w-16 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      <Star className="h-3 w-3 mr-1 inline" /> Destaque
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Novidade
                    </Badge>
                  )}
                  {/* New badge for unavailable products */}
                  {product.status === 'indisponivel' && (
                    <Badge variant="secondary" className="bg-red-100 hover:bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      <AlertCircle className="h-3 w-3 mr-1 inline" /> Indisponível
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-3 pt-0">
                <p className="text-sm text-muted-foreground italic mb-3">{product.speciesName}</p>
                
                <div className="text-xl font-bold text-serpente-600">
                  {formatPrice(product.price)}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 mt-auto">
                <Button 
                  variant={product.status === 'indisponivel' ? "secondary" : "outline"} 
                  className="w-full" 
                  asChild
                  disabled={product.status === 'indisponivel'}
                >
                  <Link to={`/produtos/${product.id}`}>
                    {product.status === 'indisponivel' ? 'Esgotado' : 'Ver Detalhes'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
