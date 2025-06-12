export interface Secret {
  id: string
  name: string
  description: string
  value?: string // Value is optional and should not be sent back from the server
  createdAt: string
  lastUsed?: string
}
