
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData, ProductCategory, ProductSubcategory, ProductStatus } from '@/types/product';

interface ProductFormFieldsProps {
  form: UseFormReturn<ProductFormData>;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ form }) => {
  const categoryOptions: { value: ProductCategory; label: string }[] = [
    { value: 'serpente', label: 'Serpente' },
    { value: 'lagarto', label: 'Lagarto' },
    { value: 'quelonio', label: 'Quelônio' },
  ];

  const subcategoryOptions: { value: ProductSubcategory; label: string }[] = [
    { value: 'colubrideos', label: 'Colubrídeos' },
    { value: 'boideos', label: 'Boídeos' },
    { value: 'pequenos', label: 'Pequenos' },
    { value: 'grandes', label: 'Grandes' },
    { value: 'terrestres', label: 'Terrestres' },
    { value: 'aquaticos', label: 'Aquáticos' },
  ];

  const statusOptions: { value: ProductStatus; label: string }[] = [
    { value: 'disponivel', label: 'Disponível' },
    { value: 'indisponivel', label: 'Indisponível' },
    { value: 'vendido', label: 'Vendido' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Animal *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ball Python Banana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="speciesName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Científico *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Python regius" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva as características, comportamento e cuidados necessários..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="originalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço Original (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">Preço que aparecerá riscado</p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço Parcelado (R$) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">Em até 10x sem juros</p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pixPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço no PIX (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">10% de desconto para PIX</p>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategoria *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subcategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status de Disponibilidade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Exibição</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Produto em Destaque</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Exibir na seção de produtos em destaque
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isNew"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Novidade</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Marcar como produto novo
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Visível no Site</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Exibir produto no catálogo público
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="paymentLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link de Pagamento</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
