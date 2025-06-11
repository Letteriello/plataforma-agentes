import {
  createBrowserRouter,
  Navigate,
  RouteObject as DefaultRouteObject,
} from 'react-router-dom'
import MainLayout from '@/components/layouts/MainLayout'
import { lazy, Suspense } from 'react'

// Define custom handle and AppRouteObject types
interface CustomRouteHandle {
  title: string
  // Add other potential properties if observed or anticipated
}

interface AppRouteObject
  extends Omit<DefaultRouteObject, 'handle' | 'children'> {
  handle?: CustomRouteHandle
  children?: AppRouteObject[]
  lazy?: () => Promise<{ Component: React.ComponentType }> // Ensure lazy is correctly typed
}

// Lazy load components with proper error boundaries
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  )
}

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AgentsPage = lazy(() => import('@/pages/agents/AgentsIndexPage')) // Updated path
const ToolsPage = lazy(() => import('./pages/ToolsPage'))
const MemoryPage = lazy(() => import('./pages/MemoryPage'))
const Deploy = lazy(() => import('./pages/DeployPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ChatPage = lazy(() => import('./pages/ChatPage')) // Stays the same
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'))
const SessionsPage = lazy(() => import('./pages/SessionsPage'))
const AgentTemplatesPage = lazy(
  () => import('./pages/agents/AgentsTemplatesPage'),
)
const AgentAnalyticsPage = lazy(
  () => import('./pages/agents/AgentsAnalyticsPage'),
)
const AgentSettingsPage = lazy(
  () => import('./pages/agents/AgentsSettingsPage'),
)
const GovernancePage = lazy(() => import('./pages/GovernancePage'))
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'))
const SecretsVaultPage = lazy(() => import('./pages/SecretsVaultPage'))
const QAPanelPage = lazy(() => import('./pages/QAPanelPage'))
const RoiDashboardPage = lazy(() => import('./pages/RoiDashboardPage'))
const SimulationSandboxPage = lazy(
  () => import('./pages/SimulationSandboxPage'),
)
const MultiAgentPage = lazy(() => import('./pages/MultiAgentPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
// Note: The dynamic route for agent editing client/src/pages/agents/edit/AgentsEditEntryPage.tsx
// is not explicitly imported here. It's likely handled by the routing setup if it's a nested route
// or needs to be added if it's a top-level route. This script assumes current explicit imports only.

// Error boundary component
// Ensure ErrorBoundary is defined before its usage or imported if defined elsewhere.
// For now, assuming it's correctly defined here or imported.
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>
  } catch (error) {
    console.error('Error in route component:', error)
    return (
      <div>
        Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
      </div>
    )
  }
}

const routes: AppRouteObject[] = [
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(Dashboard),
        handle: { title: 'Dashboard' },
      },
      {
        path: 'chat',
        element: withSuspense(ChatPage),
        handle: { title: 'Chat' },
      },
      {
        path: 'playground',
        element: withSuspense(PlaygroundPage),
        handle: { title: 'Playground' },
      },
      {
        path: 'sessions',
        element: withSuspense(SessionsPage),
        handle: { title: 'Sessions' },
      },
      {
        path: 'agents', // path changed from 'agentes'
        element: withSuspense(AgentsPage),
        handle: { title: 'Agents' }, // title changed
      },
      {
        path: 'agents/templates',
        element: withSuspense(AgentTemplatesPage),
        handle: { title: 'Agent Templates' },
      },
      {
        path: 'agents/analytics',
        element: withSuspense(AgentAnalyticsPage),
        handle: { title: 'Agent Analytics' },
      },
      {
        path: 'agents/settings',
        element: withSuspense(AgentSettingsPage),
        handle: { title: 'Agent Settings' },
      },
      {
        path: 'governance',
        element: withSuspense(GovernancePage),
        handle: { title: 'Governance' },
      },
      {
        path: 'audit-logs',
        element: withSuspense(AuditLogsPage),
        handle: { title: 'Audit Logs' },
      },
      {
        path: 'secrets-vault',
        element: withSuspense(SecretsVaultPage),
        handle: { title: 'Secrets Vault' },
      },
      {
        path: 'qa-panel',
        element: withSuspense(QAPanelPage),
        handle: { title: 'QA Panel' },
      },
      {
        path: 'roi-dashboard',
        element: withSuspense(RoiDashboardPage),
        handle: { title: 'ROI Dashboard' },
      },
      {
        path: 'simulation-sandbox',
        element: withSuspense(SimulationSandboxPage),
        handle: { title: 'Simulation Sandbox' },
      },
      {
        path: 'multi-agent',
        element: withSuspense(MultiAgentPage),
        handle: { title: 'Multi-Agent Orchestration' },
      },
      {
        path: 'marketplace',
        element: withSuspense(MarketplacePage),
        handle: { title: 'Marketplace' },
      },
      {
        path: 'tools', // path changed from 'ferramentas'
        element: withSuspense(ToolsPage),
        handle: { title: 'Tools' }, // title changed
      },
      {
        path: 'memory', // path changed from 'memoria'
        element: withSuspense(MemoryPage),
        handle: { title: 'Memory' }, // title changed
      },
      {
        path: 'deploy',
        element: withSuspense(Deploy),
        handle: { title: 'Deploy' },
      },
      {
        path: 'settings', // path changed from 'configuracoes'
        element: withSuspense(SettingsPage),
        handle: { title: 'Settings' }, // title changed
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

export const router = createBrowserRouter(routes)
