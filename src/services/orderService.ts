import { supabase } from "@/integrations/supabase/client";
import type { Order, OrderItem } from "@/types/order";

export const orderService = {
  // Criar novo pedido
  async createOrder(orderData: any): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select('*')
      .single();
    
    return { data, error };
  },

  // Buscar pedidos do usuário
  async getUserOrders(userId: string): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Buscar todos os pedidos (admin)
  async getAllOrders(): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Buscar pedido por ID
  async getOrderById(id: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Atualizar status do pedido
  async updateOrderStatus(id: string, status: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    
    return { data, error };
  },

  // Adicionar código de rastreamento
  async updateTrackingCode(id: string, trackingCode: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_code: trackingCode, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    
    return { data, error };
  },

  // Adicionar itens ao pedido
  async addOrderItems(items: any[]): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select('*');
    
    return { data, error };
  },

  // Buscar estatísticas de vendas
  async getSalesStats(): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, status, created_at');
    
    if (error) return { data: null, error };

    const stats = {
      totalSales: data.reduce((sum, order) => sum + Number(order.total_amount), 0),
      totalOrders: data.length,
      pendingOrders: data.filter(order => order.status === 'pending').length,
      completedOrders: data.filter(order => order.status === 'delivered').length,
      monthlyRevenue: data
        .filter(order => {
          const orderDate = new Date(order.created_at);
          const now = new Date();
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + Number(order.total_amount), 0)
    };

    return { data: stats, error: null };
  }
};