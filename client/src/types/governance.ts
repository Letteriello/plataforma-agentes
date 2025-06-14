// src/types/governance.ts

export type AutonomyLevel =
  | 'Nenhum'
  | 'Apenas Ferramentas Seguras'
  | 'Semi-Autônomo'
  | 'Totalmente Autônomo'

export interface ApprovalItem {
  id: string
  agentName: string
  action: string
  context: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface HistoryItem {
  id: string
  agentName: string
  action: string
  status: 'approved' | 'rejected'
  timestamp: string
  actor: string
  reason?: string
}

export interface AuditLogActor {
  type: 'user' | 'agent'
  id: string
  name: string
}

export interface AuditLog {
  id: string
  timestamp: string
  actor: AuditLogActor
  action: string
  details: Record<string, unknown>
  ipAddress?: string
}

