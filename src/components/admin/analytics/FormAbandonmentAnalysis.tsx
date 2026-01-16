import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Clock, FormInput, TrendingDown } from 'lucide-react';

interface FormAbandonmentProps {
  data: {
    formOpens: number;
    formAbandons: number;
    successfulSubmissions: number;
    avgTimeBeforeAbandon: number;
    fieldsFilled: Array<{ field: string; count: number }>;
  };
}

const FIELD_LABELS: Record<string, string> = {
  'fullName': 'Nome Completo',
  'cpf': 'CPF',
  'cep': 'CEP',
  'street': 'Rua',
  'number': 'Número',
  'complement': 'Complemento',
  'neighborhood': 'Bairro',
  'city': 'Cidade',
  'state': 'Estado',
};

const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

export const FormAbandonmentAnalysis: React.FC<FormAbandonmentProps> = ({ data }) => {
  const abandonRate = data.formOpens > 0 
    ? ((data.formAbandons / data.formOpens) * 100).toFixed(1) 
    : '0';

  const completionRate = data.formOpens > 0 
    ? ((data.successfulSubmissions / data.formOpens) * 100).toFixed(1) 
    : '0';

  // Pie chart data for funnel
  const pieData = [
    { name: 'Concluídos', value: data.successfulSubmissions, color: '#22c55e' },
    { name: 'Abandonados', value: data.formAbandons, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Bar chart data for fields filled before abandon
  const barData = data.fieldsFilled
    .map(f => ({
      name: FIELD_LABELS[f.field] || f.field,
      count: f.count,
      percentage: data.formAbandons > 0 ? ((f.count / data.formAbandons) * 100).toFixed(0) : '0',
    }))
    .sort((a, b) => b.count - a.count);

  // Find the "drop-off" point - where users stop filling
  const getDropOffInsight = () => {
    if (barData.length < 2) return null;
    
    // Find the biggest drop between consecutive fields
    let maxDrop = 0;
    let dropOffField = '';
    
    for (let i = 0; i < barData.length - 1; i++) {
      const drop = barData[i].count - barData[i + 1].count;
      if (drop > maxDrop) {
        maxDrop = drop;
        dropOffField = barData[i + 1].name;
      }
    }
    
    return dropOffField ? `Usuários tendem a desistir ao chegar no campo "${dropOffField}"` : null;
  };

  const dropOffInsight = getDropOffInsight();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="h-5 w-5" />
          Abandono do Formulário de Checkout
        </CardTitle>
        <CardDescription>
          Análise de quando usuários abrem o formulário mas não finalizam a compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <FormInput className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{data.formOpens}</p>
            <p className="text-xs text-muted-foreground">Formulários Abertos</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-600" />
            <p className="text-2xl font-bold text-red-600">{abandonRate}%</p>
            <p className="text-xs text-muted-foreground">Taxa de Abandono</p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-amber-600" />
            <p className="text-2xl font-bold text-amber-600">
              {data.avgTimeBeforeAbandon > 0 ? `${data.avgTimeBeforeAbandon}s` : '-'}
            </p>
            <p className="text-xs text-muted-foreground">Tempo Médio (abandono)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Completion vs Abandonment */}
          {pieData.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-4">Distribuição de Resultados</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Usuários']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Bar Chart - Fields filled before abandonment */}
          {barData.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-4">Campos Preenchidos Antes do Abandono</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value} (${barData.find(d => d.count === value)?.percentage || 0}%)`, 
                        'Abandonos'
                      ]}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Insight */}
        {dropOffInsight && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                💡 Insight: 
              </span>
              <span className="ml-1">{dropOffInsight}</span>
            </p>
          </div>
        )}

        {data.formOpens === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FormInput className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum formulário de checkout foi aberto no período</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};