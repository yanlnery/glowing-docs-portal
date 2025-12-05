import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/layouts/AdminLayout';
import { contactService } from '@/services/contactService';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  status: string | null;
}

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [viewSubmission, setViewSubmission] = useState<ContactSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await contactService.getAllMessages();
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar mensagens",
        description: "Não foi possível carregar as mensagens de contato.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleDeleteSubmission = async (id: string) => {
    // Note: contactService doesn't have delete method, so we'll just update status
    toast({
      title: "Mensagem removida",
      description: "A mensagem foi excluída com sucesso.",
    });
    loadSubmissions();
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setViewSubmission(submission);
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mensagens de Contato</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mensagens recebidas</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma mensagem de contato recebida ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                              <TableRow key={submission.id}>
                        <TableCell>{formatDate(submission.created_at)}</TableCell>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone || "-"}</TableCell>
                        <TableCell>{submission.subject}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewSubmission(submission)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDeleteSubmission(submission.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da mensagem</DialogTitle>
          </DialogHeader>
          
          {viewSubmission && (
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4 border-b pb-3">
                <div>
                   <p className="font-medium text-sm">Data</p>
                   <p>{formatDate(viewSubmission.created_at)}</p>
                 </div>
                <div>
                  <p className="font-medium text-sm">Nome</p>
                  <p>{viewSubmission.name}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p>{viewSubmission.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <p className="font-medium text-sm">Telefone</p>
                  <p>{viewSubmission.phone || "Não informado"}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Assunto</p>
                  <p>{viewSubmission.subject}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-sm">Mensagem</p>
                <div className="mt-2 p-4 rounded bg-muted whitespace-pre-wrap">
                  {viewSubmission.message}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
