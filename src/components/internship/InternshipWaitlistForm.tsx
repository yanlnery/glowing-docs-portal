import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { internshipWaitlistService } from '@/services/internshipWaitlistService';
import { interestAreas, availabilityOptions } from '@/types/internshipWaitlist';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle, GraduationCap } from 'lucide-react';

const formSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().trim().min(10, 'Telefone inválido').max(20, 'Telefone muito longo'),
  institution: z.string().trim().min(2, 'Instituição inválida').max(200, 'Nome muito longo'),
  course: z.string().trim().min(2, 'Curso inválido').max(100, 'Curso muito longo'),
  semester: z.string().optional(),
  availability: z.string().min(1, 'Selecione uma disponibilidade'),
  interest_area: z.string().min(1, 'Selecione uma área de interesse'),
  motivation: z.string().max(2000, 'Motivação muito longa').optional(),
  linkedin_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface InternshipWaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InternshipWaitlistForm({ isOpen, onClose }: InternshipWaitlistFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      institution: '',
      course: '',
      semester: '',
      availability: '',
      interest_area: '',
      motivation: '',
      linkedin_url: '',
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
      const { error } = await internshipWaitlistService.addToWaitlist({
        name: data.name,
        email: data.email,
        phone: data.phone,
        institution: data.institution,
        course: data.course,
        semester: data.semester || undefined,
        availability: data.availability,
        interest_area: data.interest_area,
        motivation: data.motivation || undefined,
        linkedin_url: data.linkedin_url || undefined,
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
        title: 'Inscrição realizada!',
        description: 'Você está na lista de espera para estágio voluntário 2026.',
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-serpente-600" />
            Estágio Voluntário 2026
          </DialogTitle>
          <DialogDescription>
            Preencha seus dados para entrar na lista de espera do programa de estágio voluntário.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inscrição realizada com sucesso!</h3>
            <p className="text-muted-foreground mb-4">
              Entraremos em contato quando as vagas de estágio forem abertas em 2026.
            </p>
            <Button onClick={handleClose}>Fechar</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo *</FormLabel>
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instituição de Ensino *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: UFRRJ, UFF, UFRJ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curso *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Biologia, Veterinária..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período/Semestre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5º" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilidade *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availabilityOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interest_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área de Interesse *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {interestAreas.map(area => (
                            <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Por que você quer estagiar conosco?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte um pouco sobre sua motivação e interesse na área de répteis e serpentes..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/seuperfil" {...field} />
                    </FormControl>
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
                  Enviar Inscrição
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
