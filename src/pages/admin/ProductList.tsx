
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { productService } from '@/services/productService';
import { Product, ProductStatus } from '@/types/product';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Edit, Trash2, EyeOff, Eye, Star, Clock, 
  Search, Plus, Filter, CheckCircle, XCircle, 
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts();
    
    // Check for status filter in URL params
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status && ['disponivel', 'indisponivel', 'vendido'].includes(status)) {
      setStatusFilter(status as ProductStatus);
    }
  }, [location.search]);

  const loadProducts = () => {
    const allProducts = productService.getAll();
    setProducts(allProducts);
    applyFilters(allProducts, searchQuery, statusFilter);
  };

  const applyFilters = (
    productList: Product[], 
    query: string, 
    status: ProductStatus | 'all'
  ) => {
    let result = [...productList];
    
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.speciesName.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      result = result.filter(product => product.status === status);
    }
    
    // Sort products
    result.sort((a, b) => {
      // Sort by featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then sort by order
      return a.order - b.order;
    });
    
    setFilteredProducts(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(products, query, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    const status = value as ProductStatus | 'all';
    setStatusFilter(status);
    applyFilters(products, searchQuery, status);
    
    // Update URL without reload
    const params = new URLSearchParams(location.search);
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleToggleVisibility = (id: string, currentVisible: boolean) => {
    try {
      productService.update(id, { visible: !currentVisible });
      loadProducts();
      toast({
        title: "Visibilidade atualizada",
        description: `Produto ${!currentVisible ? 'visível' : 'oculto'} no site`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar visibilidade",
        description: "Não foi possível atualizar o produto",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    try {
      productService.update(id, { featured: !currentFeatured });
      loadProducts();
      toast({
        title: "Status de destaque atualizado",
        description: `Produto ${!currentFeatured ? 'destacado' : 'removido dos destaques'}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar destaque",
        description: "Não foi possível atualizar o produto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteProductId(id);
  };

  const confirmDelete = () => {
    if (!deleteProductId) return;
    
    try {
      const success = productService.delete(deleteProductId);
      if (success) {
        loadProducts();
        toast({
          title: "Produto excluído",
          description: "O produto foi removido com sucesso",
          variant: "default",
        });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível remover o produto",
        variant: "destructive",
      });
    } finally {
      setDeleteProductId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteProductId(null);
  };

  const getStatusIcon = (status: ProductStatus) => {
    switch (status) {
      case 'disponivel':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'indisponivel':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'vendido':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'indisponivel':
        return 'Indisponível';
      case 'vendido':
        return 'Vendido';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre os produtos por status ou use a busca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar produto..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="disponivel">Disponíveis</SelectItem>
                    <SelectItem value="indisponivel">Indisponíveis</SelectItem>
                    <SelectItem value="vendido">Vendidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 sm:p-6">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Espécie</TableHead>
                    <TableHead className="hidden lg:table-cell">Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Visibilidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.featured && (
                            <Star className="h-5 w-5 text-yellow-500" />
                          )}
                          {product.isNew && !product.featured && (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm italic">{product.speciesName}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {product.price > 0 
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(product.price)
                            : 'Sob consulta'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(product.status)}
                            <span className="hidden sm:inline">
                              {getStatusText(product.status)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {product.visible ? (
                            <Eye className="h-5 w-5 text-green-500" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Abrir menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="19" cy="12" r="1" />
                                  <circle cx="5" cy="12" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/products/edit/${product.id}`} className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleToggleVisibility(product.id, product.visible)}
                              >
                                {product.visible ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Ocultar
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Mostrar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleFeatured(product.id, product.featured)}
                              >
                                <Star className="mr-2 h-4 w-4" />
                                {product.featured ? 'Remover destaque' : 'Destacar'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-500"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum produto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteProductId} onOpenChange={() => !deleteProductId && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ProductList;
