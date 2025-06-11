import React, { useState, useEffect } from 'react'
import { KpiCard } from '@/components/roi-dashboard/KpiCard'
import { RoiChart } from '@/components/roi-dashboard/RoiChart'
import { Kpi, RoiDataPoint } from '@/types/roi'

export const RoiDashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [roiData, setRoiData] = useState<RoiDataPoint[]>([])

  // TODO: Fetch data from API
  useEffect(() => {
    // setKpis(fetchedKpis);
    // setRoiData(fetchedRoiData);
  }, [])

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Painel de ROI</h2>
        <p className="text-muted-foreground">
          Acompanhe o retorno sobre o investimento e o valor gerado pelos seus
          agentes de IA.
        </p>
      </div>
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Principais Indicadores de Desempenho (KPIs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} kpi={kpi} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Análise de Custo vs. Benefício
        </h3>
        <RoiChart data={roiData} />
      </section>
    </div>
  )
}

export default RoiDashboardPage
