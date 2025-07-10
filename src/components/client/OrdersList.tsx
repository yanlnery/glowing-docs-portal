import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types/client";

export const OrdersList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  
  const fetchOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items ( * )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (orderError) {
      toast({ title: "Erro ao buscar pedidos", description: orderError.message, variant: "destructive" });
    } else {
      setOrders(orderData as Order[]);
    }
    setIsLoading(false);
  };
  
  if (isLoading) {
    return <div className="text-center py-6">Carregando pedidos...</div>;
  }
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Pedido #{order.id.substring(0,8)}</span>
                {order.status === "delivered" ? (
                  <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" /> Entregue
                  </span>
                ) : order.status === "processing" || order.status === "shipped" ? (
                   <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                    <AlertCircle className="h-3 w-3 mr-1" /> {order.status === "processing" ? "Processando" : "Enviado"}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3 mr-1" /> {order.status === "pending" ? "Pendente" : "Cancelado"}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Data: {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-sm">Itens: {order.order_items?.map(item => `${item.product_name} (x${item.quantity})`).join(", ") || "N/A"}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">R$ {Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
      
      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground">
            Você ainda não realizou nenhum pedido.
          </p>
        </div>
      )}
    </div>
  );
};
