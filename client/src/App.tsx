import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastProvider } from '@/components/ui/use-toast'
import { router } from '@/routes.tsx'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

import './App.css'

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="nexus-ui-theme">
        <TooltipProvider>
          <ToastProvider>
            <div className="relative flex min-h-screen flex-col">
              <RouterProvider
                router={router}
                future={{ v7_startTransition: true }}
              />
              <Toaster />
            </div>
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
