import React from 'react'
import { useEffect,useState } from 'react'

import { MarketplaceFilters } from '@/features/marketplace/components/MarketplaceFilters'
import { MarketplaceItemCard } from '@/features/marketplace/components/MarketplaceItemCard'
import { MarketplaceItem } from '@/types/common'

export const MarketplacePage: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])

  // TODO: Fetch items from API
  useEffect(() => {
    // setItems(fetchedItems);
  }, [])
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Marketplace</h2>
        <p className="text-muted-foreground">
          Descubra e adicione agentes e ferramentas pré-construídos ao seu
          ambiente.
        </p>
      </div>

      <MarketplaceFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MarketplaceItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default MarketplacePage
