import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  Eye,
  Edit,
  Filter
} from "lucide-react";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";

export default function OrdersAdmin() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

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
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_cpf?.includes(searchTerm) ||
        order.id.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await orderService.updateOrderStatus(orderId, newStatus);
    
    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Status atualizado",
        description: "Status do pedido atualizado com sucesso"
      });
      fetchOrders();
    }
  };

  const handleTrackingUpdate = async (orderId: string) => {
    if (!trackingCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código de rastreamento",
        variant: "destructive"
      });
      return;
    }

    const { error } = await orderService.updateTrackingCode(orderId, trackingCode);
    
    if (error) {
      toast({
        title: "Erro ao adicionar código",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Código adicionado",
        description: "Código de rastreamento adicionado com sucesso"
      });
      setTrackingCode('');
      fetchOrders();
      setIsOrderDialogOpen(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: Clock, label: "Pendente" },
      processing: { variant: "default" as const, icon: Package, label: "Processando" },
      shipped: { variant: "default" as const, icon: Truck, label: "Enviado" },
      delivered: { variant: "default" as const, icon: CheckCircle, label: "Entregue" },
      cancelled: { variant: "destructive" as const, icon: XCircle, label: "Cancelado" }
    };
    
    const config = variants[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Pedidos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os pedidos da loja
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{orderStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
              <div className="text-sm text-muted-foreground">Processando</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{orderStats.shipped}</div>
              <div className="text-sm text-muted-foreground">Enviados</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
              <div className="text-sm text-muted-foreground">Entregues</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou ID do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Carregando pedidos...</div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? "Nenhum pedido corresponde aos filtros aplicados."
                  : "Ainda não há pedidos registrados."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">Pedido #{order.id.substring(0, 8)}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>Cliente: {order.customer_name || 'N/A'}</div>
                      <div>CPF: {order.customer_cpf || 'N/A'}</div>
                      <div>Data: {new Date(order.created_at).toLocaleDateString()}</div>
                      <div>Total: {formatPrice(order.total_amount)}</div>
                      <div>Itens: {order.order_items?.length || 0}</div>
                      {order.tracking_code && (
                        <div>Rastreamento: {order.tracking_code}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog 
                      open={isOrderDialogOpen && selectedOrder?.id === order.id} 
                      onOpenChange={(open) => {
                        setIsOrderDialogOpen(open);
                        if (open) setSelectedOrder(order);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido #{order.id.substring(0, 8)}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Status atual</Label>
                              <div className="mt-1">{getStatusBadge(order.status)}</div>
                            </div>
                            <div>
                              <Label>Alterar status</Label>
                              <Select onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="processing">Processando</SelectItem>
                                  <SelectItem value="shipped">Enviado</SelectItem>
                                  <SelectItem value="delivered">Entregue</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Código de Rastreamento</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                placeholder="Digite o código de rastreamento"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                              />
                              <Button onClick={() => handleTrackingUpdate(order.id)}>
                                Adicionar
                              </Button>
                            </div>
                            {order.tracking_code && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Código atual: {order.tracking_code}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>Informações do Cliente</Label>
                            <div className="mt-2 p-3 bg-muted rounded-md">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Nome: {order.customer_name}</div>
                                <div>CPF: {order.customer_cpf}</div>
                                <div>Telefone: {order.customer_phone || 'N/A'}</div>
                                <div>Total: {formatPrice(order.total_amount)}</div>
                              </div>
                              {order.shipping_address && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium">Endereço:</div>
                                  <div className="text-sm text-muted-foreground">
                                    {order.shipping_address.street}, {order.shipping_address.number}
                                    {order.shipping_address.complement && `, ${order.shipping_address.complement}`}
                                    <br />
                                    {order.shipping_address.neighborhood} - {order.shipping_address.city}/{order.shipping_address.state}
                                    <br />
                                    CEP: {order.shipping_address.zipcode}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label>Itens do Pedido</Label>
                            <div className="mt-2 space-y-2">
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                                  <div>
                                    <div className="font-medium">{item.product_name}</div>
                                    {item.species_name && (
                                      <div className="text-sm text-muted-foreground">{item.species_name}</div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div>Qtd: {item.quantity}</div>
                                    <div className="font-medium">{formatPrice(item.price)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.notes && (
                            <div>
                              <Label>Observações</Label>
                              <Textarea value={order.notes} readOnly className="mt-1" />
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}