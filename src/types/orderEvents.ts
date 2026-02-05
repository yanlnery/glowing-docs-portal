export type OrderEventType = 
  | 'created'
  | 'whatsapp_redirect'
  | 'contacted'
  | 'confirmed'
  | 'cancelled'
  | 'shipped'
  | 'delivered'
  | 'note_added'
  | 'status_changed';

export interface OrderEvent {
  id: string;
  order_id: string;
  event_type: OrderEventType;
  event_data?: Record<string, any>;
  created_at: string;
  created_by?: string;
}

export interface CreateOrderEventData {
  order_id: string;
  event_type: OrderEventType;
  event_data?: Record<string, any>;
  created_by?: string;
}

export type OrderStatus = 'pending' | 'contacted' | 'confirmed' | 'cancelled' | 'shipped' | 'delivered';

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pendente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  contacted: { label: 'Contatado', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  confirmed: { label: 'Confirmado', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100' },
  shipped: { label: 'Enviado', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Entregue', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
};

export const ORDER_EVENT_LABELS: Record<OrderEventType, string> = {
  created: 'Pedido criado',
  whatsapp_redirect: 'Redirecionado para WhatsApp',
  contacted: 'Contato iniciado',
  confirmed: 'Pagamento confirmado',
  cancelled: 'Pedido cancelado',
  shipped: 'Pedido enviado',
  delivered: 'Pedido entregue',
  note_added: 'Nota adicionada',
  status_changed: 'Status alterado',
};
