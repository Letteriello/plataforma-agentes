import { useState, useEffect } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Topbar } from '@/components/navigation/Topbar'
import { cn } from '@/lib/utils'
import { useAgentStore } from '@/store/agentStore'

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const matches = useMatches()
  const routeWithTitle = [...matches]
    .reverse()
    .find((match) => typeof (match.handle as any)?.title === 'string')
  const dynamicTitle = routeWithTitle
    ? (routeWithTitle.handle as any).title
    : undefined

  // State for the selected agent ID.
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  // Get agents and fetch action from the agent store.
  const { agents, fetchAgents } = useAgentStore()

  // Fetch agents when the component mounts.
  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  // Map agents from the store to the format required by the Topbar selector.
  const agentsForSelector = agents.map((agent) => ({
    id: agent.id,
    title: agent.name,
  }))

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out h-full overflow-hidden',
          isSidebarCollapsed ? 'pl-20' : 'pl-64',
        )}
      >
        <Topbar
          pageTitle={dynamicTitle}
          agentsForSelector={agentsForSelector}
          selectedAgentIdForSelector={selectedAgentId}
          onSelectAgentForSelector={setSelectedAgentId}
        />
        {/* Outlet Panel - Now occupies all space below the Topbar */}
        <div className="flex-1 h-full overflow-y-auto bg-muted/20 dark:bg-muted/10">
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
