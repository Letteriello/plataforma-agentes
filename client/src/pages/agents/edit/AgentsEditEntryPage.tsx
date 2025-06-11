import { useParams } from 'react-router-dom';
import { AgentEditor } from '@/components/agents/AgentEditor';
import { AgentSubNav } from '@/components/agents/AgentSubNav'; // Added

export function EditAgentPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AgentSubNav /> {/* Added */}
      <AgentEditor mode="edit" agentId={id} /> {/* Pass agentId if needed by AgentEditor */}
    </>
  );
}

export default EditAgentPage;
