import axios from 'axios'

import apiClient from '@/api/apiClient'
import type {
  Document,
  KnowledgeBase,
  KnowledgeBaseConfig,
  SearchResult,
} from '@/types/memory'

/**
 * Serviço para gerenciar operações relacionadas ao módulo de Memória
 */
export const memoryService = {
  /**
   * Obtém todas as bases de conhecimento
   */
  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const { data } = await apiClient.get<KnowledgeBase[]>('/knowledge-bases')
    return data
  },

  /**
   * Obtém uma base de conhecimento específica pelo ID
   */
  async getKnowledgeBaseById(id: string): Promise<KnowledgeBase | null> {
    try {
      const { data } = await apiClient.get<KnowledgeBase>(
        `/knowledge-bases/${id}`,
      )
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Cria uma nova base de conhecimento
   */
  async createKnowledgeBase(
    knowledgeBaseData: Omit<
      KnowledgeBase,
      'id' | 'createdAt' | 'updatedAt' | 'documents'
    >,
  ): Promise<KnowledgeBase> {
    const { data } = await apiClient.post<KnowledgeBase>(
      '/knowledge-bases',
      knowledgeBaseData,
    )
    return data
  },

  /**
   * Atualiza uma base de conhecimento existente
   */
  async updateKnowledgeBase(
    id: string,
    updates: Partial<
      Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt' | 'documents'>
    >,
  ): Promise<KnowledgeBase | null> {
    try {
      const { data } = await apiClient.put<KnowledgeBase>(
        `/knowledge-bases/${id}`,
        updates,
      )
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Exclui uma base de conhecimento
   */
  async deleteKnowledgeBase(id: string): Promise<void> {
    await apiClient.delete(`/knowledge-bases/${id}`)
  },

  /**
   * Obtém todos os documentos de uma base de conhecimento
   */
  async getDocuments(knowledgeBaseId: string): Promise<Document[]> {
    const { data } = await apiClient.get<Document[]>(
      `/knowledge-bases/${knowledgeBaseId}/documents`,
    )
    return data
  },

  /**
   * Obtém um documento específico de uma base de conhecimento
   */
  async getDocumentById(
    knowledgeBaseId: string,
    documentId: string,
  ): Promise<Document | null> {
    try {
      const { data } = await apiClient.get<Document>(
        `/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`,
      )
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Faz upload de um documento para uma base de conhecimento
   */
  async uploadDocument(
    knowledgeBaseId: string,
    file: File,
    metadata?: Record<string, any>,
  ): Promise<Document> {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }

    const { data } = await apiClient.post<Document>(
      `/knowledge-bases/${knowledgeBaseId}/documents`,
      formData,
    )
    return data
  },

  /**
   * Exclui um documento
   */
  async deleteDocument(
    knowledgeBaseId: string,
    documentId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`,
    )
  },

  /**
   * Busca em uma base de conhecimento específica
   */
  async searchKnowledgeBase(
    knowledgeBaseId: string,
    query: string,
    topK?: number,
  ): Promise<SearchResult[]> {
    const { data } = await apiClient.get<SearchResult[]>(
      `/knowledge-bases/${knowledgeBaseId}/search`,
      {
        params: { query, topK },
      },
    )
    return data
  },

  /**
   * Obtém a configuração de uma base de conhecimento
   */
  async getKnowledgeBaseConfig(
    knowledgeBaseId: string,
  ): Promise<KnowledgeBaseConfig | null> {
    try {
      const { data } = await apiClient.get<KnowledgeBaseConfig>(
        `/knowledge-bases/${knowledgeBaseId}/config`,
      )
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Atualiza a configuração de uma base de conhecimento
   */
  async updateKnowledgeBaseConfig(
    knowledgeBaseId: string,
    config: Partial<KnowledgeBaseConfig>,
  ): Promise<KnowledgeBaseConfig> {
    const { data } = await apiClient.put<KnowledgeBaseConfig>(
      `/knowledge-bases/${knowledgeBaseId}/config`,
      config,
    )
    return data
  },
}
