import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom'
import MainLayout from '@/components/layouts/MainLayout'
import { lazy, Suspense } from 'react'

// Define custom handle and AppRouteObject types
interface CustomRouteHandle {
  title: string
  // Add other potential properties if observed or anticipated
}

// Define custom handle and AppRouteObject types
interface CustomRouteHandle {
  title: string;
  // Add other potential properties if observed or anticipated
}

// Base for routes that are NOT index routes (have path, can have children)
interface AppNonIndexRouteProps extends Omit<import('react-router-dom').NonIndexRouteObject, 'handle' | 'children' | 'lazy'> {
  handle?: CustomRouteHandle;
  children?: AppRouteObject[]; // Recursive definition using the final union type
  // We are using React.lazy with element, so route.lazy is not used here.
}

// Base for routes that ARE index routes (index: true)
interface AppIndexRouteProps extends Omit<import('react-router-dom').IndexRouteObject, 'handle' | 'lazy'> {
  handle?: CustomRouteHandle;
  // We are using React.lazy with element, so route.lazy is not used here.
  // Element is part of IndexRouteObject, ensure it's used with withSuspense
}

// Union type for all application routes
type AppRouteObject = AppNonIndexRouteProps | AppIndexRouteProps;


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
const AgentsIndexPage = lazy(() => import('@/pages/agents/AgentsIndexPage'));
const NewAgentPage = lazy(() => import('@/pages/agents/AgentsNewPage'));
const EditAgentPage = lazy(() => import('@/pages/agents/edit/AgentsEditEntryPage'));



const Deploy = lazy(() => import('./pages/DeployPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const BibliotecaPage = lazy(() => import('./pages/BibliotecaPage'))
const CofrePage = lazy(() =>
  import('./pages/Cofre').then((module) => ({ default: module.CofrePage }))
)
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'))

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
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage')) 
const QAPanelPage = lazy(() => import('./pages/QAPanelPage'))
const RoiDashboardPage = lazy(() => import('./pages/RoiDashboardPage'))
const SimulationSandboxPage = lazy(
  () => import('./pages/SimulationSandboxPage'),
)
const MultiAgentPage = lazy(() => import('./pages/MultiAgentPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const OrchestrationPage = lazy(() => import('./pages/OrchestrationPage'))
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
        path: 'playground',
        element: withSuspense(PlaygroundPage),
        handle: { title: 'Playground' },
      },
      {
        path: 'agents',
        element: withSuspense(AgentsIndexPage),
        handle: { title: 'Agentes' },
      },
      {
        path: 'agents/new',
        element: withSuspense(NewAgentPage),
        handle: { title: 'Novo Agente' },
      },
      {
        path: 'agents/:id/edit',
        element: withSuspense(EditAgentPage),
        handle: { title: 'Editar Agente' },
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
        handle: { title: 'Logs de Auditoria' },
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
        path: 'orchestration',
        element: withSuspense(OrchestrationPage),
        handle: { title: 'Orchestration' },
      },
      {
        path: 'biblioteca',
        element: withSuspense(BibliotecaPage),
        handle: { title: 'Biblioteca' },
        children: [
          {
            index: true,
            element: <Navigate to="ferramentas" replace />,
          },
          {
            path: 'ferramentas',
            element: withSuspense(BibliotecaPage),
            handle: { title: 'Ferramentas' },
          },
          {
            path: 'memoria',
            element: withSuspense(BibliotecaPage),
            handle: { title: 'Memória' },
          },
        ],
      },
      {
        path: 'deploy',
        element: withSuspense(Deploy),
        handle: { title: 'Deploy' },
      },
      {
        path: 'settings', // path changed from 'configuracoes'
        element: withSuspense(SettingsPage),
        handle: { title: 'Configurações' },
      },
      {
        path: 'cofre',
        element: withSuspense(CofrePage),
        handle: { title: 'Cofre' },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

export const router = createBrowserRouter(routes as import('react-router-dom').RouteObject[]);
