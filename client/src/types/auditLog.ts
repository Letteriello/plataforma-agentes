export interface AuditLog {
  id: string
  timestamp: string
  actor: {
    type: 'user' | 'agent'
    id: string
    name: string
  }
  action: string
  details: Record<string, unknown>
  ipAddress?: string
}
