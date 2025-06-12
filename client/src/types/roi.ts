/**
 * @file Contém as definições de tipo para o Painel de ROI.
 */

/**
 * Representa um único Indicador Chave de Desempenho (KPI).
 */
export interface Kpi {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  description: string
}

/**
 * Representa um ponto de dados no gráfico de ROI, comparando custo e benefício.
 */
export interface RoiDataPoint {
  date: string // Ex: 'Jan/24', 'Fev/24'
  cost: number // Custo operacional dos agentes no período
  benefit: number // Benefício gerado (ex: economia de tempo, vendas, etc.)
}
