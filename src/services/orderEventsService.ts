import { supabase } from "@/integrations/supabase/client";
import type { OrderEvent, CreateOrderEventData, OrderEventType } from "@/types/orderEvents";

export const orderEventsService = {
  // Create a new order event
  async createEvent(data: CreateOrderEventData): Promise<{ data: OrderEvent | null; error: any }> {
    const { data: result, error } = await supabase
      .from('order_events')
      .insert({
        order_id: data.order_id,
        event_type: data.event_type,
        event_data: data.event_data || {},
        created_by: data.created_by || null,
      })
      .select('*')
      .single();

    return { data: result as OrderEvent | null, error };
  },

  // Get all events for an order
  async getOrderEvents(orderId: string): Promise<{ data: OrderEvent[] | null; error: any }> {
    const { data, error } = await supabase
      .from('order_events')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    return { data: data as OrderEvent[] | null, error };
  },

  // Create multiple events (for bulk operations)
  async createEvents(events: CreateOrderEventData[]): Promise<{ data: OrderEvent[] | null; error: any }> {
    const { data, error } = await supabase
      .from('order_events')
      .insert(events.map(e => ({
        order_id: e.order_id,
        event_type: e.event_type,
        event_data: e.event_data || {},
        created_by: e.created_by || null,
      })))
      .select('*');

    return { data: data as OrderEvent[] | null, error };
  },

  // Helper to create status change event
  async recordStatusChange(
    orderId: string, 
    previousStatus: string, 
    newStatus: string, 
    adminId?: string
  ): Promise<{ error: any }> {
    const { error } = await this.createEvent({
      order_id: orderId,
      event_type: 'status_changed',
      event_data: { previous_status: previousStatus, new_status: newStatus },
      created_by: adminId,
    });
    return { error };
  },

  // Helper to record note added
  async recordNoteAdded(
    orderId: string, 
    note: string, 
    adminId?: string
  ): Promise<{ error: any }> {
    const { error } = await this.createEvent({
      order_id: orderId,
      event_type: 'note_added',
      event_data: { note },
      created_by: adminId,
    });
    return { error };
  },
};
