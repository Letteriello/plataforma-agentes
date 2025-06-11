import React from 'react'

export const MarketplaceFilters: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-grow w-full">
        <input
          type="text"
          placeholder="Buscar por nome, autor ou tag..."
          className="input w-full"
        />
      </div>
      <div className="flex gap-4">
        <select className="select">
          <option value="all">Todos os Tipos</option>
          <option value="agent">Agentes</option>
          <option value="tool">Ferramentas</option>
        </select>
        <select className="select">
          <option value="popular">Mais Populares</option>
          <option value="recent">Mais Recentes</option>
        </select>
      </div>
    </div>
  )
}
