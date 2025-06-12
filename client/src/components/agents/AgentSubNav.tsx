// client/src/components/agents/AgentSubNav.tsx
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const agentNavigationItems = [
  { name: 'Meus Agentes', href: '/agents' }, // Updated to match Sidebar
  { name: 'Templates', href: '/agents/templates' },
  { name: 'Analytics', href: '/agents/analytics' },
  { name: 'Configurações', href: '/agents/settings' }, // Updated to match Sidebar
];

export const AgentSubNav = () => {
  const location = useLocation();

  return (
    <nav className="mb-6 pb-2 border-b border-border/40">
      <div className="flex items-center space-x-1">
        {agentNavigationItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/agents') // More robust active check
                ? 'text-primary bg-accent hover:bg-accent/80'
                : 'text-muted-foreground hover:bg-transparent hover:underline',
            )}
          >
            <Link to={item.href}>{item.name}</Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};
