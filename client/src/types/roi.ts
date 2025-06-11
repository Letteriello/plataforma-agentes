export interface Kpi {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  description: string
}

export interface RoiDataPoint {
  date: string
  cost: number
  revenue: number
  savings: number
}
