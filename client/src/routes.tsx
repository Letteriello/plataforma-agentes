import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import PrivateRoute from '@/components/auth/PrivateRoute'; // Import PrivateRoute
import { lazy, Suspense } from 'react';

// Lazy load components with proper error boundaries
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Component />
    </Suspense>
  );
};

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage')); // Import AdminPanelPage
import AgentesMinimoContent from '@/pages/Agentes'; // Importação direta
// const Agentes = lazy(() => import('@/pages/Agentes')); // Comentado
const LoginPage = lazy(() => import('./pages/LoginPage')); // Import LoginPage
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage')); // Import UnauthorizedPage
const Ferramentas = lazy(() => import('./pages/Ferramentas'));
const Memoria = lazy(() => import('./pages/Memoria'));
const Deploy = lazy(() => import('./pages/Deploy'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

// Error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in route component:', error);
    return <div>Ocorreu um erro ao carregar esta página. Por favor, tente novamente.</div>;
  }
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        // This Navigate should also be implicitly protected by the parent PrivateRoute
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Suspense fallback={<div>Carregando...</div>}><Dashboard /></Suspense>,
        handle: { title: 'Dashboard' },
      },
      {
        path: 'agentes',
        element: <AgentesMinimoContent />, // Not lazy loaded, no Suspense needed here
        handle: { title: 'Agentes' },
      },
      {
        path: 'ferramentas',
        element: <Suspense fallback={<div>Carregando...</div>}><Ferramentas /></Suspense>,
        handle: { title: 'Ferramentas' },
      },
      {
        path: 'memoria',
        element: <Suspense fallback={<div>Carregando...</div>}><Memoria /></Suspense>,
        handle: { title: 'Memória' },
      },
      {
        path: 'deploy',
        element: <Suspense fallback={<div>Carregando...</div>}><Deploy /></Suspense>,
        handle: { title: 'Deploy' },
      },
      {
        path: 'configuracoes',
        element: <Suspense fallback={<div>Carregando...</div>}><Configuracoes /></Suspense>,
        handle: { title: 'Configurações' },
      },
      {
        path: 'chat',
        element: <Suspense fallback={<div>Carregando...</div>}><ChatPage /></Suspense>,
        handle: { title: 'Chat' },
      },
      {
        path: 'agent/:id',
        lazy: () => import('@/pages/AgentWorkspace').then(module => ({
          // The Suspense for the lazy loaded component itself is handled by react-router's lazy.
          // The inner Suspense is for any further async operations within AgentWorkspace if needed,
          // or just to be consistent.
          Component: () => <Suspense fallback={<div>Carregando Workspace...</div>}><module.default /></Suspense>
        })),
        handle: { title: 'Workspace do Agente' },
      },
      {
        path: 'admin-panel',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <Suspense fallback={<div>Carregando Painel Admin...</div>}>
              <AdminPanelPage />
            </Suspense>
          </PrivateRoute>
        ),
        handle: { title: 'Painel Admin' },
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        {/* LoginPage is public, so no PrivateRoute. It's lazy loaded, so Suspense is good. */}
        <Suspense fallback={<div>Carregando...</div>}>
          <LoginPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<div>Carregando...</div>}>
          <UnauthorizedPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
]);
