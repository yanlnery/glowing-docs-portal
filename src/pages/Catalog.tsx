import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product, ProductCategory, ProductSubcategory } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';

const PRODUCTS_STORAGE_KEY = "pet_serpentes_products";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<ProductSubcategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Debug logs para verificar hidratação
  useEffect(() => {
    console.log("📱 CATALOG MOUNT CHECK:", {
      windowExists: typeof window !== "undefined",
      windowWidth: typeof window !== "undefined" ? window.innerWidth : "undefined",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "undefined",
      isMobile: typeof window !== "undefined" && window.innerWidth < 768
    });
  }, []);

  const applyFilters = useCallback((
    productList: Product[],
    query: string,
    category: ProductCategory | 'all',
    subcategory: ProductSubcategory | 'all'
  ) => {
    console.log("🔄 Aplicando filtros:", { totalProducts: productList.length, query, category, subcategory });
    
    if (!productList || productList.length === 0) {
      console.log("📭 Nenhum produto para filtrar");
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
        (product.description && product.description.toLowerCase().includes(lowerQuery))
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
    
    console.log(`✅ Filtros aplicados: ${result.length} produtos restantes`);
    setFilteredProducts(result);
  }, []);

  const loadProducts = useCallback(() => {
    setIsLoading(true);
    console.log("📱 Catalog Mobile rendering? Window width:", typeof window !== "undefined" ? window.innerWidth : "No window");
    console.log("🔄 Carregando produtos do catálogo...");
    try {
      const visibleProducts = productService.getAvailableProducts();
      console.log("📦 Produtos carregados:", visibleProducts.length);
      console.log("📱 CATALOG - produtos visíveis:", visibleProducts.map(p => ({ id: p.id, name: p.name, visible: p.visible })));
      setProducts(visibleProducts);
      applyFilters(visibleProducts, searchQuery, categoryFilter, subcategoryFilter);
    } catch (error) {
      console.error("❌ Erro ao carregar produtos:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [applyFilters, searchQuery, categoryFilter, subcategoryFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts();
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PRODUCTS_STORAGE_KEY) {
        console.log("🔄 Storage alterado, recarregando produtos...");
        loadProducts();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadProducts]);

  // Log adicional para verificar render do mobile no catálogo
  useEffect(() => {
    console.log("📱 CATALOG Render mobile section - produtos filtered count:", filteredProducts?.length);
    console.log("📱 CATALOG Filtered products data:", filteredProducts);
  }, [filteredProducts]);

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
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-balance">Catálogo de Animais</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
          Explore nossa seleção de animais disponíveis para aquisição. Todos com procedência, documentação e saúde garantida.
        </p>
      </div>

      {/* Filters */}
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
                      handleFilterClick('all', 'all');
                    } else if (category.subcategories.length === 0) {
                      handleFilterClick(category.id as ProductCategory, 'all');
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
                        onClick={() => handleFilterClick(category.id as ProductCategory, 'all')}
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
                          onClick={() => handleFilterClick(category.id as ProductCategory, sub.id as ProductSubcategory)}
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

      {/* Products Grid com debug styles e logs específicos */}
      {isLoading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-serpente-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum produto cadastrado</h3>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Não há animais disponíveis no momento. Verifique o painel administrativo para adicionar produtos.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Não encontramos nenhum animal com os filtros selecionados.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setSubcategoryFilter('all');
            applyFilters(products, '', 'all', 'all');
          }} className="min-h-[44px] px-6">
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div 
          className="w-full min-h-[400px] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          style={{ 
            minHeight: "400px", 
            height: "auto",
            overflow: "visible",
            zIndex: 1 
          }}
          onLoad={() => console.log("📱 CATALOG Grid container loaded")}
        >
          {filteredProducts.map((product, index) => {
            console.log(`📱 CATALOG MOBILE - Renderizando produto ${index}:`, { 
              id: product.id, 
              name: product.name, 
              hasImages: product.images && product.images.length > 0 
            });
            
            return (
              <Card 
                key={product.id} 
                className="flex flex-col h-full docs-card-gradient hover:shadow-lg transition-shadow duration-300"
                style={{
                  minHeight: "300px",
                  height: "auto",
                  overflow: "visible"
                }}
                onLoad={() => console.log(`📱 CATALOG Product ${index} card loaded`)}
              >
                <div className="relative">
                  {product.images && product.images.length > 0 ? (
                    <div 
                      className="aspect-[4/3] overflow-hidden rounded-t-lg"
                      style={{
                        width: "100%",
                        height: "auto",
                        minHeight: "120px"
                      }}
                    >
                      <OptimizedImage
                        src={product.images[0].url}
                        alt={product.name}
                        priority={index < 4}
                        quality={80}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-full"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          width: "100%",
                          height: "100%",
                          transform: "scale(1)",
                          transition: "transform 0.3s ease"
                        }}
                        onLoad={() => console.log(`✅ CATALOG MOBILE - Produto ${product.name} imagem carregada no catálogo`)}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center rounded-t-lg">
                      <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs text-center">Sem imagem</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {product.featured && (
                      <Badge variant="secondary" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-1.5 py-0.5">
                        <Star className="h-3 w-3 mr-1 inline" /> Destaque
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0.5">
                        Novidade
                      </Badge>
                    )}
                    {product.status === 'indisponivel' && (
                      <Badge variant="secondary" className="bg-red-100 hover:bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-1.5 py-0.5">
                        <AlertCircle className="h-3 w-3 mr-1 inline" /> Indisponível
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader className="p-2 sm:p-3 pb-1 sm:pb-2">
                  <CardTitle className="text-sm sm:text-base text-balance line-clamp-2">{product.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-2 sm:p-3 pt-0 pb-1 sm:pb-2">
                  <p className="text-xs sm:text-sm text-muted-foreground italic mb-2 line-clamp-1">{product.speciesName}</p>
                  
                  <div className="text-sm sm:text-lg font-bold text-serpente-600">
                    {formatPrice(product.price)}
                  </div>
                </CardContent>
                
                <CardFooter className="p-2 sm:p-3 pt-0 mt-auto">
                  <Button 
                    variant={product.status === 'indisponivel' ? "secondary" : "outline"} 
                    className="w-full min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm"
                    asChild
                    disabled={product.status === 'indisponivel'}
                  >
                    <Link to={`/produtos/${product.id}`}>
                      {product.status === 'indisponivel' ? 'Esgotado' : 'Ver Detalhes'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Catalog;
