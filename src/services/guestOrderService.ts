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
};
