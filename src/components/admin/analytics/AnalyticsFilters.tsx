import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';

interface AnalyticsFiltersProps {
  timeFilter: string;
  deviceFilter: string;
  sourceFilter: string;
  onTimeFilterChange: (value: string) => void;
  onDeviceFilterChange: (value: string) => void;
  onSourceFilterChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  availableSources: string[];
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  timeFilter,
  deviceFilter,
  sourceFilter,
  onTimeFilterChange,
  onDeviceFilterChange,
  onSourceFilterChange,
  onRefresh,
  isLoading,
  availableSources,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Time Filter */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="yesterday">Ontem</SelectItem>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
            <SelectItem value="all">Todo período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Device Filter */}
      <Select value={deviceFilter} onValueChange={onDeviceFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Dispositivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos dispositivos</SelectItem>
          <SelectItem value="Desktop">Desktop</SelectItem>
          <SelectItem value="Mobile">Mobile</SelectItem>
          <SelectItem value="Tablet">Tablet</SelectItem>
        </SelectContent>
      </Select>

      {/* Source Filter */}
      <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Origem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas origens</SelectItem>
          {availableSources.map(source => (
            <SelectItem key={source} value={source}>{source}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Refresh Button */}
      <Button 
        variant="outline" 
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};
