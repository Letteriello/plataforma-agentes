import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Agents', href: '/agents' },
  { name: 'Templates', href: '/agents/templates' },
  { name: 'Analytics', href: '/agents/analytics' },
  { name: 'Settings', href: '/agents/settings' },
]

export function AgentsLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Agent Platform</h1>
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    location.pathname === item.href
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:bg-transparent hover:underline',
                  )}
                >
                  <Link to={item.href}>{item.name}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <Button asChild>
            <Link to="/agents/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Agent
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-6">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Agent Platform. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Button
              variant="link"
              size="sm"
              className="text-muted-foreground"
              asChild
            >
              <Link to="/privacy">Privacy</Link>
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-muted-foreground"
              asChild
            >
              <Link to="/terms">Terms</Link>
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-muted-foreground"
              asChild
            >
              <Link to="/docs">Documentation</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
