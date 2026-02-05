import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft,
  Copy,
  MessageCircle,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Loader2,
  Save,
  ExternalLink,
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { orderService } from "@/services/orderService";
import { orderEventsService } from "@/services/orderEventsService";
import type { Order } from "@/types/order";
import type { OrderEvent, OrderStatus } from "@/types/orderEvents";
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/admin/orders/OrderTimeline';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [adminUserId, setAdminUserId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchEvents();
      getAdminUser();
    }
  }, [id]);

  const getAdminUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setAdminUserId(user?.id || null);
  };

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    const { data, error } = await orderService.getOrderById(id);
    
    if (error) {
      toast({
        title: "Erro ao carregar pedido",
        description: error.message,
        variant: "destructive"
      });
      navigate('/admin/pedidos');
    } else {
      setOrder(data as Order);
      setAdminNotes((data as any)?.admin_notes || '');
      setTrackingCode(data?.tracking_code || '');
    }
    setIsLoading(false);
  };

  const fetchEvents = async () => {
    if (!id) return;
    const { data, error } = await orderEventsService.getOrderEvents(id);
    if (!error && data) {
      setEvents(data);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || !id) return;
    setIsSaving(true);
    
    const previousStatus = order.status;
    
    // Update order status
    const { error: updateError } = await orderService.updateOrderStatus(id, newStatus);
    
    if (updateError) {
      toast({
        title: "Erro ao atualizar status",
        description: updateError.message,
        variant: "destructive"
      });
    } else {
      // Record status change event
      await orderEventsService.recordStatusChange(id, previousStatus, newStatus, adminUserId || undefined);
      
      // If confirmed, update confirmed_at
      if (newStatus === 'confirmed') {
        await supabase
          .from('orders')
          .update({ 
            confirmed_at: new Date().toISOString(),
            confirmed_by: adminUserId 
          })
          .eq('id', id);
      }
      
      toast({
        title: "Status atualizado",
        description: `Pedido marcado como ${newStatus}`,
      });
      
      fetchOrder();
      fetchEvents();
    }
    setIsSaving(false);
  };

  const handleSaveNotes = async () => {
    if (!order || !id) return;
    setIsSaving(true);
    
    const { error } = await supabase
      .from('orders')
      .update({ admin_notes: adminNotes })
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Erro ao salvar notas",
        description: error.message,
        variant: "destructive"
      });
    } else {
      await orderEventsService.recordNoteAdded(id, adminNotes.substring(0, 100), adminUserId || undefined);
      toast({ title: "Notas salvas" });
      fetchEvents();
    }
    setIsSaving(false);
  };

  const handleSaveTracking = async () => {
    if (!order || !id || !trackingCode.trim()) return;
    setIsSaving(true);
    
    const { error } = await orderService.updateTrackingCode(id, trackingCode);
    
    if (error) {
      toast({
        title: "Erro ao salvar código",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Código de rastreamento salvo" });
      fetchOrder();
    }
    setIsSaving(false);
  };

  const generateWhatsAppMessage = () => {
    if (!order) return '';
    
    const orderNumber = (order as any).order_number || `#${order.id.substring(0, 8)}`;
    const items = order.order_items?.map(item => 
      `- ${item.product_name} (${item.species_name || 'N/A'}) - R$ ${item.price.toFixed(2)}`
    ).join('\n') || 'Nenhum item';
    
    const address = order.shipping_address 
      ? `${order.shipping_address.street}, ${order.shipping_address.number}${order.shipping_address.complement ? ` - ${order.shipping_address.complement}` : ''}, ${order.shipping_address.neighborhood}, ${order.shipping_address.city} - ${order.shipping_address.state}, CEP: ${order.shipping_address.zipcode}`
      : 'Não informado';
    
    return `Olá ${order.customer_name || 'Cliente'}!\n\nReferente ao pedido ${orderNumber}:\n\nItens:\n${items}\n\nTotal: R$ ${order.total_amount.toFixed(2)}\n\nEndereço: ${address}\n\n`;
  };

  const copyWhatsAppMessage = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    toast({ title: "Mensagem copiada!" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Pedido não encontrado</h2>
          <Button asChild className="mt-4">
            <Link to="/admin/pedidos">Voltar</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const orderNumber = (order as any).order_number || `#${order.id.substring(0, 8)}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/pedidos">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Pedido {orderNumber}</h1>
              <p className="text-muted-foreground text-sm">
                Criado em {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} className="text-sm px-3 py-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome</Label>
                    <p className="font-medium">{order.customer_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">CPF</Label>
                    <p className="font-medium">{order.customer_cpf || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Telefone</Label>
                    <p className="font-medium">{order.customer_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Método de Pagamento</Label>
                    <p className="font-medium capitalize">{order.payment_method || 'WhatsApp'}</p>
                  </div>
                </div>
                
                {order.shipping_address && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Endereço de Entrega</Label>
                    <p className="font-medium">
                      {order.shipping_address.street}, {order.shipping_address.number}
                      {order.shipping_address.complement && ` - ${order.shipping_address.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.neighborhood} - {order.shipping_address.city}/{order.shipping_address.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {order.shipping_address.zipcode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.product_image_url && (
                          <img 
                            src={item.product_image_url} 
                            alt={item.product_name} 
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {(item as any).product_code && (
                              <span className="font-mono text-primary mr-2">#{(item as any).product_code}</span>
                            )}
                            {item.product_name}
                          </p>
                          {item.species_name && (
                            <p className="text-sm text-muted-foreground">{item.species_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="font-medium">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatPrice(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tracking & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rastreamento & Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Código de Rastreamento</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o código de rastreamento"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                    />
                    <Button onClick={handleSaveTracking} disabled={isSaving || !trackingCode.trim()}>
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Notas Internas (Admin)</Label>
                  <Textarea
                    placeholder="Adicione notas internas sobre este pedido..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleSaveNotes} disabled={isSaving} variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-1" />
                    Salvar Notas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('contacted')}
                  disabled={isSaving || order.status === 'contacted'}
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Marcar como Contatado
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isSaving || order.status === 'confirmed'}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Confirmar Venda
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('shipped')}
                  disabled={isSaving || order.status === 'shipped'}
                >
                  <Truck className="h-4 w-4 mr-2 text-purple-600" />
                  Marcar como Enviado
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('delivered')}
                  disabled={isSaving || order.status === 'delivered'}
                >
                  <Package className="h-4 w-4 mr-2 text-emerald-600" />
                  Marcar como Entregue
                </Button>
                
                <Separator />
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isSaving || order.status === 'cancelled'}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Pedido
                </Button>
                
                <Separator />
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={copyWhatsAppMessage}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Mensagem WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline events={events} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
