import React, { useState, useEffect } from 'react'
import { KpiCard } from '@/components/roi-dashboard/KpiCard'
import { RoiChart } from '@/components/roi-dashboard/RoiChart'
import { Kpi, RoiDataPoint } from '@/types/roi'

// Mock Data para simulação
const mockKpis: Kpi[] = [
  {
    title: 'Custo Total dos Agentes',
    value: 'R$ 1.250,00',
    change: '+5% vs. mês anterior',
    changeType: 'increase',
    description: 'Custo operacional total.',
  },
  {
    title: 'Tarefas Automatizadas',
    value: '1.830',
    change: '+15% vs. mês anterior',
    changeType: 'increase',
    description: 'Interações concluídas por agentes.',
  },
  {
    title: 'Economia de Tempo (Horas)',
    value: '457,5',
    change: '+15% vs. mês anterior',
    changeType: 'increase',
    description: 'Estimativa de horas de trabalho humano salvas.',
  },
  {
    title: 'ROI Estimado',
    value: '265%',
    change: '+20 pontos percentuais',
    changeType: 'increase',
    description: 'Retorno sobre o investimento.',
  },
]

const mockRoiData: RoiDataPoint[] = [
  { date: 'Jan/24', cost: 800, benefit: 1500 },
  { date: 'Fev/24', cost: 950, benefit: 2200 },
  { date: 'Mar/24', cost: 1100, benefit: 2800 },
  { date: 'Abr/24', cost: 1050, benefit: 3100 },
  { date: 'Mai/24', cost: 1200, benefit: 3500 },
  { date: 'Jun/24', cost: 1250, benefit: 4200 },
]

export const RoiDashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [roiData, setRoiData] = useState<RoiDataPoint[]>([])

  // Simula o fetch dos dados da API
  useEffect(() => {
    setKpis(mockKpis)
    setRoiData(mockRoiData)
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
