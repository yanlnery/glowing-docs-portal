import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { couponService, Coupon } from '@/services/couponService';
import { Ticket, X, Loader2 } from 'lucide-react';

interface CouponInputProps {
  cartTotal: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  onApply: (coupon: Coupon, discountAmount: number) => void;
  onRemove: () => void;
}

const CouponInput: React.FC<CouponInputProps> = ({
  cartTotal,
  appliedCoupon,
  discountAmount,
  onApply,
  onRemove,
}) => {
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setValidating(true);
    const result = await couponService.validate(code, cartTotal);
    setValidating(false);

    if (result.valid && result.coupon && result.discountAmount !== undefined) {
      onApply(result.coupon, result.discountAmount);
      toast({ title: 'Cupom aplicado!', description: `Desconto de ${formatDiscount(result.coupon, result.discountAmount)}` });
      setCode('');
    } else {
      toast({ title: 'Cupom inválido', description: result.error, variant: 'destructive' });
    }
  };

  const formatDiscount = (coupon: Coupon, amount: number) => {
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% (${formatted})`;
    }
    return formatted;
  };

  if (appliedCoupon) {
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discountAmount);
    return (
      <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
            <Ticket className="h-4 w-4" />
            <span>Cupom {appliedCoupon.code}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 px-2 text-muted-foreground hover:text-destructive">
            <X className="h-3 w-3 mr-1" /> Remover
          </Button>
        </div>
        <p className="text-sm text-green-600 dark:text-green-400">
          Desconto: -{formatted}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Cupom de desconto</label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código do cupom"
          className="font-mono uppercase"
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={validating || !code.trim()}
          className="flex-shrink-0"
        >
          {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
