import { supabase } from "@/integrations/supabase/client";
import { settingsService } from "@/services/settingsService";

export const guestOrderService = {
  // Número de WhatsApp do negócio, vindo de system_settings (nunca hardcoded).
  async getWhatsAppNumber(): Promise<string> {
    const { data } = await settingsService.getSettings(['whatsapp_number']);
    const raw = String(data?.whatsapp_number ?? '');
    return raw.replace(/\D/g, '');
  },

  // Cria pedido-lead de visitante via RPC no servidor (preço travado no catálogo).
  async createGuestLeadOrder(params: {
    productId: string;
    customerName: string;
    customerPhone: string;
  }): Promise<{ orderId?: string; orderNumber?: string; error: any }> {
    const { data, error } = await supabase.rpc('create_guest_lead_order', {
      p_product_id: params.productId,
      p_customer_name: params.customerName,
      p_customer_phone: params.customerPhone,
      p_consent: true,
    });

    if (error) return { error };

    const row = Array.isArray(data) ? data[0] : data;
    return {
      orderId: row?.order_id,
      orderNumber: row?.order_number,
      error: null,
    };
  },

  // Cria pedido de carrinho de visitante. O servidor revalida disponibilidade
  // de cada animal e o cupom; os valores retornados sao os finais.
  async createGuestCartOrder(params: {
    items: { productId: string; quantity: number }[];
    customerName: string;
    customerPhone: string;
    couponCode?: string | null;
  }): Promise<{
    orderId?: string;
    orderNumber?: string;
    subtotalAmount?: number;
    totalAmount?: number;
    couponDiscount?: number;
    couponApplied?: boolean;
    error: any;
  }> {
    const { data, error } = await supabase.rpc('create_guest_cart_order', {
      p_items: params.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      p_customer_name: params.customerName,
      p_customer_phone: params.customerPhone,
      p_consent: true,
      p_coupon_code: params.couponCode || null,
    } as any);

    if (error) return { error };

    const row = Array.isArray(data) ? data[0] : data;
    return {
      orderId: row?.order_id,
      orderNumber: row?.order_number,
      subtotalAmount: row?.subtotal_amount,
      totalAmount: row?.total_amount,
      couponDiscount: row?.coupon_discount,
      couponApplied: row?.coupon_applied,
      error: null,
    };
  },
};
