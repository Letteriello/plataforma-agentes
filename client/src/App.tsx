import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster, ToastProvider } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/authStore';
import { router } from '@/routes';

import './App.css';

export function App() {
  const { initialize } = useAuthStore();

  // Inicializar o estado de autenticação ao carregar o aplicativo
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="system" storageKey="nexus-ui-theme">
        <TooltipProvider>
          <div className="relative flex min-h-screen flex-col">
            <RouterProvider router={router} />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
