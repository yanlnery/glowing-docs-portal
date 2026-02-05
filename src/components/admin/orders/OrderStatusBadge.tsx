import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageCircle, CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import type { OrderStatus } from '@/types/orderEvents';
import { ORDER_STATUS_CONFIG } from '@/types/orderEvents';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const statusIcons: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  contacted: MessageCircle,
  confirmed: CheckCircle,
  cancelled: XCircle,
  shipped: Truck,
  delivered: Package,
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const normalizedStatus = status as OrderStatus;
  const config = ORDER_STATUS_CONFIG[normalizedStatus] || ORDER_STATUS_CONFIG.pending;
  const Icon = statusIcons[normalizedStatus] || Clock;

  return (
    <Badge 
      variant="outline" 
      className={`${config.bgColor} ${config.color} border-0 flex items-center gap-1.5 ${className || ''}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
