import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Bot, Wrench, Upload, Settings, FlaskConical, FileText } from 'lucide-react';

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
    title: 'Agents',
    href: '/agentes',
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: 'Sessions',
    href: '/sessions',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Tools',
    href: '/ferramentas',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: 'Playground',
    href: '/playground',
    icon: <FlaskConical className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/configuracoes',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-lg font-semibold">AgentSmith</h1>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 p-3">
        {sidebarNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.disabled ? '#' : item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              pathname === item.href
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                : 'text-slate-600 dark:text-slate-400',
              item.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
