import { useCallback, useEffect, useState } from 'react'

import { memoryService } from '@/features/memoria/services/memoryService'
import { useToast } from '@/components/ui/use-toast'
import { type Document, type KnowledgeBase, KnowledgeBaseType } from '@/types/memory'

export function useMemoryModule() {
  // Estado para bases de conhecimento
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [filteredKnowledgeBases, setFilteredKnowledgeBases] = useState<
    KnowledgeBase[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<KnowledgeBaseType | 'all'>(
    'all',
  )
  const [isLoading, setIsLoading] = useState(false)

  // Estado para documentos
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    useState<KnowledgeBase | null>(null)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false) // Novo estado para upload

  // Estado para diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const { toast } = useToast()

  // Aplicar filtros às bases de conhecimento
  const applyFilters = useCallback(
    (
      data: KnowledgeBase[],
      search: string,
      type: KnowledgeBaseType | 'all',
    ) => {
      let filteredData = data
      if (search) {
        filteredData = filteredData.filter((kb) =>
          kb.name.toLowerCase().includes(search.toLowerCase()),
        )
      }
      if (type !== 'all') {
        filteredData = filteredData.filter((kb) => kb.type === type)
      }
      setFilteredKnowledgeBases(filteredData)
    },
    [],
  )

  // Carregar bases de conhecimento
  const loadKnowledgeBases = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await memoryService.getKnowledgeBases()
      setKnowledgeBases(data)
      applyFilters(data, searchTerm, selectedType)
    } catch (error) {
      void console.error('Erro ao carregar bases de conhecimento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as bases de conhecimento.',
        variant: 'destructive',
      })
      throw error // Re-throw para o componente poder tratar
    } finally {
      setIsLoading(false)
    }
  }, [applyFilters, searchTerm, selectedType, toast])

  // Efeito para recarregar e filtrar quando o termo de busca ou tipo muda
  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadKnowledgeBases()
      } catch (error) {
        // O erro já é tratado e exibido como um toast dentro de `loadKnowledgeBases`
        void console.error(
          'Falha ao carregar bases de conhecimento no useEffect:',
          error,
        )
      }
    }
    void fetchData()
  }, [loadKnowledgeBases])

  // Carregar documentos de uma base de conhecimento específica
  const loadDocuments = useCallback(
    async (knowledgeBaseId: string) => {
      setIsLoadingDocuments(true)
      try {
        const knowledgeBase = await memoryService.getKnowledgeBaseById(
          knowledgeBaseId,
        )
        setSelectedKnowledgeBase(knowledgeBase)

        if (knowledgeBase?.type === KnowledgeBaseType.RAG) {
          const data = await memoryService.getDocuments(knowledgeBaseId)
          setDocuments(data)
        } else {
          setDocuments([])
        }
      } catch (error) {
        void console.error('Erro ao carregar documentos:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os documentos.',
          variant: 'destructive',
        })
        throw error // Re-throw
      } finally {
        setIsLoadingDocuments(false)
      }
    },
    [toast],
  )

  // Selecionar uma base de conhecimento e carregar seus documentos
  const handleSelectKnowledgeBase = useCallback(
    async (knowledgeBase: KnowledgeBase | null) => {
      if (knowledgeBase) {
        try {
          await loadDocuments(knowledgeBase.id)
        } catch (error) {
          // O erro já é tratado e exibido como um toast dentro de `loadDocuments`
          void console.error(
            'Falha ao carregar documentos para a base de conhecimento selecionada:',
            error,
          )
        }
      } else {
        setSelectedKnowledgeBase(null)
        setDocuments([])
      }
    },
    [loadDocuments],
  )

  // Criar uma nova base de conhecimento
  const createKnowledgeBase = useCallback(
    async (knowledgeBaseData: Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt' | 'documents'>) => {
      try {
        const newKnowledgeBase = await memoryService.createKnowledgeBase(
          knowledgeBaseData,
        )
        setKnowledgeBases((prev) => [...prev, newKnowledgeBase]);
        setFilteredKnowledgeBases((prev) => [...prev, newKnowledgeBase]); // Adiciona também aos filtrados
        setCreateDialogOpen(false); // Fechar o diálogo após o sucesso

        toast({
          title: 'Sucesso!',
          description: `A base de conhecimento "${newKnowledgeBase.name}" foi criada.`,
        });

        return newKnowledgeBase;
      } catch (error) {
        void console.error('Erro ao criar base de conhecimento:', error)
        toast({
          title: 'Erro',
          description: 'Erro ao criar a base de conhecimento.',
          variant: 'destructive',
        })
        throw error // Re-throw
      }
    },
    [toast],
  )

  // Excluir uma base de conhecimento
  const deleteKnowledgeBase = useCallback(
    async (knowledgeBaseId: string) => {
      try {
        await memoryService.deleteKnowledgeBase(knowledgeBaseId)
        setKnowledgeBases((prev) =>
          prev.filter((kb) => kb.id !== knowledgeBaseId),
        )
        setFilteredKnowledgeBases((prev) =>
          prev.filter((kb) => kb.id !== knowledgeBaseId),
        )
        toast({
          title: 'Sucesso',
          description: 'Base de conhecimento excluída com sucesso.',
        })
      } catch (error) {
        void console.error('Erro ao excluir base de conhecimento:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a base de conhecimento.',
          variant: 'destructive',
        })
        throw error // Re-throw
      }
    },
    [toast],
  )

  // Fazer upload de documentos
  const uploadDocuments = useCallback(
    async (files: File[]) => {
      if (!selectedKnowledgeBase) {
        toast({
          title: 'Erro de Upload',
          description: 'Nenhuma base de conhecimento selecionada.',
          variant: 'destructive',
        })
        return
      }

      setIsUploadingDocuments(true)
      const uploadPromises = files.map((file) =>
        memoryService.uploadDocument(selectedKnowledgeBase.id, file),
      )

      try {
        const results = await Promise.allSettled(uploadPromises)

        const successfulUploads = results.filter(
          (result) => result.status === 'fulfilled',
        ).length
        const failedUploads = results.length - successfulUploads

        if (successfulUploads > 0) {
          toast({
            title: 'Upload Concluído',
            description: `${successfulUploads} de ${files.length} documentos enviados com sucesso.`,
          })
        }

        if (failedUploads > 0) {
          toast({
            title: 'Erro no Upload',
            description: `${failedUploads} de ${files.length} documentos falharam ao enviar.`,
            variant: 'destructive',
          })
        }

        // Se houver falhas, podemos querer lançar um erro agregado
        if (failedUploads > 0) {
          const batchError = new Error(
            'Ocorreu um erro inesperado ao tentar enviar os documentos.',
          )
          throw batchError // Re-throw
        }
      } catch (error) {
        void console.error('Erro durante o upload em lote:', error)
        toast({
          title: 'Erro no Upload',
          description: 'Falha ao enviar os documentos.',
          variant: 'destructive',
        })
        throw error // Re-throw
      } finally {
        // Recarregar a lista de documentos após todas as tentativas de upload,
        // independentemente de sucesso ou falha, para refletir o estado atual do servidor.
        if (selectedKnowledgeBase) {
          // Verificar novamente, caso algo mude o estado
          await loadDocuments(selectedKnowledgeBase.id)
        }
        setIsUploadingDocuments(false)
      }
    },
    [selectedKnowledgeBase, toast, loadDocuments],
  )

  // Excluir um documento
  const deleteDocument = useCallback(
    async (documentId: string) => {
      if (!selectedKnowledgeBase) {
        toast({
          title: 'Erro',
          description:
            'Nenhuma base de conhecimento selecionada para excluir o documento.',
          variant: 'destructive',
        })
        return
      }
      try {
        await memoryService.deleteDocument(selectedKnowledgeBase.id, documentId)
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
        toast({
          title: 'Sucesso',
          description: 'Documento excluído com sucesso.',
        })
      } catch (error) {
        void console.error('Erro ao excluir documento:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o documento.',
          variant: 'destructive',
        })
        throw error // Re-throw
      }
    },
    [selectedKnowledgeBase, toast],
  )

  // Manipuladores para diálogos
  const handleAddDocument = useCallback(
    (knowledgeBaseId: string) => {
      const knowledgeBase = knowledgeBases.find(
        (kb) => kb.id === knowledgeBaseId,
      )
      setSelectedKnowledgeBase(knowledgeBase || null)
      setUploadDialogOpen(true)
    },
    [knowledgeBases],
  )

  return {
    // Estados
    knowledgeBases: filteredKnowledgeBases,
    documents,
    selectedKnowledgeBase,
    isLoading,
    isLoadingDocuments,
    isUploadingDocuments,
    searchTerm,
    selectedType,
    createDialogOpen,
    uploadDialogOpen,

    // Setters
    setSearchTerm,
    setSelectedType,
    setCreateDialogOpen,
    setUploadDialogOpen,

    // Ações
    loadKnowledgeBases,
    loadDocuments,
    createKnowledgeBase,
    deleteKnowledgeBase,
    uploadDocuments,
    deleteDocument,
    handleAddDocument,
    handleSelectKnowledgeBase,
  }
}
