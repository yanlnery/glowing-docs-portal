import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { speciesWaitlistService } from '@/services/speciesWaitlistService';
import { SpeciesWaitlistEntry, statusLabels, statusColors, SpeciesWaitlistStatus } from '@/types/speciesWaitlist';
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
  ArrowRightLeft, 
  Trash2, 
  FileDown,
  Search,
  Users,
  Send,
  Bell,
  Plus
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

export default function SpeciesWaitlistAdmin() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<SpeciesWaitlistEntry[]>([]);
  const [speciesCounts, setSpeciesCounts] = useState<{ species_id: string; commonname: string; count: number }[]>([]);
  const [allSpecies, setAllSpecies] = useState<{ id: string; commonname: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  
  // Migration dialog
  const [migrateEntry, setMigrateEntry] = useState<SpeciesWaitlistEntry | null>(null);
  const [newSpeciesId, setNewSpeciesId] = useState<string>('');
  
  // Notes dialog
  const [notesEntry, setNotesEntry] = useState<SpeciesWaitlistEntry | null>(null);
  const [notesText, setNotesText] = useState('');
  
  // Notification dialog
  const [notifySpecies, setNotifySpecies] = useState<{ id: string; name: string } | null>(null);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  // Manual entry dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({
    species_id: '',
    name: '',
    email: '',
    phone: '',
    contact_preference: 'whatsapp'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [entriesRes, countsRes, speciesRes] = await Promise.all([
        speciesWaitlistService.getAllEntries(),
        speciesWaitlistService.getCountBySpecies(),
        supabase.from('species').select('id, commonname').order('commonname')
      ]);

      if (entriesRes.data) setEntries(entriesRes.data);
      if (countsRes.data) setSpeciesCounts(countsRes.data);
      if (speciesRes.data) setAllSpecies(speciesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (entry: SpeciesWaitlistEntry, newStatus: SpeciesWaitlistStatus) => {
    const { error } = await speciesWaitlistService.updateStatus(entry.id, newStatus);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o status.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Status atualizado' });
    fetchData();
  };

  const handleMigrate = async () => {
    if (!migrateEntry || !newSpeciesId) return;
    
    const { error } = await speciesWaitlistService.migrateToSpecies(
      migrateEntry.id, 
      newSpeciesId, 
      migrateEntry.species_id
    );
    
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível migrar.', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Migrado com sucesso!' });
    setMigrateEntry(null);
    setNewSpeciesId('');
    fetchData();
  };

  const handleSaveNotes = async () => {
    if (!notesEntry) return;
    
    const { error } = await speciesWaitlistService.updateNotes(notesEntry.id, notesText);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar notas.', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Notas salvas' });
    setNotesEntry(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este registro?')) return;
    
    const { error } = await speciesWaitlistService.deleteEntry(id);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível remover.', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Removido com sucesso' });
    fetchData();
  };

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Espécie', 'Status', 'Preferência', 'Data Cadastro', 'Notas'];
    const rows = filteredEntries.map(e => [
      e.name,
      e.email,
      e.phone,
      e.species_commonname || '',
      statusLabels[e.status as SpeciesWaitlistStatus] || e.status,
      e.contact_preference,
      format(new Date(e.created_at), 'dd/MM/yyyy HH:mm'),
      e.notes || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista-espera-especies-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handleNotifyWaitlist = async () => {
    if (!notifySpecies) return;
    
    setIsSendingNotification(true);
    try {
      const { data, error } = await supabase.functions.invoke('notify-waitlist', {
        body: {
          species_id: notifySpecies.id,
          species_name: notifySpecies.name,
          message: notifyMessage || undefined
        }
      });

      if (error) throw error;

      toast({
        title: 'Notificações enviadas!',
        description: `${data.notified} email(s) enviado(s) com sucesso.`,
      });

      setNotifySpecies(null);
      setNotifyMessage('');
      fetchData();
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      toast({
        title: 'Erro ao enviar notificações',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleAddManualEntry = async () => {
    if (!newEntry.species_id || !newEntry.name || !newEntry.email || !newEntry.phone) {
      toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    const { error } = await speciesWaitlistService.addToWaitlist(newEntry);
    if (error) {
      toast({ title: 'Erro', description: error.message || 'Não foi possível adicionar.', variant: 'destructive' });
      return;
    }

    toast({ title: 'Adicionado com sucesso!' });
    setShowAddDialog(false);
    setNewEntry({ species_id: '', name: '', email: '', phone: '', contact_preference: 'whatsapp' });
    fetchData();
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesSpecies = speciesFilter === 'all' || entry.species_id === speciesFilter;
    
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lista de Espera - Espécies</h1>
            <p className="text-muted-foreground">Gerencie os interessados em cada espécie</p>
          </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddDialog(true)} variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
          <Button onClick={exportCSV} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {speciesCounts.slice(0, 4).map(item => (
            <Card key={item.species_id} className="cursor-pointer hover:bg-muted/50 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.commonname}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2" onClick={() => setSpeciesFilter(item.species_id)}>
                    <Users className="w-5 h-5 text-serpente-500" />
                    <span className="text-2xl font-bold">{item.count}</span>
                    <span className="text-sm text-muted-foreground">aguardando</span>
                  </div>
                  {item.count > 0 && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); setNotifySpecies({ id: item.species_id, name: item.commonname }); }}
                    >
                      <Bell className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Todas espécies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas espécies</SelectItem>
              {allSpecies.map(sp => (
                <SelectItem key={sp.id} value={sp.id}>{sp.commonname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todos status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
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
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Espécie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="font-medium">{entry.name}</div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          📝 {entry.notes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${entry.email}`} className="text-sm flex items-center gap-1 text-blue-600 hover:underline">
                          <Mail className="w-3 h-3" /> {entry.email}
                        </a>
                        <a href={`https://wa.me/55${entry.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1 text-green-600 hover:underline">
                          <Phone className="w-3 h-3" /> {entry.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.species_commonname}</div>
                      {entry.previous_species_name && (
                        <div className="text-xs text-muted-foreground">
                          Migrou de: {entry.previous_species_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[entry.status as SpeciesWaitlistStatus]}>
                        {statusLabels[entry.status as SpeciesWaitlistStatus] || entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
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
                          <DropdownMenuItem onClick={() => handleStatusChange(entry, 'converted')}>
                            Marcar como Convertido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry, 'cancelled')}>
                            Marcar como Cancelado
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setMigrateEntry(entry); setNewSpeciesId(''); }}>
                            <ArrowRightLeft className="w-4 h-4 mr-2" />
                            Migrar para outra espécie
                          </DropdownMenuItem>
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

        {/* Migrate Dialog */}
        <Dialog open={!!migrateEntry} onOpenChange={() => setMigrateEntry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Migrar para outra espécie</DialogTitle>
              <DialogDescription>
                Migrar <strong>{migrateEntry?.name}</strong> de <strong>{migrateEntry?.species_commonname}</strong> para outra espécie.
              </DialogDescription>
            </DialogHeader>
            <Select value={newSpeciesId} onValueChange={setNewSpeciesId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a nova espécie" />
              </SelectTrigger>
              <SelectContent>
                {allSpecies.filter(sp => sp.id !== migrateEntry?.species_id).map(sp => (
                  <SelectItem key={sp.id} value={sp.id}>{sp.commonname}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setMigrateEntry(null)}>Cancelar</Button>
              <Button onClick={handleMigrate} disabled={!newSpeciesId}>Confirmar Migração</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notes Dialog */}
        <Dialog open={!!notesEntry} onOpenChange={() => setNotesEntry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notas - {notesEntry?.name}</DialogTitle>
              <DialogDescription>
                Adicione notas internas sobre este registro
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

        {/* Notify Dialog */}
        <Dialog open={!!notifySpecies} onOpenChange={() => { setNotifySpecies(null); setNotifyMessage(''); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Notificar Lista de Espera
              </DialogTitle>
              <DialogDescription>
                Enviar email para todos os interessados em <strong>{notifySpecies?.name}</strong> com status "Aguardando".
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mensagem personalizada (opcional)</label>
                <Textarea
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  placeholder="Deixe em branco para usar a mensagem padrão ou escreva uma mensagem personalizada..."
                  rows={4}
                />
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                <strong>Mensagem padrão:</strong> "Temos uma ótima notícia! O animal {notifySpecies?.name} que você demonstrou interesse está disponível para aquisição."
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setNotifySpecies(null); setNotifyMessage(''); }}>
                Cancelar
              </Button>
              <Button onClick={handleNotifyWaitlist} disabled={isSendingNotification}>
                {isSendingNotification ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Notificações
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Manual Entry Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar à Lista de Espera</DialogTitle>
              <DialogDescription>Adicione manualmente um interessado na lista de espera.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Espécie *</Label>
                <Select value={newEntry.species_id} onValueChange={(v) => setNewEntry({ ...newEntry, species_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione a espécie" /></SelectTrigger>
                  <SelectContent>
                    {allSpecies.map(sp => (
                      <SelectItem key={sp.id} value={sp.id}>{sp.commonname}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nome completo *</Label>
                <Input value={newEntry.name} onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })} placeholder="Nome do interessado" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={newEntry.email} onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
              <div>
                <Label>Telefone *</Label>
                <Input value={newEntry.phone} onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <Label>Preferência de contato</Label>
                <Select value={newEntry.contact_preference} onValueChange={(v) => setNewEntry({ ...newEntry, contact_preference: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
              <Button onClick={handleAddManualEntry}>Adicionar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
