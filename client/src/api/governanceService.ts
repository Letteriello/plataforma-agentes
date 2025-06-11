import api from './api';
import { ApprovalItem, HistoryItem } from '@/types/governance';
import { AutonomyLevel } from '@/components/governance/AutonomySpectrumSelector';

export const getAutonomyLevel = async (): Promise<{ autonomyLevel: AutonomyLevel }> => {
  const response = await api.get('/governance/autonomy');
  return response.data;
};

export const setAutonomyLevel = async (autonomyLevel: AutonomyLevel): Promise<void> => {
  await api.post('/governance/autonomy', { autonomyLevel });
};

export const getPendingApprovals = async (): Promise<ApprovalItem[]> => {
  const response = await api.get('/approvals');
  return response.data;
};

export const approveAction = async (id: string): Promise<void> => {
  await api.post(`/approvals/${id}/approve`);
};

export const rejectAction = async (id: string, reason: string): Promise<void> => {
  await api.post(`/approvals/${id}/reject`, { reason });
};

export const getApprovalHistory = async (): Promise<HistoryItem[]> => {
  const response = await api.get('/approvals/history');
  return response.data;
};
