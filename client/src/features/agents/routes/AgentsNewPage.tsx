import { AgentEditor } from '../../components/agents/AgentEditor';
import { AgentSubNav } from '../../components/agents/AgentSubNav'; // Added

export function NewAgentPage() {
  return (
    <>
      <AgentSubNav /> {/* Added */}
      <AgentEditor mode="create" isWizardMode={true} />
    </>
  );
}

export default NewAgentPage;
