import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Download, Search, Trash2, RefreshCw, FileText, Users } from 'lucide-react';
import { materialLeadAdminService, MaterialLeadRow, MaterialLeadFilters } from '@/services/materialLeadAdminService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MaterialLeadsAdmin() {
  const [leads, setLeads] = useState<MaterialLeadRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const { toast } = useToast();

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    
    const filters: MaterialLeadFilters = {};
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    if (selectedMaterial && selectedMaterial !== 'all') filters.material = selectedMaterial;

    const { data, error } = await materialLeadAdminService.fetchLeads(filters);
    
    if (error) {
      toast({
        title: 'Erro ao carregar leads',
        description: error,
        variant: 'destructive',
      });
    } else {
      setLeads(data);
    }
    setIsLoading(false);
  }, [searchQuery, selectedMaterial, toast]);

  const loadMaterials = useCallback(async () => {
    const materials = await materialLeadAdminService.getUniqueMaterials();
    setAvailableMaterials(materials);
  }, []);

  useEffect(() => {
    loadLeads();
    loadMaterials();
  }, [loadLeads, loadMaterials]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads();
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast({
        title: 'Nenhum lead para exportar',
        description: 'Aplique filtros ou aguarde carregar os dados.',
        variant: 'default',
      });
      return;
    }
    materialLeadAdminService.exportToCSV(leads);
    toast({
      title: 'CSV exportado',
      description: `${leads.length} leads exportados com sucesso.`,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;
    
    const { success, error } = await materialLeadAdminService.deleteLead(id);
    if (success) {
      toast({ title: 'Lead excluído' });
      loadLeads();
    } else {
      toast({ title: 'Erro ao excluir', description: error, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Leads de Materiais
            </h1>
            <p className="text-muted-foreground">
              Usuários que baixaram materiais educativos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadLeads} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={handleExportCSV} disabled={leads.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leads.length}</p>
                <p className="text-sm text-muted-foreground">Total de leads {selectedMaterial !== 'all' ? 'filtrados' : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Filtrar por material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os materiais</SelectItem>
                  {availableMaterials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">Buscar</Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Material Baixado</TableHead>
                    <TableHead>Consentimento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum lead encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>
                          {lead.downloaded_material ? (
                            <Badge variant="secondary" className="max-w-[200px] truncate">
                              {lead.downloaded_material}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={lead.consent ? 'default' : 'outline'}>
                            {lead.consent ? 'Sim' : 'Não'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
