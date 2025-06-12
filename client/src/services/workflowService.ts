/**
 * @file Serviço para gerenciar operações de workflow com o backend.
 */

import apiClient from '@/api/apiClient';

// Define a estrutura de um nó do workflow para a API
// (Pode ser expandido conforme a necessidade do backend)
export interface WorkflowNodeData {
  id: string;
  type: string;
  data: any;
  children: WorkflowNodeData[];
}

/**
 * Salva a estrutura de um workflow no backend.
 * @param workflowTree A estrutura hierárquica do workflow.
 * @returns A resposta da API.
 */
export const saveWorkflow = async (workflowTree: WorkflowNodeData[]) => {
  try {
    const response = await apiClient.post('/workflows', { workflow: workflowTree });
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar o workflow:', error);
    throw error; // Re-lança o erro para ser tratado pelo chamador
  }
};

/**
 * Executa um workflow existente passando dados iniciais.
 * @param workflowId ID do workflow salvo.
 * @param initialData Dados iniciais a serem passados para a execução.
 */
export const executeWorkflow = async (
  workflowId: string,
  initialData: Record<string, any> = {}
) => {
  try {
    const response = await apiClient.post(`/workflows/${workflowId}/execute`, initialData);
    return response.data;
  } catch (error) {
    console.error('Erro ao executar o workflow:', error);
    throw error;
  }
};
