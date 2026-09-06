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
    const { data, error } = await supabase.rpc('validate_coupon' as any, {
      p_code: code.trim().toUpperCase(),
      p_order_total: cartTotal,
    });

    if (error) {
      console.error('Erro ao validar cupom:', error);
      return { valid: false, error: 'Não foi possível validar o cupom. Tente novamente.' };
    }

    const row = (Array.isArray(data) ? data[0] : data) as
      | { valid: boolean; message: string; discount_type: string | null; discount_value: number | null }
      | undefined;

    if (!row || !row.valid) {
      return { valid: false, error: row?.message || 'Cupom inválido ou não encontrado.' };
    }

    const discountType = (row.discount_type === 'percentage' ? 'percentage' : 'fixed') as Coupon['discount_type'];
    const discountValue = Number(row.discount_value ?? 0);

    const discountAmount = discountType === 'percentage'
      ? cartTotal * (discountValue / 100)
      : Math.min(discountValue, cartTotal);

    const coupon: Coupon = {
      id: '',
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: discountValue,
      min_order_value: null,
      max_uses: null,
      times_used: 0,
      max_uses_per_customer: null,
      starts_at: null,
      expires_at: null,
      is_active: true,
      created_at: '',
    };

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
