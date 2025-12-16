import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { internshipWaitlistService } from '@/services/internshipWaitlistService';
import { 
  InternshipWaitlistEntry, 
  internshipStatusLabels, 
  internshipStatusColors, 
  InternshipWaitlistStatus,
  interestAreas,
  availabilityOptions
} from '@/types/internshipWaitlist';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Trash2, 
  FileDown,
  Search,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function InternshipWaitlistAdmin() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<InternshipWaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  
  // Notes dialog
  const [notesEntry, setNotesEntry] = useState<InternshipWaitlistEntry | null>(null);
  const [notesText, setNotesText] = useState('');

  // Details dialog
  const [detailsEntry, setDetailsEntry] = useState<InternshipWaitlistEntry | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await internshipWaitlistService.getAllEntries();
      if (data) setEntries(data);
      if (error) console.error('Error fetching entries:', error);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (entry: InternshipWaitlistEntry, newStatus: InternshipWaitlistStatus) => {
    const { error } = await internshipWaitlistService.updateStatus(entry.id, newStatus);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o status.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Status atualizado' });
    fetchData();
  };

  const handleSaveNotes = async () => {
    if (!notesEntry) return;
    
    const { error } = await internshipWaitlistService.updateNotes(notesEntry.id, notesText);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar notas.', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Notas salvas' });
    setNotesEntry(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este candidato?')) return;
    
    const { error } = await internshipWaitlistService.deleteEntry(id);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível remover.', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Removido com sucesso' });
    fetchData();
  };

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Instituição', 'Curso', 'Período', 'Disponibilidade', 'Área', 'Status', 'Data', 'Motivação', 'LinkedIn', 'Notas'];
    const rows = filteredEntries.map(e => [
      e.name,
      e.email,
      e.phone,
      e.institution,
      e.course,
      e.semester || '',
      availabilityOptions.find(a => a.value === e.availability)?.label || e.availability,
      interestAreas.find(a => a.value === e.interest_area)?.label || e.interest_area,
      internshipStatusLabels[e.status as InternshipWaitlistStatus] || e.status,
      format(new Date(e.created_at), 'dd/MM/yyyy HH:mm'),
      e.motivation || '',
      e.linkedin_url || '',
      e.notes || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista-estagio-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesArea = areaFilter === 'all' || entry.interest_area === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  const statusCounts = {
    pending: entries.filter(e => e.status === 'pending').length,
    contacted: entries.filter(e => e.status === 'contacted').length,
    approved: entries.filter(e => e.status === 'approved').length,
    rejected: entries.filter(e => e.status === 'rejected').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Lista de Espera - Estágio 2026
            </h1>
            <p className="text-muted-foreground">Gerencie os candidatos ao programa de estágio voluntário</p>
          </div>
          <Button onClick={exportCSV} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('pending')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('contacted')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contatados</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{statusCounts.contacted}</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('approved')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{statusCounts.approved}</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('all')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{entries.length}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email, instituição ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Todas áreas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas áreas</SelectItem>
              {interestAreas.map(area => (
                <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todos status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {Object.entries(internshipStatusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum candidato encontrado</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Instituição / Curso</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map(entry => (
                  <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailsEntry(entry)}>
                    <TableCell>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">{entry.email}</div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          📝 {entry.notes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.institution}</div>
                      <div className="text-sm text-muted-foreground">{entry.course} {entry.semester && `- ${entry.semester}º período`}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {interestAreas.find(a => a.value === entry.interest_area)?.label || entry.interest_area}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={internshipStatusColors[entry.status as InternshipWaitlistStatus]}>
                        {internshipStatusLabels[entry.status as InternshipWaitlistStatus] || entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(entry, 'contacted')}>
                            Marcar como Contatado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry, 'approved')}>
                            Marcar como Aprovado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry, 'rejected')}>
                            Marcar como Não Aprovado
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setNotesEntry(entry); setNotesText(entry.notes || ''); }}>
                            Editar notas
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Notes Dialog */}
        <Dialog open={!!notesEntry} onOpenChange={() => setNotesEntry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notas - {notesEntry?.name}</DialogTitle>
              <DialogDescription>
                Adicione notas internas sobre este candidato
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Digite suas anotações..."
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setNotesEntry(null)}>Cancelar</Button>
              <Button onClick={handleSaveNotes}>Salvar Notas</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={!!detailsEntry} onOpenChange={() => setDetailsEntry(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{detailsEntry?.name}</DialogTitle>
              <DialogDescription>Detalhes do candidato</DialogDescription>
            </DialogHeader>
            {detailsEntry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${detailsEntry.email}`} className="text-blue-600 hover:underline">{detailsEntry.email}</a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <a href={`https://wa.me/55${detailsEntry.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{detailsEntry.phone}</a>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Instituição</label>
                    <p>{detailsEntry.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Curso</label>
                    <p>{detailsEntry.course} {detailsEntry.semester && `(${detailsEntry.semester}º período)`}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Disponibilidade</label>
                    <p>{availabilityOptions.find(a => a.value === detailsEntry.availability)?.label || detailsEntry.availability}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Área de Interesse</label>
                    <p>{interestAreas.find(a => a.value === detailsEntry.interest_area)?.label || detailsEntry.interest_area}</p>
                  </div>
                </div>
                {detailsEntry.motivation && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Motivação</label>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg mt-1">{detailsEntry.motivation}</p>
                  </div>
                )}
                {detailsEntry.linkedin_url && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                    <p>
                      <a href={detailsEntry.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        {detailsEntry.linkedin_url} <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                )}
                {detailsEntry.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notas internas</label>
                    <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mt-1">{detailsEntry.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
