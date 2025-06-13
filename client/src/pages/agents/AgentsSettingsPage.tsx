import { AgentSubNav } from '@/components/agents/AgentSubNav'; // Added
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AgentSettingsPage() {
  return (
    <>
      <AgentSubNav /> {/* Added */}
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">Configura\u00e7\u00f5es</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="apiKey">
            API Key
          </label>
          <Input id="apiKey" placeholder="Chave" />
        </div>
        <Button>Salvar</Button>
      </div>
    </>
  );
}
