// src/components/navigation/Sidebar.tsx - Componente da barra lateral de navegação.
import {
  BarChart, // Adicionado para Dashboard ROI
  Beaker, // Adicionado para Sandbox
  Bot,
  BrainCircuit,
  ClipboardList, // Já existia, usado para Painel QA
  FlaskConical,
  History,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  Scale, // Adicionado
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  GitBranch,
  FileText, // Added FileText for Auditoria item
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Avatar } from '@/components/ui/avatar'
import { cn, generateAvatarUrl } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
// useState removed

interface SidebarProps {
  isCollapsed: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode // Keep as React.ReactNode for direct icon components
  disabled?: boolean
}

// New navigation item structures
const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Painel',
  },
  { href: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
  {
    href: '/playground',
    icon: <FlaskConical className="h-5 w-5" />,
    label: 'Playground',
  },
  {
    href: '/roi-dashboard',
    icon: <BarChart className="h-5 w-5" />,
    label: 'Dashboard ROI',
  },
]

const agentManagementItems: NavItem[] = [
  {
    href: '/agents',
    icon: <Users className="h-5 w-5" />,
    label: 'Meus Agentes',
  },
  {
    href: '/sessions',
    icon: <History className="h-5 w-5" />,
    label: 'Sessões',
  },
  { href: '/deploy', icon: <Rocket className="h-5 w-5" />, label: 'Deploy' },
]

const resourcesItems: NavItem[] = [
  {
    href: '/tools',
    icon: <Wrench className="h-5 w-5" />,
    label: 'Ferramentas',
  },
  {
    href: '/memory',
    icon: <BrainCircuit className="h-5 w-5" />,
    label: 'Memória',
  },
  {
    href: '/simulation-sandbox',
    icon: <Beaker className="h-5 w-5" />,
    label: 'Sandbox',
  },
]

const governanceItems: NavItem[] = [
  {
    href: '/governance',
    icon: <Scale className="h-5 w-5" />,
    label: 'Governança',
  },
  {
    href: '/cofre',
    icon: <ShieldCheck className="h-5 w-5" />,
    label: 'Cofre',
  },
  {
    href: '/audit-logs',
    icon: <FileText className="h-5 w-5" />,
    label: 'Auditoria',
  },
  {
    href: '/qa-panel',
    icon: <ClipboardList className="h-5 w-5" />,
    label: 'Painel QA',
  },
]

const orchestrationItems: NavItem[] = [
  {
    href: '/orchestration',
    icon: <GitBranch className="h-5 w-5" />,
    label: 'Orquestração',
  },
  {
    href: '/auditoria', // Assuming this path for Auditoria
    icon: <FileText className="h-5 w-5" />, // Added FileText icon
    label: 'Auditoria',
  },
]

// Settings item - href is used in NavLink, icon and label for display
// The existing account section links to '/configuracoes'
// const settingsItem = { href: '/configuracoes', icon: Settings, label: 'Configurações' };
// For clarity, settingsItem is not strictly needed as a variable if we adapt the existing structure directly.

export function Sidebar({
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
}: SidebarProps) {
  const { user } = useAuthStore()

  const renderNavLinks = (items: NavItem[]) =>
    items.map((item) => (
      <NavLink
        key={item.href}
        to={item.disabled ? '#' : item.href}
        className={({ isActive }) =>
          cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isCollapsed && 'justify-center',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-primary hover:text-primary-foreground',
            item.disabled && 'cursor-not-allowed opacity-50',
          )
        }
      >
        <span className={cn('shrink-0', isCollapsed ? 'mr-0' : 'mr-3')}>
          {item.icon}
        </span>
        {!isCollapsed && <span>{item.label}</span>}
      </NavLink>
    ))

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'flex h-full flex-col bg-card border-r border-border transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        {isCollapsed ? (
          <Bot className="h-6 w-6 mx-auto" /> // Show Bot icon when collapsed and centered
        ) : (
          <div className="flex items-center gap-2">
            {/* Original Logo */}
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <h1 className="text-lg font-semibold text-foreground">Nexus</h1>
          </div>
        )}
      </div>

      {/* Navigation Links Area */}
      <nav className="flex-1 flex flex-col p-4">
        <div className="space-y-1">{renderNavLinks(navItems)}</div>

        {/* Gerenciamento Section */}
        <div className="my-4">
          {!isCollapsed && (
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
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Recursos
            </h2>
          )}
          <div className="space-y-1">{renderNavLinks(resourcesItems)}</div>
        </div>

        {/* Governance Section */}
        <div className="my-4">
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Governança
            </h2>
          )}
          <div className="space-y-1">{renderNavLinks(governanceItems)}</div>
        </div>

        {/* Orchestration Section */}
        <div className="my-4">
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Orquestração
            </h2>
          )}
          <div className="space-y-1">{renderNavLinks(orchestrationItems)}</div>
        </div>

        {/* Account Section - Pushed to bottom */}
        <div className="mt-auto">
          <NavLink
            to="/settings" // Alterado de /configuracoes para /settings
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
                isCollapsed && 'justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-primary hover:text-primary-foreground',
              )
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <img
                src={generateAvatarUrl(user?.name || 'user')}
                alt={user?.name || 'Usuário'}
                className="rounded-full"
              />
            </Avatar>
            {!isCollapsed && (
              <div className="ml-3 flex-grow">
                <p className="text-sm font-semibold">
                  {user?.name || 'Usuário Admin'}
                </p>
                <p className="text-xs text-muted-foreground">Configurações</p>
              </div>
            )}
            <Settings
              className={cn(
                'h-5 w-5 shrink-0',
                !isCollapsed && 'ml-3 opacity-75',
              )}
            />
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
