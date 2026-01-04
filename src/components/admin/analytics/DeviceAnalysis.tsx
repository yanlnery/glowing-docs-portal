import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Monitor, Smartphone, Tablet, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeviceData {
  device: string;
  sessions: number;
  conversions: number;
  cartAbandonment: number;
}

interface DeviceAnalysisProps {
  data: DeviceData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const DeviceIcon: React.FC<{ device: string }> = ({ device }) => {
  switch (device.toLowerCase()) {
    case 'desktop':
      return <Monitor className="h-4 w-4" />;
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
};

export const DeviceAnalysis: React.FC<DeviceAnalysisProps> = ({ data }) => {
  const totalSessions = data.reduce((sum, d) => sum + d.sessions, 0);
  
  const chartData = data.map(d => ({
    name: d.device,
    value: d.sessions,
    percentage: totalSessions > 0 ? ((d.sessions / totalSessions) * 100).toFixed(1) : '0',
  }));

  // Find if mobile is performing worse than desktop
  const mobileData = data.find(d => d.device.toLowerCase() === 'mobile');
  const desktopData = data.find(d => d.device.toLowerCase() === 'desktop');
  
  const mobileConversionRate = mobileData && mobileData.sessions > 0 
    ? (mobileData.conversions / mobileData.sessions) * 100 
    : 0;
  const desktopConversionRate = desktopData && desktopData.sessions > 0 
    ? (desktopData.conversions / desktopData.sessions) * 100 
    : 0;
  
  const mobilePerformingWorse = mobileConversionRate < desktopConversionRate * 0.7; // 30% worse

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise por Dispositivo</CardTitle>
        <CardDescription>
          Comparação de performance entre Desktop, Mobile e Tablet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mobilePerformingWorse && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Mobile está com conversão {((1 - mobileConversionRate / desktopConversionRate) * 100).toFixed(0)}% menor que Desktop. 
              Considere otimizar a experiência mobile.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Sessões']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Table */}
          <div className="space-y-4">
            {data.map((device, index) => {
              const conversionRate = device.sessions > 0 
                ? ((device.conversions / device.sessions) * 100).toFixed(1) 
                : '0';
              
              return (
                <div 
                  key={device.device} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <DeviceIcon device={device.device} />
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="font-bold">{device.sessions.toLocaleString('pt-BR')}</span>
                      <span className="text-muted-foreground ml-1">sessões</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">{conversionRate}% conv.</span>
                      <span className="mx-1">|</span>
                      <span className="text-red-600">{device.cartAbandonment.toFixed(0)}% aband.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
