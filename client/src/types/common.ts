// Arquivo: client/src/types/common.ts
// CONSOLIDAÇÃO DE TIPOS COMUNS E DE DOMÍNIOS MENORES

// De marketplace.ts
export type MarketplaceItemType = 'agent' | 'tool';

export interface MarketplaceItem {
  id: string;
  name: string;
  author: string;
  description: string;
  type: MarketplaceItemType;
  tags: string[];
  version: string;
  downloads: number;
}

// De secret.ts
/**
 * Represents a secret returned by the API (value is not exposed).
 * Combines fields from both secret.ts and secrets.ts
 */
export interface Secret {
  id: string;
  name: string;
  description: string;
  value?: string; // Value is optional and should not be sent back from the server
  createdAt: string;
  lastUsed?: string;
}

/**
 * Data Transfer Object for creating or updating a secret.
 */
export interface SecretCreate {
  name: string;
  value: string;
}

// De auditLog.ts
export interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    type: 'user' | 'agent';
    id: string;
    name: string;
  };
  action: string;
  details: Record<string, unknown>;
  ipAddress?: string;
}

// De governance.ts
export type AutonomyLevel =
  | 'Nenhum'
  | 'Apenas Ferramentas Seguras'
  | 'Semi-Autônomo'
  | 'Totalmente Autônomo';

export interface ApprovalItem {
  id: string;
  agentName: string;
  action: string;
  context: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  agentName: string;
  action: string;
  status: 'approved' | 'rejected';
  timestamp: string;
  actor: string;
  reason?: string;
}

// De dashboard.ts (ROI Metrics)
export interface KpiCardMetric {
  value: number;
  change: number; // Represents the percentage change from the previous period
}

export interface RoiMetricsResponse {
  total_cost: KpiCardMetric;
  total_tokens: KpiCardMetric;
  avg_cost_per_session: KpiCardMetric;
  cost_by_model: Record<string, number>;
  tokens_by_model: Record<string, number>;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  cost: number;
  tokens: number;
}

export interface RoiTimeSeriesResponse {
  series: TimeSeriesDataPoint[];
}

// De roi.ts
/**
 * Representa um único Indicador Chave de Desempenho (KPI).
 */
export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  description: string;
}

/**
 * Representa um ponto de dados no gráfico de ROI, comparando custo e benefício.
 */
export interface RoiDataPoint {
  date: string; // Ex: 'Jan/24', 'Fev/24'
  cost: number; // Custo operacional dos agentes no período
  benefit: number; // Benefício gerado (ex: economia de tempo, vendas, etc.)
}
