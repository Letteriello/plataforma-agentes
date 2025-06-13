import type { AutonomyLevel } from '@/components/governance/AutonomySpectrumSelector'
import type { ApprovalItem, AuditLog, HistoryItem } from '@/types/governance'

import api from './apiClient'

export const getAutonomyLevel = async (): Promise<{ autonomyLevel: AutonomyLevel }> => {
  const { data } = await api.get<{ autonomyLevel: AutonomyLevel }>('/governance/autonomy')
  return data
}

export const setAutonomyLevel = async (autonomyLevel: AutonomyLevel): Promise<void> => {
  await api.post('/governance/autonomy', { autonomyLevel })
}

export const getPendingApprovals = async (): Promise<ApprovalItem[]> => {
  const { data } = await api.get<ApprovalItem[]>('/approvals')
  return data
}

export const approveAction = async (id: string): Promise<void> => {
  await api.post(`/approvals/${id}/approve`)
}

export const rejectAction = async (id: string, reason: string): Promise<void> => {
  await api.post(`/approvals/${id}/reject`, { reason })
}

export const getApprovalHistory = async (): Promise<HistoryItem[]> => {
  const { data } = await api.get<HistoryItem[]>('/approvals/history')
  return data
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const { data } = await api.get<AuditLog[]>('/audit-logs')
  return data
}
