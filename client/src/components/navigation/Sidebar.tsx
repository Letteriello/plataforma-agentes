import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Bot, Wrench, Upload, Settings } from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

const sidebarNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Agentes',
    href: '/agentes',
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: 'Ferramentas',
    href: '/ferramentas',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: 'Deploy',
    href: '/deploy',
    icon: <Upload className="h-5 w-5" />,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-bold">Nexus Platform</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-2">
        {sidebarNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.disabled ? '#' : item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              pathname === item.href
                ? 'bg-accent text-accent-forefont'
                : 'text-muted-foreground',
              item.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-border p-4">
        <div className="rounded-md bg-accent p-3 text-sm">
          <p className="font-medium">Precisa de ajuda?</p>
          <p className="text-muted-foreground text-xs">Consulte nossa documentação ou entre em contato com o suporte.</p>
        </div>
      </div>
    </div>
  );
}
