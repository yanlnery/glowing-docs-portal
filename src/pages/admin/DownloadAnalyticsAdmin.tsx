import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, Download, Eye, LogIn, UserPlus, FileText, RefreshCw, TrendingUp } from 'lucide-react';

interface AnalyticsEvent {
  id: string;
  action: string;
  created_at: string;
  items: {
    material_title?: string;
    source?: string;
    timestamp?: string;
  };
  session_id: string | null;
}

interface FunnelStep {
  key: string;
  label: string;
  icon: React.ElementType;
  count: number;
}

type PeriodFilter = '24h' | '7d' | '30d' | 'all';

const DownloadAnalyticsAdmin: React.FC = () => {
  const [period, setPeriod] = useState<PeriodFilter>('7d');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [topMaterials, setTopMaterials] = useState<{ title: string; count: number }[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('cart_analytics')
        .select('*')
        .like('action', 'download_%')
        .order('created_at', { ascending: false });

      // Apply period filter
      if (period !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (period) {
          case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query.limit(500);

      if (error) throw error;

      const typedEvents = (data || []).map(event => ({
        ...event,
        items: typeof event.items === 'object' && event.items !== null 
          ? event.items as AnalyticsEvent['items']
          : {}
      }));

      setEvents(typedEvents);
      
      // Calculate funnel data
      const eventCounts: Record<string, number> = {};
      typedEvents.forEach(event => {
        const action = event.action.replace('download_', '');
        eventCounts[action] = (eventCounts[action] || 0) + 1;
      });

      const funnel: FunnelStep[] = [
        { key: 'modal_open', label: 'Modal Aberto', icon: Eye, count: eventCounts['modal_open'] || 0 },
        { key: 'option_signup_clicked', label: 'Clicou Cadastro', icon: UserPlus, count: eventCounts['option_signup_clicked'] || 0 },
        { key: 'option_login_clicked', label: 'Clicou Login', icon: LogIn, count: eventCounts['option_login_clicked'] || 0 },
        { key: 'option_lead_form_clicked', label: 'Clicou Formulário Lead', icon: FileText, count: eventCounts['option_lead_form_clicked'] || 0 },
        { key: 'lead_form_submitted', label: 'Lead Enviado', icon: FileText, count: eventCounts['lead_form_submitted'] || 0 },
        { key: 'signup_complete_with_pending', label: 'Cadastro Completo', icon: UserPlus, count: eventCounts['signup_complete_with_pending'] || 0 },
        { key: 'login_complete_with_pending', label: 'Login Completo', icon: LogIn, count: eventCounts['login_complete_with_pending'] || 0 },
        { key: 'download_started', label: 'Download Iniciado', icon: Download, count: eventCounts['download_started'] || 0 },
      ];

      setFunnelData(funnel);

      // Calculate top materials
      const materialCounts: Record<string, number> = {};
      typedEvents
        .filter(e => e.action === 'download_download_started' && e.items?.material_title)
        .forEach(event => {
          const title = event.items.material_title!;
          materialCounts[title] = (materialCounts[title] || 0) + 1;
        });

      const sortedMaterials = Object.entries(materialCounts)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopMaterials(sortedMaterials);
    } catch (err) {
      console.error('Error fetching download analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const getEventLabel = (action: string): string => {
    const labels: Record<string, string> = {
      'download_modal_open': 'Modal Aberto',
      'download_option_signup_clicked': 'Clicou Cadastro',
      'download_option_login_clicked': 'Clicou Login',
      'download_option_lead_form_clicked': 'Clicou Lead Form',
      'download_lead_form_submitted': 'Lead Enviado',
      'download_signup_complete_with_pending': 'Cadastro Completo',
      'download_login_complete_with_pending': 'Login Completo',
      'download_download_started': 'Download Iniciado',
    };
    return labels[action] || action;
  };

  const getEventColor = (action: string): string => {
    if (action.includes('download_started')) return 'bg-green-500';
    if (action.includes('complete')) return 'bg-blue-500';
    if (action.includes('submitted')) return 'bg-purple-500';
    if (action.includes('clicked')) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const calculateConversionRate = (current: number, previous: number): string => {
    if (previous === 0) return '0%';
    return `${((current / previous) * 100).toFixed(1)}%`;
  };

  const modalOpens = funnelData.find(f => f.key === 'modal_open')?.count || 0;
  const downloads = funnelData.find(f => f.key === 'download_started')?.count || 0;
  const overallConversion = modalOpens > 0 ? ((downloads / modalOpens) * 100).toFixed(1) : '0';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics de Downloads</h1>
            <p className="text-muted-foreground">Funil de conversão: Modal → Cadastro → Download</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="all">Todo período</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Modais Abertos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{modalOpens}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Downloads Iniciados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{downloads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{overallConversion}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Funil de Conversão
            </CardTitle>
            <CardDescription>Visualização das etapas do processo de download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.filter(step => step.count > 0).map((step, index, filteredArray) => {
                const Icon = step.icon;
                const prevCount = index > 0 ? filteredArray[index - 1].count : step.count;
                const conversionRate = calculateConversionRate(step.count, prevCount);
                const widthPercent = modalOpens > 0 ? Math.max((step.count / modalOpens) * 100, 10) : 10;
                
                return (
                  <div key={step.key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{step.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.count}</span>
                        {index > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {conversionRate}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-primary/80 rounded-md transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    {index < filteredArray.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Materials and Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Top Materiais Baixados</CardTitle>
              <CardDescription>Materiais mais populares</CardDescription>
            </CardHeader>
            <CardContent>
              {topMaterials.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum download registrado no período.</p>
              ) : (
                <div className="space-y-3">
                  {topMaterials.map((material, index) => (
                    <div key={material.title} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <span className="font-medium truncate max-w-[200px]">{material.title}</span>
                      </div>
                      <Badge variant="secondary">{material.count} downloads</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
              <CardDescription>Últimas ações registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.slice(0, 20).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge className={`${getEventColor(event.action)} text-white text-xs`}>
                            {getEventLabel(event.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {event.items?.material_title || '-'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), "dd/MM HH:mm", { locale: ptBR })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DownloadAnalyticsAdmin;
