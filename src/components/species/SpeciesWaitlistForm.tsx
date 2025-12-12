import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Species } from '@/types/species';
import { speciesWaitlistService } from '@/services/speciesWaitlistService';
import { useToast } from '@/hooks/use-toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().trim().min(10, 'Telefone inválido').max(20, 'Telefone muito longo'),
  contact_preference: z.enum(['email', 'whatsapp', 'both']),
});

type FormData = z.infer<typeof formSchema>;

interface SpeciesWaitlistFormProps {
  species: Species;
  isOpen: boolean;
  onClose: () => void;
}

export function SpeciesWaitlistForm({ species, isOpen, onClose }: SpeciesWaitlistFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      contact_preference: 'whatsapp',
    },
  });

  const handleClose = () => {
    form.reset();
    setIsSuccess(false);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await speciesWaitlistService.addToWaitlist({
        species_id: species.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        contact_preference: data.contact_preference,
      });

      if (error) {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao cadastrar. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: 'Cadastro realizado!',
        description: `Você será avisado quando houver ${species.commonname} disponível.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lista de Espera</DialogTitle>
          <DialogDescription>
            Cadastre-se para ser avisado quando houver <strong>{species.commonname}</strong> disponível.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cadastro realizado com sucesso!</h3>
            <p className="text-muted-foreground mb-4">
              Entraremos em contato assim que houver disponibilidade.
            </p>
            <Button onClick={handleClose}>Fechar</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferência de contato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="both">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
