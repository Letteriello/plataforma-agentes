// src/api/auditLogService.ts
import { AuditLog } from '@/types/common'

import apiClient from './apiClient'

/**
 * Fetches the list of audit logs from the API.
 * @returns A promise that resolves to an array of AuditLog objects.
 */
export const listAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await apiClient.get<AuditLog[]>('/audit-logs')
  return response.data
}

