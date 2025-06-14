import { useParams } from 'react-router-dom';

import { AgentEditor } from '@/features/agents/components/AgentEditor';
import { AgentSubNav } from '@/features/agents/components/AgentSubNav'; // Added

export function EditAgentPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AgentSubNav /> {/* Added */}
      <AgentEditor mode="edit" agentId={id} isWizardMode={false} /> {/* Pass agentId if needed by AgentEditor */}
    </>
  );
}

export default EditAgentPage;
