import { render, screen } from '@testing-library/react'

import { TokenUsageCard } from './TokenUsageCard'

describe('TokenUsageCard', () => {
  const mockData = [
    { date: '2025-06-10', tokens: 1000 },
    { date: '2025-06-09', tokens: 2000 },
  ]

  it('renderiza corretamente o título', () => {
    render(<TokenUsageCard data={mockData} isLoading={false} />)
    expect(screen.getByText(/Uso de Tokens/i)).toBeInTheDocument()
  })

  it('exibe spinner de loading quando isLoading=true', () => {
    render(<TokenUsageCard data={mockData} isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('exibe mensagem de erro se error for passado', () => {
    render(
      <TokenUsageCard
        data={mockData}
        isLoading={false}
        error="Erro ao carregar"
      />,
    )
    expect(screen.getByText(/Erro ao carregar/i)).toBeInTheDocument()
  })

  it('renderiza gráfico quando não está carregando nem em erro', () => {
    render(<TokenUsageCard data={mockData} isLoading={false} />)
    expect(screen.getByText(/Uso de Tokens/i)).toBeInTheDocument()
    // Não há texto direto do gráfico, mas não deve mostrar loading nem erro
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByText(/Erro ao carregar/i)).not.toBeInTheDocument()
  })
})
