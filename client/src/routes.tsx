import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';

export const router = createBrowserRouter([
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
        lazy: async () => { const { default: Component } = await import('@/pages/Dashboard'); return { Component }; },
        handle: { title: 'Dashboard' },
      },
      {
        path: 'agentes',
        lazy: async () => { const { default: Component } = await import('@/pages/Agentes'); return { Component }; },
        handle: { title: 'Agentes' },
      },
      {
        path: 'ferramentas',
        lazy: async () => { const { default: Component } = await import('@/pages/Ferramentas'); return { Component }; },
        handle: { title: 'Ferramentas' },
      },
      {
        path: 'deploy',
        lazy: async () => { const { default: Component } = await import('@/pages/Deploy'); return { Component }; },
        handle: { title: 'Deploy' },
      },
      {
        path: 'configuracoes',
        lazy: async () => { const { default: Component } = await import('@/pages/Configuracoes'); return { Component }; },
        handle: { title: 'Configurações' },
      },
      {
        path: 'chat',
        lazy: async () => {
          console.log('Loading ChatPage module...');
          try {
            // Usando import() com caminho relativo para evitar problemas com aliases
            const module = await import('./pages/ChatPage');
            console.log('ChatPage module loaded successfully');
            return { Component: module.default };
          } catch (error) {
            console.error('Error loading ChatPage module:', error);
            // Retornar um componente de erro ou redirecionar para uma rota de erro
            return {
              Component: () => <div>Erro ao carregar a página de chat. Por favor, tente novamente mais tarde.</div>
            };
          }
        },
        handle: { title: 'Chat' },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
