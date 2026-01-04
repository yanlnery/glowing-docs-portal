import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CheckoutError {
  type: string;
  count: number;
  label: string;
}

interface CheckoutAnalysisProps {
  data: {
    totalCheckoutStarts: number;
    successfulCheckouts: number;
    errors: CheckoutError[];
  };
}

const ERROR_LABELS: Record<string, string> = {
  'cpf_invalid': 'CPF Inválido',
  'cep_not_found': 'CEP Não Encontrado',
  'required_fields': 'Campos Obrigatórios',
  'validation_error': 'Erro de Validação',
  'other': 'Outros Erros',
};

export const CheckoutAnalysis: React.FC<CheckoutAnalysisProps> = ({ data }) => {
  const successRate = data.totalCheckoutStarts > 0 
    ? ((data.successfulCheckouts / data.totalCheckoutStarts) * 100).toFixed(1) 
    : '0';

  const failedCheckouts = data.totalCheckoutStarts - data.successfulCheckouts;
  const failureRate = data.totalCheckoutStarts > 0 
    ? ((failedCheckouts / data.totalCheckoutStarts) * 100).toFixed(1) 
    : '0';

  const sortedErrors = [...data.errors].sort((a, b) => b.count - a.count);
  const totalErrors = sortedErrors.reduce((sum, e) => sum + e.count, 0);

  const chartData = sortedErrors.map(error => ({
    name: ERROR_LABELS[error.type] || error.label || error.type,
    count: error.count,
    percentage: totalErrors > 0 ? ((error.count / totalErrors) * 100).toFixed(0) : '0',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Checkout</CardTitle>
        <CardDescription>
          Taxa de sucesso e erros mais comuns no processo de checkout
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Rate Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Taxa de Sucesso
              </span>
            </div>
            <p className="text-3xl font-bold text-green-600">{successRate}%</p>
            <p className="text-sm text-muted-foreground">
              {data.successfulCheckouts.toLocaleString('pt-BR')} de {data.totalCheckoutStarts.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Taxa de Falha
              </span>
            </div>
            <p className="text-3xl font-bold text-red-600">{failureRate}%</p>
            <p className="text-sm text-muted-foreground">
              {failedCheckouts.toLocaleString('pt-BR')} abandonos
            </p>
          </div>
        </div>

        {/* Error Chart */}
        {chartData.length > 0 ? (
          <>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Erros Mais Comuns no Formulário
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Ocorrências']}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Error Highlight */}
            {chartData.length > 0 && chartData[0].count > 0 && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    ⚠️ Principal problema: 
                  </span>
                  <span className="ml-1">
                    "{chartData[0].name}" representa {chartData[0].percentage}% dos erros
                  </span>
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>Nenhum erro de checkout registrado no período</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
