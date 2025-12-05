import { supabase } from "@/integrations/supabase/client";
import type { ContactMessage } from "@/types/order";

export const contactService = {
  // Enviar mensagem de contato
  async sendMessage(messageData: any): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(messageData)
      .select('*')
      .single();
    
    return { data, error };
  },

  // Buscar todas as mensagens (admin)
  async getAllMessages(): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Buscar mensagem por ID
  async getMessageById(id: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Atualizar status da mensagem
  async updateMessageStatus(id: string, status: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    
    return { data, error };
  },

  // Deletar mensagem
  async deleteMessage(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Estatísticas de mensagens
  async getMessageStats(): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('status, created_at');
    
    if (error) return { data: null, error };

    const stats = {
      total: data.length,
      new: data.filter(msg => msg.status === 'new').length,
      read: data.filter(msg => msg.status === 'read').length,
      replied: data.filter(msg => msg.status === 'replied').length,
      closed: data.filter(msg => msg.status === 'closed').length
    };

    return { data: stats, error: null };
  }
};