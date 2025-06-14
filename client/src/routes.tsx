import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

import MainLayout from '@/features/layout/components/MainLayout';

// Define custom handle and AppRouteObject types
interface CustomRouteHandle {
  title: string;
}

// Base for routes that are NOT index routes (have path, can have children)
interface AppNonIndexRouteProps
  extends Omit<
    import('react-router-dom').NonIndexRouteObject,
    'handle' | 'children' | 'lazy'
  > {
  handle?: CustomRouteHandle;
  children?: AppRouteObject[]; // Recursive definition using the final union type
}

// Base for routes that ARE index routes (index: true)
interface AppIndexRouteProps
  extends Omit<import('react-router-dom').IndexRouteObject, 'handle' | 'lazy'> {
  handle?: CustomRouteHandle;
}

// Union type for all application routes
type AppRouteObject = AppNonIndexRouteProps | AppIndexRouteProps;

// Lazy load components with proper error boundaries
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

// Lazy load pages
const Dashboard = lazy(() => import('@/features/dashboard/routes/DashboardPage'));
const RoiDashboardPage = lazy(() => import('@/features/roi-dashboard/routes/RoiDashboardPage'));
const AgentsIndexPage = lazy(() => import('@/features/agents/routes/AgentsIndexPage'));
const NewAgentPage = lazy(() => import('@/features/agents/routes/AgentsNewPage'));
const EditAgentPage = lazy(() => import('@/features/agents/routes/edit/AgentsEditEntryPage'));
const ToolsPage = lazy(() => import('@/features/tools/routes/ToolsPage'));
const ToolEditorPage = lazy(() => import('@/features/tools/routes/ToolEditorPage'));
const MemoryPage = lazy(() => import('@/features/memoria/routes/MemoryPage'));

// Lazy load common components
const CofrePage = lazy(() => import('@/features/secrets-vault/routes/CofrePage').then(module => ({ default: module.CofrePage })));
const SettingsPage = lazy(() => import('@/features/common/routes/SettingsPage'));
const DeployPage = lazy(() => import('@/features/agents/routes/DeployPage'));
const BibliotecaPage = lazy(() => import('@/features/biblioteca/routes/BibliotecaPage'));
const OrchestrationPage = lazy(() => import('@/features/orchestration/routes/OrchestrationPage'));
const MarketplacePage = lazy(() => import('@/features/marketplace/routes/MarketplacePage'));
const MultiAgentPage = lazy(() => import('@/features/multi-agent/routes/MultiAgentPage'));
const SimulationSandboxPage = lazy(() => import('@/features/simulation-sandbox/routes/SimulationSandboxPage'));

const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(Dashboard),
        handle: {
          title: 'Dashboard',
        },
      },
      {
        path: 'roi-dashboard',
        element: withSuspense(RoiDashboardPage),
        handle: {
          title: 'ROI Dashboard',
        },
      },
      {
        path: 'agents',
        handle: {
          title: 'Agentes',
        },
        children: [
          {
            index: true,
            element: withSuspense(AgentsIndexPage),
            handle: {
              title: 'Listagem de Agentes',
            },
          },
          {
            path: 'new',
            element: withSuspense(NewAgentPage),
            handle: {
              title: 'Criar Novo Agente',
            },
          },
          {
            path: 'edit/:agentId/*',
            element: withSuspense(EditAgentPage),
            handle: {
              title: 'Editar Agente',
            },
          },
        ],
      },
      {
        path: 'tools',
        handle: {
          title: 'Ferramentas',
        },
        children: [
          {
            index: true,
            element: withSuspense(ToolsPage),
            handle: {
              title: 'Listagem de Ferramentas',
            },
          },
          {
            path: 'new',
            element: withSuspense(ToolEditorPage),
            handle: {
              title: 'Criar Ferramenta',
            },
          },
          {
            path: 'edit/:id',
            element: withSuspense(ToolEditorPage),
            handle: {
              title: 'Editar Ferramenta',
            },
          },
        ],
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
        path: 'memory',
        element: withSuspense(MemoryPage),
        handle: {
          title: 'Memória',
        },
      },
      {
        path: 'biblioteca',
        element: withSuspense(BibliotecaPage),
        handle: { title: 'Biblioteca' },
      },
      {
        path: 'deploy',
        element: withSuspense(DeployPage),
        handle: { title: 'Deploy' },
      },
      {
        path: 'settings',
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
];

export const router = createBrowserRouter(routes as import('react-router-dom').RouteObject[]);
