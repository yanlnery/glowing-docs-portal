
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import { productService } from '@/services/productService';
import { Product, ProductCategory, ProductSubcategory } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<ProductSubcategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    loadProducts();
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    try {
      // Get only available and visible products
      const availableProducts = productService.getAvailableProducts();
      
      if (!availableProducts || availableProducts.length === 0) {
        console.log("No available products found");
      } else {
        console.log(`Found ${availableProducts.length} available products`);
      }
      
      setProducts(availableProducts);
      applyFilters(availableProducts, searchQuery, categoryFilter, subcategoryFilter);
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

  const handleCategoryFilter = (value: string) => {
    const category = value as ProductCategory | 'all';
    setCategoryFilter(category);
    applyFilters(products, searchQuery, category, subcategoryFilter);
  };

  const handleSubcategoryFilter = (value: string) => {
    const subcategory = value as ProductSubcategory | 'all';
    setSubcategoryFilter(subcategory);
    applyFilters(products, searchQuery, categoryFilter, subcategory);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <WebsiteLayout>
      <div className="container px-4 py-12 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Catálogo de Animais</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore nossa seleção de animais disponíveis para aquisição. Todos com procedência, documentação e saúde garantida.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-muted/30 rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou espécie..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="serpente">Serpentes</SelectItem>
                  <SelectItem value="lagarto">Lagartos</SelectItem>
                  <SelectItem value="quelonio">Quelônios</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={subcategoryFilter} onValueChange={handleSubcategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Subcategoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Subcategorias</SelectItem>
                  <SelectItem value="boideos">Boídeos</SelectItem>
                  <SelectItem value="colubrideos">Colubrídeos</SelectItem>
                  <SelectItem value="pequenos">Pequenos</SelectItem>
                  <SelectItem value="grandes">Grandes</SelectItem>
                  <SelectItem value="aquaticos">Aquáticos</SelectItem>
                  <SelectItem value="terrestres">Terrestres</SelectItem>
                </SelectContent>
              </Select>
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
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/produtos/${product.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </WebsiteLayout>
  );
};

export default Catalog;
