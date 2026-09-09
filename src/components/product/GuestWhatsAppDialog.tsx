import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

const formSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome').max(100, 'Nome muito longo'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Use o formato (00) 00000-0000'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'É preciso aceitar a política de privacidade' }),
  }),
});

export type GuestWhatsAppFormData = z.infer<typeof formSchema>;

export const formatPhoneMask = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

interface GuestWhatsAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GuestWhatsAppFormData) => Promise<void>;
  isSubmitting: boolean;
  productName?: string;
}

export function GuestWhatsAppDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  productName,
}: GuestWhatsAppDialogProps) {
  const form = useForm<GuestWhatsAppFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', phone: '', consent: false as unknown as true },
  });

  const handleClose = () => {
    if (isSubmitting) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Falar sobre este animal no WhatsApp</DialogTitle>
          <DialogDescription>
            {productName
              ? `Só precisamos de nome e WhatsApp para registrar seu interesse em ${productName}.`
              : 'Só precisamos de nome e WhatsApp para registrar seu interesse.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      inputMode="numeric"
                      {...field}
                      onChange={(e) => field.onChange(formatPhoneMask(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 text-sm font-normal leading-snug">
                      Li e aceito a{' '}
                      <Link
                        to="/politica-de-privacidade"
                        className="text-serpente-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        política de privacidade
                      </Link>
                      .
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full h-10">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar e abrir WhatsApp
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
