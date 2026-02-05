import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { 
  Package, 
  Eye,
  Clock,
  MessageCircle,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  Copy,
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge';
import { OrderFilters } from '@/components/admin/orders/OrderFilters';
import AdminLayout from '@/layouts/AdminLayout';

export default function OrdersAdmin() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await orderService.getAllOrders();
    
    if (error) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setOrders((data as Order[]) || []);
    }
    setIsLoading(false);
  };

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        (order as any).order_number?.toLowerCase().includes(term) ||
        order.customer_name?.toLowerCase().includes(term) ||
        order.customer_cpf?.includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Period filter
    if (periodFilter !== 'all') {
      const days = parseInt(periodFilter);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      filtered = filtered.filter(order => new Date(order.created_at) >= startDate);
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, periodFilter]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    contacted: orders.filter(o => (o.status as string) === 'contacted').length,
    confirmed: orders.filter(o => (o.status as string) === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPeriodFilter('all');
  };

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    toast({
      title: "Copiado!",
      description: `Número do pedido ${orderNumber} copiado.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Pedidos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os pedidos da loja
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-700">{stats.pending}</span>
              </div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">{stats.contacted}</span>
              </div>
              <div className="text-sm text-muted-foreground">Contatados</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{stats.confirmed}</span>
              </div>
              <div className="text-sm text-muted-foreground">Confirmados</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Truck className="h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">{stats.shipped}</span>
              </div>
              <div className="text-sm text-muted-foreground">Enviados</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Package className="h-4 w-4 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-700">{stats.delivered}</span>
              </div>
              <div className="text-sm text-muted-foreground">Entregues</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <OrderFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              periodFilter={periodFilter}
              onPeriodChange={setPeriodFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || periodFilter !== 'all'
                    ? "Nenhum pedido corresponde aos filtros aplicados."
                    : "Ainda não há pedidos registrados."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(order.created_at), "dd/MM/yy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-sm">
                            {(order as any).order_number || `#${order.id.substring(0, 8)}`}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyOrderNumber((order as any).order_number || order.id.substring(0, 8))}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">
                            {order.customer_cpf || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatPrice(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/pedidos/${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
