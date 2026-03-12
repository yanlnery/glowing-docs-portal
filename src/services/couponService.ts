import { supabase } from '@/integrations/supabase/client';

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number | null;
  max_uses: number | null;
  times_used: number;
  max_uses_per_customer: number | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export type CouponInsert = Omit<Coupon, 'id' | 'times_used' | 'created_at'>;
export type CouponUpdate = Partial<CouponInsert>;

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number;
}

export const couponService = {
  async getAll() {
    const { data, error } = await supabase
      .from('coupons' as any)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as unknown as Coupon[] | null, error };
  },

  async create(coupon: CouponInsert) {
    const { data, error } = await supabase
      .from('coupons' as any)
      .insert({ ...coupon, code: coupon.code.toUpperCase() })
      .select()
      .single();
    return { data: data as unknown as Coupon | null, error };
  },

  async update(id: string, updates: CouponUpdate) {
    const payload: any = { ...updates };
    if (payload.code) payload.code = payload.code.toUpperCase();
    const { data, error } = await supabase
      .from('coupons' as any)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as unknown as Coupon | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('coupons' as any)
      .delete()
      .eq('id', id);
    return { error };
  },

  async toggleActive(id: string, isActive: boolean) {
    return this.update(id, { is_active: isActive });
  },

  async validate(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const { data, error } = await supabase
      .from('coupons' as any)
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Cupom inválido ou não encontrado.' };
    }

    const coupon = data as Coupon;
    const now = new Date();

    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return { valid: false, error: 'Este cupom ainda não está ativo.' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return { valid: false, error: 'Este cupom expirou.' };
    }

    if (coupon.max_uses !== null && coupon.times_used >= coupon.max_uses) {
      return { valid: false, error: 'Este cupom atingiu o limite de uso.' };
    }

    if (coupon.min_order_value !== null && cartTotal < coupon.min_order_value) {
      const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupon.min_order_value);
      return { valid: false, error: `Valor mínimo do pedido: ${formatted}.` };
    }

    const discountAmount = coupon.discount_type === 'percentage'
      ? cartTotal * (coupon.discount_value / 100)
      : Math.min(coupon.discount_value, cartTotal);

    return { valid: true, coupon, discountAmount };
  },

  async incrementUsage(id: string) {
    // Use RPC or raw update to increment
    const { data: current } = await supabase
      .from('coupons' as any)
      .select('times_used')
      .eq('id', id)
      .single();
    
    if (current) {
      await supabase
        .from('coupons' as any)
        .update({ times_used: (current as any).times_used + 1 })
        .eq('id', id);
    }
  },
};
