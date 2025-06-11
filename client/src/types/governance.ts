// src/types/governance.ts

export interface ApprovalItem {
  id: string;
  agentName: string;
  action: string;
  context: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // Consider using Date type if appropriate for application logic
}

export interface HistoryItem {
  id: string; // Can be the original approval item's ID or a new unique ID for the history entry
  agentName: string;
  action: string; // e.g., 'Tool Usage', 'Configuration Change', 'Message Review'
  status: 'approved' | 'rejected' | 'auto-approved' | 'pending' | 'escalated'; // Expanded status
  timestamp: string; // ISO date string of when the decision/event occurred
  actor: string; // User ID, system identifier (e.g., 'System:AutoApprovalRule'), or agent ID
  reason?: string; // Optional reason for approval/rejection, or note
  context?: string; // Original context of the approval request, if needed for history view
  changes?: Record<string, { oldValue: any; newValue: any }>; // For config changes
}
