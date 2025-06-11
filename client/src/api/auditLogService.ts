// src/api/auditLogService.ts
import { apiClient } from './apiClient'
import { AuditLog } from '@/types/auditLog'

/**
 * Fetches the list of audit logs from the API.
 * @returns A promise that resolves to an array of AuditLog objects.
 */
export const listAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const response = await apiClient.get<AuditLog[]>('/audit-logs')
    return response.data
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    // Re-throw the error to be handled by the calling component
    throw error
  }
}
