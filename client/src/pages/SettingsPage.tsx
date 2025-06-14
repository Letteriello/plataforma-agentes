import { useState } from 'react'

import { storeSecret } from '@/features/secrets-vault/services/secretService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuthStore } from '@/store/authStore'

export default function ConfiguracoesPage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [apiKey, setApiKey] = useState('')
  const [isSavingKey, setIsSavingKey] = useState(false)

  const handleSave = () => {
    if (user) setUser({ ...user, name })
  }

  const handleSaveKey = async () => {
    if (!apiKey) return
    setIsSavingKey(true)
    try {
      await storeSecret({ name: 'openai', value: apiKey })
      setApiKey('')
    } finally {
      setIsSavingKey(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Configura\u00e7\u00f5es</h1>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSave} className="mt-2">
          Salvar
        </Button>
      </div>

      <div className="space-y-2">
        <label htmlFor="api-key" className="text-sm font-medium">
          Chave da API
        </label>
        <Input
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Insira sua chave"
        />
        <Button onClick={handleSaveKey} disabled={isSavingKey} className="mt-2">
          {isSavingKey ? 'Salvando...' : 'Salvar Chave'}
        </Button>
      </div>

      <div className="pt-4">
        <p className="mb-2 text-sm font-medium">Tema</p>
        <ThemeToggle />
      </div>
    </div>
  )
}
