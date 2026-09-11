import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  phone: z.string().trim().min(10, 'Telefone inválido').max(20, 'Telefone muito longo'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'É preciso aceitar a política de privacidade' }),
  }),
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
  const [position, setPosition] = React.useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      consent: false as unknown as true,
    },
  });

  const handleClose = () => {
    form.reset();
    setIsSuccess(false);
    setPosition(null);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const { error, position: queuePosition } = await speciesWaitlistService.addToWaitlist({
        species_id: species.id,
        name: data.name,
        phone: data.phone,
        contact_preference: 'whatsapp',
        consent: true,
        consent_at: new Date().toISOString(),
      });

      if (error) {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao cadastrar. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      setPosition(queuePosition ?? null);
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
            {position !== null && (
              <p className="text-base font-medium mb-2">
                Você é o {position}º na fila de {species.commonname}.
              </p>
            )}
            <p className="text-muted-foreground mb-4">
              Entraremos em contato pelo WhatsApp assim que houver disponibilidade.
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
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
