import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { couponService, Coupon, CouponInsert } from '@/services/couponService';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';

const emptyCoupon: CouponInsert = {
  code: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_order_value: null,
  max_uses: null,
  max_uses_per_customer: null,
  starts_at: null,
  expires_at: null,
  is_active: true,
};

const CouponsAdmin = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponInsert>({ ...emptyCoupon });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await couponService.getAll();
    setCoupons(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyCoupon });
    setDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_uses: coupon.max_uses,
      max_uses_per_customer: coupon.max_uses_per_customer,
      starts_at: coupon.starts_at,
      expires_at: coupon.expires_at,
      is_active: coupon.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast({ title: 'Erro', description: 'Código é obrigatório.', variant: 'destructive' });
      return;
    }
    if (form.discount_value <= 0) {
      toast({ title: 'Erro', description: 'Valor do desconto deve ser maior que zero.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    if (editing) {
      const { error } = await couponService.update(editing.id, form);
      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Cupom atualizado!' });
      }
    } else {
      const { error } = await couponService.create(form);
      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Cupom criado!' });
      }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
    const { error } = await couponService.delete(id);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cupom excluído!' });
      fetchCoupons();
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    await couponService.toggleActive(coupon.id, !coupon.is_active);
    fetchCoupons();
  };

  const getStatus = (coupon: Coupon) => {
    if (!coupon.is_active) return { label: 'Inativo', variant: 'secondary' as const };
    const now = new Date();
    if (coupon.expires_at && new Date(coupon.expires_at) < now) return { label: 'Expirado', variant: 'destructive' as const };
    if (coupon.starts_at && new Date(coupon.starts_at) > now) return { label: 'Agendado', variant: 'outline' as const };
    return { label: 'Ativo', variant: 'default' as const };
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') return `${coupon.discount_value}%`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupon.discount_value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Ticket className="h-6 w-6" /> Cupons de Desconto
            </h1>
            <p className="text-muted-foreground">Gerencie cupons de desconto para seus clientes.</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Novo Cupom
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Carregando...</div>
            ) : coupons.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Nenhum cupom cadastrado.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => {
                    const status = getStatus(coupon);
                    return (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                        <TableCell>{formatDiscount(coupon)}</TableCell>
                        <TableCell>{coupon.times_used}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(coupon.starts_at)} → {formatDate(coupon.expires_at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleToggle(coupon)} title={coupon.is_active ? 'Desativar' : 'Ativar'}>
                            <Switch checked={coupon.is_active} className="pointer-events-none" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Cupom' : 'Novo Cupom'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Código do cupom</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="EX: DESCONTO10"
                  className="font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo de desconto</Label>
                  <Select
                    value={form.discount_type}
                    onValueChange={(v) => setForm({ ...form, discount_type: v as 'percentage' | 'fixed' })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Valor do desconto</Label>
                  <Input
                    type="number"
                    min={0}
                    step={form.discount_type === 'percentage' ? 1 : 0.01}
                    value={form.discount_value || ''}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Valor mínimo do pedido (opcional)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.min_order_value ?? ''}
                  onChange={(e) => setForm({ ...form, min_order_value: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Sem mínimo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Limite de uso total (opcional)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.max_uses ?? ''}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Ilimitado"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Limite por cliente (opcional)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.max_uses_per_customer ?? ''}
                    onChange={(e) => setForm({ ...form, max_uses_per_customer: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Ilimitado"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data de início (opcional)</Label>
                  <Input
                    type="datetime-local"
                    value={form.starts_at ? form.starts_at.slice(0, 16) : ''}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Data de expiração (opcional)</Label>
                  <Input
                    type="datetime-local"
                    value={form.expires_at ? form.expires_at.slice(0, 16) : ''}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <Label>Cupom ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Criar Cupom'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CouponsAdmin;
