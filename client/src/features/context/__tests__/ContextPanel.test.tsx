import { render, screen } from '@testing-library/react'
import { ContextPanel } from '../components/ContextPanel'
import type { ContextPanelData } from '../types'

describe('ContextPanel', () => {
  const sampleData: ContextPanelData = {
    id: '1',
    title: 'Sample',
    description: 'desc',
    imageUrl: 'img.png',
    status: { text: 'active', label: 'Status' },
    properties: [
      { label: 'Prop', value: 'Value' },
    ],
  }

  it('renders message when no data', () => {
    render(<ContextPanel data={null} />)
    expect(screen.getByText('Nenhum item selecionado para exibir detalhes.')).toBeInTheDocument()
  })

  it('renders information when data is provided', () => {
    render(<ContextPanel data={sampleData} />)
    expect(screen.getByText('Sample')).toBeInTheDocument()
    expect(screen.getByText('desc')).toBeInTheDocument()
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })
})
