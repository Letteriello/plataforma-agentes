import { Agent } from '@/types/dashboard';

export const getAgentStatusBadgeVariant = (status: Agent['status']) => {
  switch (status) {
    case 'online':
      return 'default';
    case 'busy':
      return 'secondary';
    case 'idle':
      return 'outline';
    case 'offline':
    default:
      return 'outline';
  }
};

export const getAgentStatusText = (status: Agent['status']) => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'busy':
      return 'Ocupado';
    case 'idle':
      return 'Inativo';
    case 'offline':
    default:
      return 'Offline';
  }
};

export const getAgentStatusColor = (status: Agent['status']) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'busy':
      return 'bg-amber-500';
    case 'idle':
      return 'bg-gray-500';
    case 'offline':
    default:
      return 'bg-gray-300';
  }
};

export const formatResponseTime = (seconds: number): string => {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  }
  return `${seconds.toFixed(1)}s`;
};

export const formatTokenNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
