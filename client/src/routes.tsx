import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { lazy, Suspense } from 'react';

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
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoiDashboardPage = lazy(() => import('./pages/RoiDashboardPage'));
const AgentsIndexPage = lazy(() => import('./pages/agents/AgentsIndexPage'));
const NewAgentPage = lazy(() => import('./pages/agents/AgentsNewPage'));
const EditAgentPage = lazy(() => import('./pages/agents/edit/AgentsEditEntryPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolEditorPage = lazy(() => import('./pages/ToolEditorPage'));
const MemoryPage = lazy(() => import('./pages/MemoryPage'));

// Lazy load common components
const CofrePage = lazy(() => import('./pages/Cofre').then(module => ({ default: module.CofrePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DeployPage = lazy(() => import('./pages/DeployPage'));
const BibliotecaPage = lazy(() => import('./pages/BibliotecaPage'));
const OrchestrationPage = lazy(() => import('./pages/OrchestrationPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const MultiAgentPage = lazy(() => import('./pages/MultiAgentPage'));
const SimulationSandboxPage = lazy(() => import('./pages/SimulationSandboxPage'));

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
