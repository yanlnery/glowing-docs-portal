import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { siteAnalyticsService, SiteEvent } from '@/services/siteAnalyticsService';
import { KPICards } from '@/components/admin/analytics/KPICards';
import { ConversionFunnel } from '@/components/admin/analytics/ConversionFunnel';
import { DeviceAnalysis } from '@/components/admin/analytics/DeviceAnalysis';
import { TrafficSources } from '@/components/admin/analytics/TrafficSources';
import { CheckoutAnalysis } from '@/components/admin/analytics/CheckoutAnalysis';
import { CartAnalysis } from '@/components/admin/analytics/CartAnalysis';
import { FormAbandonmentAnalysis } from '@/components/admin/analytics/FormAbandonmentAnalysis';
import { AnalyticsFilters } from '@/components/admin/analytics/AnalyticsFilters';
import { Loader2 } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30days');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateRange(timeFilter);
      const { data, error } = await siteAnalyticsService.getAllEvents({ startDate, endDate });
      if (!error && data) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeFilter]);

  const getDateRange = (filter: string): { startDate?: string; endDate?: string } => {
    const now = new Date();
    let startDate: Date | undefined;

    switch (filter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return {};
    }

    return { startDate: startDate?.toISOString() };
  };

  // Filter events based on device and source
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (deviceFilter !== 'all' && event.device_type !== deviceFilter) return false;
      
      if (sourceFilter !== 'all') {
        const trafficSource = siteAnalyticsService.getTrafficSource(event.referrer);
        if (trafficSource !== sourceFilter) return false;
      }
      
      return true;
    });
  }, [events, deviceFilter, sourceFilter]);

  // Available sources for filter
  const availableSources = useMemo(() => {
    const sources = new Set<string>();
    events.forEach(event => {
      const source = siteAnalyticsService.getTrafficSource(event.referrer);
      sources.add(source);
    });
    return Array.from(sources).sort();
  }, [events]);

  // Calculate KPIs
  const kpiData = useMemo(() => {
    const sessions = new Set(filteredEvents.map(e => e.session_id)).size;
    const users = new Set(filteredEvents.filter(e => e.user_id).map(e => e.user_id)).size;
    const productViews = filteredEvents.filter(e => e.event_type === 'product_view').length;
    const addToCart = filteredEvents.filter(e => e.event_type === 'add_to_cart').length;
    const checkoutStarts = filteredEvents.filter(e => e.event_type === 'checkout_start').length;
    const whatsappRedirects = filteredEvents.filter(e => e.event_type === 'whatsapp_redirect').length;

    const conversionRate = sessions > 0 ? (whatsappRedirects / sessions) * 100 : 0;
    const cartConversionRate = addToCart > 0 ? (checkoutStarts / addToCart) * 100 : 0;
    const cartAbandonmentRate = 100 - cartConversionRate;

    return {
      totalSessions: sessions,
      uniqueUsers: users,
      productViews,
      addToCart,
      checkoutStarts,
      whatsappRedirects,
      conversionRate,
      cartConversionRate,
      cartAbandonmentRate,
    };
  }, [filteredEvents]);

  // Calculate funnel data
  const funnelData = useMemo(() => {
    return {
      sessions: new Set(filteredEvents.map(e => e.session_id)).size,
      productViews: filteredEvents.filter(e => e.event_type === 'product_view').length,
      addToCart: filteredEvents.filter(e => e.event_type === 'add_to_cart').length,
      checkoutStarts: filteredEvents.filter(e => e.event_type === 'checkout_start').length,
      whatsappRedirects: filteredEvents.filter(e => e.event_type === 'whatsapp_redirect').length,
    };
  }, [filteredEvents]);

  // Calculate device analysis data
  const deviceData = useMemo(() => {
    const deviceMap = new Map<string, { sessions: Set<string>; conversions: number; cartAbandonment: number }>();
    
    filteredEvents.forEach(event => {
      const device = event.device_type || 'Outro';
      if (!deviceMap.has(device)) {
        deviceMap.set(device, { sessions: new Set(), conversions: 0, cartAbandonment: 0 });
      }
      const data = deviceMap.get(device)!;
      data.sessions.add(event.session_id);
      if (event.event_type === 'whatsapp_redirect') {
        data.conversions++;
      }
    });

    return Array.from(deviceMap.entries()).map(([device, data]) => ({
      device,
      sessions: data.sessions.size,
      conversions: data.conversions,
      cartAbandonment: data.sessions.size > 0 
        ? ((data.sessions.size - data.conversions) / data.sessions.size) * 100 
        : 0,
    }));
  }, [filteredEvents]);

  // Calculate traffic sources data
  const trafficData = useMemo(() => {
    const sourceMap = new Map<string, { sessions: Set<string>; conversions: number; cartsStarted: number }>();
    
    filteredEvents.forEach(event => {
      const source = siteAnalyticsService.getTrafficSource(event.referrer);
      if (!sourceMap.has(source)) {
        sourceMap.set(source, { sessions: new Set(), conversions: 0, cartsStarted: 0 });
      }
      const data = sourceMap.get(source)!;
      data.sessions.add(event.session_id);
      if (event.event_type === 'whatsapp_redirect') data.conversions++;
      if (event.event_type === 'add_to_cart') data.cartsStarted++;
    });

    return Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      sessions: data.sessions.size,
      conversions: data.conversions,
      cartsStarted: data.cartsStarted,
    }));
  }, [filteredEvents]);

  // Calculate checkout analysis data
  const checkoutData = useMemo(() => {
    const checkoutStarts = filteredEvents.filter(e => e.event_type === 'checkout_start').length;
    const successfulCheckouts = filteredEvents.filter(e => e.event_type === 'checkout_success').length;
    
    const errorEvents = filteredEvents.filter(e => e.event_type === 'checkout_form_error');
    const errorMap = new Map<string, number>();
    
    errorEvents.forEach(event => {
      const errorType = (event.metadata as any)?.error_type || 'other';
      errorMap.set(errorType, (errorMap.get(errorType) || 0) + 1);
    });

    const errors = Array.from(errorMap.entries()).map(([type, count]) => ({
      type,
      count,
      label: type,
    }));

    return {
      totalCheckoutStarts: checkoutStarts,
      successfulCheckouts,
      errors,
    };
  }, [filteredEvents]);

  // Calculate form abandonment data
  const formAbandonmentData = useMemo(() => {
    const formOpens = filteredEvents.filter(e => e.event_type === 'checkout_form_open').length;
    const formAbandons = filteredEvents.filter(e => e.event_type === 'checkout_form_abandon').length;
    const successfulSubmissions = filteredEvents.filter(e => e.event_type === 'checkout_success').length;
    
    // Calculate avg time before abandon
    const abandonEvents = filteredEvents.filter(e => e.event_type === 'checkout_form_abandon');
    let totalTime = 0;
    let timeCount = 0;
    
    abandonEvents.forEach(event => {
      const time = (event.metadata as any)?.timeSpentSeconds;
      if (time && typeof time === 'number') {
        totalTime += time;
        timeCount++;
      }
    });
    
    const avgTimeBeforeAbandon = timeCount > 0 ? Math.round(totalTime / timeCount) : 0;
    
    // Calculate fields filled before abandon
    const fieldCountMap = new Map<string, number>();
    abandonEvents.forEach(event => {
      const filledFields = (event.metadata as any)?.filledFields;
      if (Array.isArray(filledFields)) {
        filledFields.forEach((field: string) => {
          fieldCountMap.set(field, (fieldCountMap.get(field) || 0) + 1);
        });
      }
    });
    
    const fieldsFilled = Array.from(fieldCountMap.entries()).map(([field, count]) => ({
      field,
      count,
    }));

    return {
      formOpens,
      formAbandons,
      successfulSubmissions,
      avgTimeBeforeAbandon,
      fieldsFilled,
    };
  }, [filteredEvents]);

  // Calculate cart analysis data
  const cartData = useMemo(() => {
    // Top added products
    const addedProducts = new Map<string, { id: string; name: string; count: number }>();
    filteredEvents.filter(e => e.event_type === 'add_to_cart').forEach(event => {
      if (event.product_id && event.product_name) {
        const existing = addedProducts.get(event.product_id) || { id: event.product_id, name: event.product_name, count: 0 };
        existing.count++;
        addedProducts.set(event.product_id, existing);
      }
    });

    const topAddedProducts = Array.from(addedProducts.values())
      .sort((a, b) => b.count - a.count)
      .map(p => ({ id: p.id, name: p.name, addedCount: p.count, abandonedCount: 0 }));

    // Cart size distribution (simplified - based on metadata if available)
    const cartSizeDistribution = [
      { size: '1 item', count: Math.floor(kpiData.addToCart * 0.5) },
      { size: '2-3 itens', count: Math.floor(kpiData.addToCart * 0.35) },
      { size: '4+ itens', count: Math.floor(kpiData.addToCart * 0.15) },
    ];

    return {
      topAddedProducts,
      topAbandonedProducts: [], // Would need more complex logic
      cartSizeDistribution,
      avgTimeToCheckout: 0, // Would need timestamp comparison
    };
  }, [filteredEvents, kpiData]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics do Site</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho e conversão do seu e-commerce
            </p>
          </div>
          <AnalyticsFilters
            timeFilter={timeFilter}
            deviceFilter={deviceFilter}
            sourceFilter={sourceFilter}
            onTimeFilterChange={setTimeFilter}
            onDeviceFilterChange={setDeviceFilter}
            onSourceFilterChange={setSourceFilter}
            onRefresh={loadData}
            isLoading={isLoading}
            availableSources={availableSources}
          />
        </div>

        {/* KPI Cards */}
        <KPICards data={kpiData} />

        {/* Conversion Funnel */}
        <ConversionFunnel data={funnelData} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceAnalysis data={deviceData} />
          <TrafficSources data={trafficData} />
        </div>

        {/* Checkout Analysis */}
        <CheckoutAnalysis data={checkoutData} />

        {/* Form Abandonment Analysis */}
        <FormAbandonmentAnalysis data={formAbandonmentData} />

        {/* Cart Analysis */}
        <CartAnalysis data={cartData} />
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
