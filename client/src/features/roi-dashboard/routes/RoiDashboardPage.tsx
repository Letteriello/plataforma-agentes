import React, { useEffect, useState } from 'react';

import KpiCard from '@/features/dashboard/components/KpiCard';
import RoiChart from '@/features/dashboard/components/RoiChart';
import { ComponentSkeleton } from '@/components/ui/ComponentSkeleton';
import { dashboardService } from '@/services/dashboardService';
import { RoiMetricsResponse, RoiTimeSeriesResponse } from '@/types/common';

const RoiDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RoiMetricsResponse | null>(null);
  const [timeSeries, setTimeSeries] = useState<RoiTimeSeriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsData, timeSeriesData] = await Promise.all([
          dashboardService.getRoiMetrics(),
          dashboardService.getRoiTimeSeries(),
        ]);
        setMetrics(metricsData);
        setTimeSeries(timeSeriesData);
      } catch (err) {
        setError('Falha ao carregar os dados do dashboard.');
        void console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ComponentSkeleton className="h-[400px] w-full" />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!metrics || !timeSeries) {
    return <div className="text-center p-4">Nenhum dado disponível.</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de ROI</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard 
          title="Custo Total"
          value={`$${metrics.total_cost.value.toFixed(2)}`}
          change={metrics.total_cost.change}
          changeType='decrease_is_good'
        />
        <KpiCard 
          title="Total de Tokens"
          value={metrics.total_tokens.value.toLocaleString()}
          change={metrics.total_tokens.change}
          changeType='decrease_is_good'
        />
        <KpiCard 
          title="Custo Médio por Sessão"
          value={`$${metrics.avg_cost_per_session.value.toFixed(4)}`}
          change={metrics.avg_cost_per_session.change}
          changeType='decrease_is_good'
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <RoiChart 
          title="Custo ao Longo do Tempo"
          data={timeSeries.series}
          dataKeyX="timestamp"
          dataKeyY="cost"
          lineColor="#8884d8"
        />
        <RoiChart 
          title="Uso de Tokens ao Longo do Tempo"
          data={timeSeries.series}
          dataKeyX="timestamp"
          dataKeyY="tokens"
          lineColor="#82ca9d"
        />
      </div>
    </div>
  );
};

export default RoiDashboardPage;
