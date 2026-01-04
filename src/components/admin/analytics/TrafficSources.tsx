import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Globe, Instagram, MessageCircle, Search, Link2 } from 'lucide-react';

interface TrafficSource {
  source: string;
  sessions: number;
  conversions: number;
  cartsStarted: number;
}

interface TrafficSourcesProps {
  data: TrafficSource[];
}

const SOURCE_COLORS: Record<string, string> = {
  'Direto': '#6366f1',
  'Instagram': '#e1306c',
  'Facebook': '#1877f2',
  'WhatsApp': '#25d366',
  'Google': '#ea4335',
  'Bing': '#00897b',
  'YouTube': '#ff0000',
  'TikTok': '#000000',
  'Outro': '#94a3b8',
};

const SourceIcon: React.FC<{ source: string }> = ({ source }) => {
  switch (source.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'whatsapp':
      return <MessageCircle className="h-4 w-4" />;
    case 'google':
    case 'bing':
      return <Search className="h-4 w-4" />;
    case 'direto':
      return <Globe className="h-4 w-4" />;
    default:
      return <Link2 className="h-4 w-4" />;
  }
};

export const TrafficSources: React.FC<TrafficSourcesProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.sessions - a.sessions);
  const totalSessions = data.reduce((sum, d) => sum + d.sessions, 0);

  const chartData = sortedData.map(source => ({
    ...source,
    conversionRate: source.sessions > 0 
      ? ((source.conversions / source.sessions) * 100).toFixed(1) 
      : '0',
  }));

  // Find best converting source
  const bestConvertingSource = chartData.reduce((best, current) => {
    const currentRate = parseFloat(current.conversionRate);
    const bestRate = parseFloat(best.conversionRate);
    return currentRate > bestRate && current.sessions >= 10 ? current : best;
  }, chartData[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Origem do Tráfego</CardTitle>
        <CardDescription>
          De onde vêm seus visitantes e quais canais convertem melhor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="source" type="category" width={80} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'sessions') return [value.toLocaleString('pt-BR'), 'Sessões'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry) => (
                    <Cell 
                      key={entry.source} 
                      fill={SOURCE_COLORS[entry.source] || SOURCE_COLORS['Outro']} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-3">
            {chartData.slice(0, 6).map((source) => {
              const percentage = totalSessions > 0 
                ? ((source.sessions / totalSessions) * 100).toFixed(1) 
                : '0';

              return (
                <div 
                  key={source.source}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${SOURCE_COLORS[source.source] || SOURCE_COLORS['Outro']}20` }}
                    >
                      <SourceIcon source={source.source} />
                    </div>
                    <div>
                      <p className="font-medium">{source.source}</p>
                      <p className="text-xs text-muted-foreground">{percentage}% do tráfego</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{source.sessions.toLocaleString('pt-BR')}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600">{source.conversionRate}% conv.</span>
                      <span className="text-muted-foreground">{source.cartsStarted} carrinhos</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight */}
        {bestConvertingSource && parseFloat(bestConvertingSource.conversionRate) > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold text-green-700 dark:text-green-400">
                💡 Melhor canal convertendo: 
              </span>
              <span className="ml-1">
                {bestConvertingSource.source} com {bestConvertingSource.conversionRate}% de conversão
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
