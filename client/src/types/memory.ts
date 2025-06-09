/**
 * Tipos para o módulo de Memória
 * Define as interfaces para bases de conhecimento e documentos
 */

// Tipo de base de conhecimento
export enum KnowledgeBaseType {
  RAG = 'RAG',
  FINE_TUNING = 'Fine-Tuning'
}

// Interface para base de conhecimento
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: KnowledgeBaseType;
  createdAt: string;
  updatedAt: string;
  documents?: number; // Número de documentos (para RAG)
  baseModel?: string; // Modelo base (para Fine-Tuning)
  status?: 'active' | 'processing' | 'error';
}

// Status do documento
export enum DocumentStatus {
  PROCESSING = 'Processando',
  PROCESSED = 'Processado',
  ERROR = 'Erro'
}

// Interface para documento
export interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: DocumentStatus;
  knowledgeBaseId: string;
  contentType?: string;
  vectorCount?: number;
  errorMessage?: string;
}

// Interface para parâmetros de RAG
export interface RAGParams {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
}

// Interface para parâmetros de Fine-Tuning
export interface FineTuningParams {
  baseModel: string;
  epochs: number;
  batchSize: number;
  learningRate: number;
}

// Interface para configurações de base de conhecimento
export interface KnowledgeBaseConfig {
  id: string;
  type: KnowledgeBaseType;
  ragParams?: RAGParams;
  fineTuningParams?: FineTuningParams;
}