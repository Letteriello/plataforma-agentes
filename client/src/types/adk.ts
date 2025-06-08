export interface LlmAgent {
  id: string;
  model: string;
  instruction: string;
  tools?: string[];
}

export interface WorkflowAgent {
  id: string;
  agents: LlmAgent[];
}
