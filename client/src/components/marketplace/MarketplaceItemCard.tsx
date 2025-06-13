import React from 'react'

import { MarketplaceItem, MarketplaceItemType } from '@/types/marketplace'

const getTypeBadge = (type: MarketplaceItemType) => {
  const styles = {
    agent: 'bg-blue-100 text-blue-800',
    tool: 'bg-purple-100 text-purple-800',
  }
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[type]}`}
    >
      {type}
    </span>
  )
}

export const MarketplaceItemCard: React.FC<{ item: MarketplaceItem }> = ({
  item,
}) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg">{item.name}</h4>
        {getTypeBadge(item.type)}
      </div>
      <p className="text-sm text-muted-foreground">por {item.author}</p>
      <p className="text-sm my-2 flex-grow">{item.description}</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
        <span>v{item.version}</span>
        <span>{item.downloads.toLocaleString()} downloads</span>
      </div>
      <button className="btn btn-primary w-full mt-4">
        Adicionar ao Projeto
      </button>
    </div>
  )
}
