import { useState, FormEvent } from 'react' // Added FormEvent
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuthStore } from '@/store/authStore'
import { saveApiKey as saveApiKeyService } from '@/api/secretsService'; // Import the service

export default function ConfiguracoesPage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [serviceName, setServiceName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiKeyMessage, setApiKeyMessage] = useState('')
  const [isSavingApiKey, setIsSavingApiKey] = useState(false) // Loading state

  const handleSaveName = () => {
    if (user) setUser({ ...user, name })
  }

  const handleSaveApiKey = async (e: FormEvent) => {
    e.preventDefault()
    if (!serviceName || !apiKey) {
      setApiKeyMessage('Erro: Nome do serviço e Chave de API são obrigatórios.')
      return
    }
    setIsSavingApiKey(true)
    setApiKeyMessage('') // Clear previous messages

    try {
      await saveApiKeyService(serviceName, apiKey)
      setApiKeyMessage('Chave de API salva com sucesso!')
      setServiceName('')
      setApiKey('')
    } catch (error) {
      // Assuming error is an object with a message property
      const err = error as { message?: string };
      setApiKeyMessage(`Erro ao salvar chave de API: ${err.message || 'Erro desconhecido'}`)
      console.error(error)
    } finally {
      setIsSavingApiKey(false)
      // Hide message after a few seconds
      setTimeout(() => setApiKeyMessage(''), 5000) // Increased timeout for better UX
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-4"> {/* Increased space-y */}
      <h1 className="text-2xl font-semibold">Configurações</h1>

      <div className="space-y-4"> {/* Increased space-y */}
        <h2 className="text-xl font-medium">Geral</h2> {/* Added subheading */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={handleSaveName} className="mt-2">
            Salvar Nome
          </Button>
        </div>
      </div>

      <div className="space-y-4"> {/* Increased space-y */}
        <h2 className="text-xl font-medium">Gerenciar Chaves de API</h2>
        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Serviço
            </label>
            <Input
              id="serviceName"
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chave de API
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <Button type="submit" className="mt-2" disabled={isSavingApiKey}>
            {isSavingApiKey ? 'Salvando...' : 'Salvar Chave'}
          </Button>
        </form>
        {apiKeyMessage && <p className={`mt-2 text-sm ${apiKeyMessage.startsWith('Erro:') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{apiKeyMessage}</p>}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Nota: Após salvar, sua chave de API não será exibida novamente por motivos de segurança.
        </p>
      </div>

      <div className="space-y-4 pt-4"> {/* Increased space-y and pt */}
        <h2 className="text-xl font-medium">Aparência</h2> {/* Added subheading */}
        <div>
          <p className="mb-2 text-sm font-medium">Tema</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
