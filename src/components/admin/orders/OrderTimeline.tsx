import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Package,
  MessageSquare,
  RefreshCw,
  Plus
} from 'lucide-react';
import type { OrderEvent, OrderEventType } from '@/types/orderEvents';
import { ORDER_EVENT_LABELS } from '@/types/orderEvents';

interface OrderTimelineProps {
  events: OrderEvent[];
}

const eventIcons: Record<OrderEventType, React.ElementType> = {
  created: Plus,
  whatsapp_redirect: MessageCircle,
  contacted: MessageCircle,
  confirmed: CheckCircle,
  cancelled: XCircle,
  shipped: Truck,
  delivered: Package,
  note_added: MessageSquare,
  status_changed: RefreshCw,
};

const eventColors: Record<OrderEventType, string> = {
  created: 'bg-gray-500',
  whatsapp_redirect: 'bg-green-500',
  contacted: 'bg-blue-500',
  confirmed: 'bg-green-600',
  cancelled: 'bg-red-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-emerald-600',
  note_added: 'bg-gray-400',
  status_changed: 'bg-orange-500',
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Nenhum evento registrado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const Icon = eventIcons[event.event_type] || Clock;
        const color = eventColors[event.event_type] || 'bg-gray-500';
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`${color} rounded-full p-1.5 text-white`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              {!isLast && (
                <div className="w-0.5 h-full bg-border mt-1 flex-1 min-h-[20px]" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">
                  {ORDER_EVENT_LABELS[event.event_type] || event.event_type}
                </p>
                <time className="text-xs text-muted-foreground">
                  {format(new Date(event.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </time>
              </div>
              {event.event_data && Object.keys(event.event_data).length > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {event.event_type === 'status_changed' && event.event_data.previous_status && (
                    <span>
                      Status alterado de <strong>{event.event_data.previous_status}</strong> para{' '}
                      <strong>{event.event_data.new_status}</strong>
                    </span>
                  )}
                  {event.event_type === 'note_added' && event.event_data.note && (
                    <span className="italic">"{event.event_data.note}"</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
