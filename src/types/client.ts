
import { Tables } from '@/integrations/supabase/database.types';

export type Profile = Tables<'profiles'>;
export type Address = Tables<'addresses'>;
export type Order = Tables<'orders'> & {
  order_items: OrderItem[];
};
export type OrderItem = Tables<'order_items'>;
