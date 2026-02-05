export type OrderStatus = 'pending' | 'contacted' | 'confirmed' | 'cancelled' | 'shipped' | 'delivered' | 'processing';

export interface Order {
  id: string;
  user_id: string;
  order_number?: string;
  customer_name?: string;
  customer_cpf?: string;
  customer_phone?: string;
  shipping_address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
  payment_method: string;
  notes?: string;
  tracking_code?: string;
  total_amount: number;
  status: OrderStatus;
  whatsapp_clicked_at?: string;
  confirmed_at?: string;
  confirmed_by?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_code?: string;
  product_name: string;
  species_name?: string;
  product_image_url?: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}