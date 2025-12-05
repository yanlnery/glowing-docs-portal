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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Trash2, Search, Filter, Mail, CheckCircle, Reply } from 'lucide-react';
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
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [viewSubmission, setViewSubmission] = useState<ContactSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter]);

  const filterSubmissions = () => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(submission => 
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; icon: typeof Mail; label: string }> = {
      new: { variant: "default", icon: Mail, label: "Nova" },
      read: { variant: "secondary", icon: Eye, label: "Lida" },
      replied: { variant: "default", icon: Reply, label: "Respondida" },
      closed: { variant: "outline", icon: CheckCircle, label: "Fechada" }
    };
    
    const config = variants[status || 'new'] || variants.new;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const messageStats = {
    total: submissions.length,
    new: submissions.filter(m => m.status === 'new' || !m.status).length,
    read: submissions.filter(m => m.status === 'read').length,
    replied: submissions.filter(m => m.status === 'replied').length,
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    
    const { error } = await contactService.deleteMessage(id);
    
    if (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a mensagem.",
        variant: "destructive",
      });
      return;
    }
    
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

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{messageStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{messageStats.new}</div>
                <div className="text-sm text-muted-foreground">Novas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{messageStats.read}</div>
                <div className="text-sm text-muted-foreground">Lidas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{messageStats.replied}</div>
                <div className="text-sm text-muted-foreground">Respondidas</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email, assunto ou mensagem..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="new">Nova</SelectItem>
                  <SelectItem value="read">Lida</SelectItem>
                  <SelectItem value="replied">Respondida</SelectItem>
                  <SelectItem value="closed">Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mensagens recebidas ({filteredSubmissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Nenhuma mensagem corresponde aos filtros aplicados."
                    : "Nenhuma mensagem de contato recebida ainda."}
                </p>
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className={submission.status === 'new' || !submission.status ? 'bg-blue-50/30' : ''}>
                        <TableCell>{formatDate(submission.created_at)}</TableCell>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone || "-"}</TableCell>
                        <TableCell>{submission.subject || "-"}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
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
