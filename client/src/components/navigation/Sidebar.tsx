// src/components/navigation/Sidebar.tsx - Componente da barra lateral de navegação.
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users, // Changed from Bot
  Rocket, // New
  Wrench,
  BrainCircuit, // New
  Settings,
  Menu,
  X,
  MessageCircle, // Added
  PlusSquare, // Added
  // MessageCircle, FlaskConical, FileText, Database removed
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

type NavItem = {
  label: string; // Changed from title
  href: string;
  icon: React.ReactNode; // Keep as React.ReactNode for direct icon components
  disabled?: boolean;
};

// New navigation item structures
const navItems: NavItem[] = [
  { href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Painel' },
  { href: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
  { href: '/agents/new', icon: <PlusSquare className="h-5 w-5" />, label: 'Criar Agente' },
];

const agentManagementItems: NavItem[] = [
  { href: '/agents', icon: <Users className="h-5 w-5" />, label: 'Meus Agentes' },
  { href: '/deploy', icon: <Rocket className="h-5 w-5" />, label: 'Deploy' },
];

const resourcesItems: NavItem[] = [
  { href: '/tools', icon: <Wrench className="h-5 w-5" />, label: 'Ferramentas' },
  { href: '/memory', icon: <BrainCircuit className="h-5 w-5" />, label: 'Memória' },
];

// Settings item - href is used in NavLink, icon and label for display
// The existing account section links to '/configuracoes'
// const settingsItem = { href: '/configuracoes', icon: Settings, label: 'Configurações' };
// For clarity, settingsItem is not strictly needed as a variable if we adapt the existing structure directly.

export function Sidebar() {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false)

  // Updated to use item.label instead of item.title
  const renderNavLinks = (items: NavItem[]) =>
    items.map((item) => (
      <NavLink
        key={item.href} // Using href as key is fine
        to={item.disabled ? '#' : item.href}
        className={({ isActive }) =>
          cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-primary hover:text-primary-foreground', // Changed hover:text-foreground to hover:text-primary as per new example style (though issue said keep current) - Reverting to keep current style for now.
            item.disabled && 'cursor-not-allowed opacity-50'
          )
        }
      >
        <span className="mr-3 shrink-0">{item.icon}</span>
        {!collapsed && <span>{item.label}</span>} {/* Changed item.title to item.label */}
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
      <nav className="flex-1 flex flex-col p-4"> {/* Keeping existing overall nav classes */}
        {/* Main Dashboard Link */}
        <div className="space-y-1">
          {renderNavLinks(navItems)}
        </div>

        {/* Gerenciamento Section */}
        <div className="my-4">
          {!collapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Gerenciamento
            </h2>
          )}
          <div className="space-y-1">
            {renderNavLinks(agentManagementItems)}
          </div>
        </div>

        {/* Recursos Section */}
        <div className="my-4">
          {!collapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Recursos
            </h2>
          )}
          <div className="space-y-1">
            {renderNavLinks(resourcesItems)}
          </div>
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
                {/* Using "Configurações" as per settingsItem.label for consistency */}
                <p className="text-xs text-muted-foreground">Configurações</p>
              </div>
            )}
            {/* Icon is already Settings, ensure class is consistent if needed */}
            <Settings className="h-5 w-5 ml-3 opacity-75" />
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
