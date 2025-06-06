import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToastProvider } from '@/components/ui/use-toast';
import { router } from '@/routes';

import './App.css';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nexus-ui-theme">
      <TooltipProvider>
        <ToastProvider>
          <div className="relative flex min-h-screen flex-col">
            <RouterProvider router={router} />
            <Toaster />
          </div>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
