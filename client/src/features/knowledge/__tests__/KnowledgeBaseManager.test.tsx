import { render, screen } from '@testing-library/react'
import KnowledgeBaseManager from '../components/KnowledgeBaseManager'

describe('KnowledgeBaseManager', () => {
  it('renders placeholders', () => {
    render(<KnowledgeBaseManager />)
    expect(screen.getByText('Gerenciador de Base de Conhecimento (RAG)')).toBeInTheDocument()
    expect(screen.getByText(/Fazer Upload de Novos Arquivos/i)).toBeInTheDocument()
    expect(screen.getByText(/Fontes de Conhecimento Indexadas/i)).toBeInTheDocument()
  })
})
