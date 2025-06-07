import React from 'react';
import AgentList from '@/components/agents/AgentList'; // Assuming '@/' is configured for src path
import AgentWorkspace from '@/components/agents/AgentWorkspace';
// Assuming shadcn/ui components are available.
// If not, these imports would need to be adjusted or components created.
// For now, let's use placeholder divs if Card is not found by the linter.
// import { Card } from '@/components/ui/card'; // Example import for shadcn/ui Card

const AgentesPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      {/* Left Column: AgentList */}
      <div style={{ flex: '0 0 300px', marginRight: '20px' }}>
        {/* Replace div with <Card className="h-full"> once shadcn is confirmed */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', height: '100%', padding: '16px' }}>
          <AgentList
          agents={[]}
          title="Agentes Disponíveis"
        />
        </div>
      </div>

      {/* Right Column: AgentWorkspace */}
      <div style={{ flex: '1' }}>
        {/* Replace div with <Card className="h-full"> once shadcn is confirmed */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', height: '100%', padding: '16px' }}>
          <AgentWorkspace />
        </div>
      </div>
    </div>
  );
};

export default AgentesPage;
