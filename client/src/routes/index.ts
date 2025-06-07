import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import AgentList from '@/pages/Agentes';
import AgentWorkspace from '@/pages/AgentWorkspace';

interface RouteObject {
  path: string;
  element: React.ReactNode;
  children?: RouteObject[];
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <AgentList />,
      },
      {
        path: '/agent/:id',
        element: <AgentWorkspace />,
      },
    ],
  },
]);

export { router };
