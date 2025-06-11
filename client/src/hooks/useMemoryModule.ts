import { useState, useEffect, useCallback } from 'react'
import { KnowledgeBase, Document, KnowledgeBaseType } from '@/api/memoryService'
import { memoryService } from '@/api/memoryService'
import { useToast } from '@/components/ui/use-toast'

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

  // Carregar bases de conhecimento
  const loadKnowledgeBases = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await memoryService.getKnowledgeBases()
      setKnowledgeBases(data)
      applyFilters(data, searchTerm, selectedType)
    } catch (error) {
      console.error('Erro ao carregar bases de conhecimento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as bases de conhecimento.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedType, toast])

  // Aplicar filtros às bases de conhecimento
  const applyFilters = useCallback(
    (
      data: KnowledgeBase[],
      search: string,
      type: KnowledgeBaseType | 'all',
    ) => {
      let filtered = [...data]

      // Filtrar por termo de pesquisa
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(
          (kb) =>
            kb.name.toLowerCase().includes(searchLower) ||
            kb.description.toLowerCase().includes(searchLower),
        )
      }

      // Filtrar por tipo
      if (type !== 'all') {
        filtered = filtered.filter((kb) => kb.type === type)
      }

      setFilteredKnowledgeBases(filtered)
    },
    [],
  )

  // Atualizar filtros quando os critérios mudarem
  useEffect(() => {
    applyFilters(knowledgeBases, searchTerm, selectedType)
  }, [knowledgeBases, searchTerm, selectedType, applyFilters])

  // Carregar bases de conhecimento na montagem do componente
  useEffect(() => {
    loadKnowledgeBases()
  }, [loadKnowledgeBases])

  // Carregar documentos de uma base de conhecimento
  const loadDocuments = useCallback(
    async (knowledgeBaseId: string) => {
      setIsLoadingDocuments(true)
      try {
        const knowledgeBase =
          knowledgeBases.find((kb) => kb.id === knowledgeBaseId) || null
        setSelectedKnowledgeBase(knowledgeBase)

        if (knowledgeBase?.type === KnowledgeBaseType.RAG) {
          const data =
            await memoryService.getDocumentsByKnowledgeBaseId(knowledgeBaseId)
          setDocuments(data)
        } else {
          setDocuments([])
        }
      } catch (error) {
        console.error('Erro ao carregar documentos:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os documentos.',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingDocuments(false)
      }
    },
    [knowledgeBases, toast],
  )

  // Criar uma nova base de conhecimento
  const createKnowledgeBase = useCallback(
    async (data: {
      name: string
      description: string
      type: KnowledgeBaseType
      baseModel?: string
    }) => {
      try {
        const newKnowledgeBase = await memoryService.createKnowledgeBase(data)
        setKnowledgeBases((prev) => [...prev, newKnowledgeBase])
        setCreateDialogOpen(false)
        toast({
          title: 'Sucesso',
          description: 'Base de conhecimento criada com sucesso.',
        })
      } catch (error) {
        console.error('Erro ao criar base de conhecimento:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível criar a base de conhecimento.',
          variant: 'destructive',
        })
      }
    },
    [toast],
  )

  // Excluir uma base de conhecimento
  const deleteKnowledgeBase = useCallback(
    async (id: string) => {
      try {
        await memoryService.deleteKnowledgeBase(id)
        setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== id))
        toast({
          title: 'Sucesso',
          description: 'Base de conhecimento excluída com sucesso.',
        })
      } catch (error) {
        console.error('Erro ao excluir base de conhecimento:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a base de conhecimento.',
          variant: 'destructive',
        })
      }
    },
    [toast],
  )

  // Fazer upload de documentos
  const uploadDocuments = useCallback(
    async (files: File[]) => {
      if (!selectedKnowledgeBase) {
        toast({
          title: 'Aviso',
          description: 'Nenhuma base de conhecimento selecionada.',
          variant: 'default',
        })
        return
      }

      setIsUploadingDocuments(true)
      let successfulUploads = 0
      let failedUploads = 0

      try {
        // Upload files em paralelo
        await Promise.all(
          files.map(async (file) => {
            try {
              // Não estamos mais adicionando o documento diretamente ao estado aqui.
              // A lista será atualizada pelo loadDocuments no finally.
              await memoryService.uploadDocument(selectedKnowledgeBase.id, file)
              successfulUploads++
            } catch (error) {
              console.error(
                `Erro ao fazer upload do arquivo ${file.name}:`,
                error,
              )
              failedUploads++
            }
          }),
        )

        if (failedUploads > 0) {
          toast({
            title: 'Erro no Upload',
            description: `${failedUploads} de ${files.length} documento(s) falharam ao enviar. Verifique o console para mais detalhes.`,
            variant: 'destructive',
          })
        }

        if (successfulUploads > 0 && failedUploads === 0) {
          toast({
            title: 'Sucesso',
            description: `${successfulUploads} documento(s) enviado(s) com sucesso.`,
          })
        } else if (successfulUploads > 0 && failedUploads > 0) {
          toast({
            title: 'Upload Parcial',
            description: `${successfulUploads} documento(s) enviado(s) com sucesso, mas ${failedUploads} falharam.`,
            variant: 'default', // ou 'warning' se tiver essa variante
          })
        }

        setUploadDialogOpen(false) // Fechar o diálogo após todas as tentativas
      } catch (batchError) {
        // Este catch é para erros inesperados no processo de batch em si,
        // não erros de upload de arquivos individuais (já tratados acima).
        console.error(
          'Erro inesperado durante o processo de upload em lote:',
          batchError,
        )
        toast({
          title: 'Erro Crítico no Upload',
          description:
            'Ocorreu um erro inesperado ao tentar enviar os documentos.',
          variant: 'destructive',
        })
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
      try {
        await memoryService.deleteDocument(documentId)
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
        toast({
          title: 'Sucesso',
          description: 'Documento excluído com sucesso.',
        })
      } catch (error) {
        console.error('Erro ao excluir documento:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o documento.',
          variant: 'destructive',
        })
      }
    },
    [toast],
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
    isUploadingDocuments, // Expor o novo estado
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
  }
}
