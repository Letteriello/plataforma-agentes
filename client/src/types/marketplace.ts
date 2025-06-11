export type MarketplaceItemType = 'agent' | 'tool'

export interface MarketplaceItem {
  id: string
  name: string
  author: string
  description: string
  type: MarketplaceItemType
  tags: string[]
  version: string
  downloads: number
}
