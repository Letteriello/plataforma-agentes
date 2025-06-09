// src/components/navigation/Sidebar.tsx - Componente da barra lateral de navegação.
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Bot,
  Wrench,
  Settings,
  FlaskConical,
  FileText,
  MessageCircle,
  Menu,
  X,
  Database
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

// TODO: Consider moving this to a separate config file if it grows
const sidebarNavItems: NavItem[] = [
  {
    title: 'Painel', // Translated
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Agentes', // Translated (or kept as is, common in PT-BR tech)
    href: '/agentes',
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: 'Chat', // New Item
    href: '/chat',
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: 'Sessões', // Translated
    href: '/sessions',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Ferramentas', // Translated (or kept as is)
    href: '/ferramentas',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: 'Memória', // Novo item para o módulo de Memória
    href: '/memoria',
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: 'Experimentação', // Translated (Playground)
    href: '/playground',
    icon: <FlaskConical className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false)

  const renderNavLinks = (items: NavItem[]) =>
    items.map((item) => (
      <NavLink
        key={item.href}
        to={item.disabled ? '#' : item.href}
        className={({ isActive }) =>
          cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-primary hover:text-foreground',
            item.disabled && 'cursor-not-allowed opacity-50'
          )
        }
      >
        <span className="mr-3 shrink-0">{item.icon}</span>
        {!collapsed && <span>{item.title}</span>}
      </NavLink>
    ))

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-card border-r border-border transition-all',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <button
          className="mr-2 rounded-md p-1 hover:bg-muted sm:hidden"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          {!collapsed && (
            <h1 className="text-lg font-semibold text-foreground">Nexus</h1>
          )}
        </div>
      </div>

      {/* Navigation Links Area */}
      <nav className="flex-1 flex flex-col p-4">
        {/* Main Navigation Links */}
        <div className="space-y-1">
          {renderNavLinks(sidebarNavItems)}
        </div>

        {/* Account Section - Pushed to bottom */}
        <div className="mt-auto">
          <NavLink
            to="/configuracoes"
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary hover:text-foreground'
              )
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.name || 'user'}`}
                alt={user?.name || 'Usuário'}
                className="rounded-full"
              />
            </Avatar>
            {!collapsed && (
              <div className="ml-3 flex-grow">
                <p className="text-sm font-semibold">
                  {user?.name || 'Usuário Admin'}
                </p>
                <p className="text-xs text-muted-foreground">Minha Conta</p>
              </div>
            )}
            <Settings className="h-5 w-5 ml-3 opacity-75" />
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
