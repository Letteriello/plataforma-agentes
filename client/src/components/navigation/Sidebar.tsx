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
  Library, // Added for Biblioteca
} from 'lucide-react'
import { NavLink } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Avatar } from '@/components/ui/avatar'
import { cn, generateAvatarUrl } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
// useState removed

interface SidebarProps {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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

  { href: '/deploy', icon: <Rocket className="h-5 w-5" />, label: 'Deploy' },
]

const resourcesItems: NavItem[] = [
  {
    href: '/biblioteca',
    icon: <Library className="h-5 w-5" />,
    label: 'Biblioteca',
  },
  {
    href: '/tools',
    icon: <Wrench className="h-5 w-5" />,
    label: 'Ferramentas',
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

export const Sidebar = ({
  isCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onMouseEnter,
  onMouseLeave,
}: SidebarProps) => {
  const { user } = useAuthStore()

  const renderNavLinks = (items: NavItem[], isCollapsed: boolean) => {
    return items.map((item) => {
      const linkContent = (
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
              isCollapsed && 'justify-center',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-primary hover:text-primary-foreground',
              item.disabled && 'pointer-events-none opacity-50',
            )
          }
        >
          {item.icon}
          {!isCollapsed && <span className="ml-3">{item.label}</span>}
        </NavLink>
      );

      if (isCollapsed) {
        return (
          <TooltipProvider key={item.href} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return <div key={item.href}>{linkContent}</div>;
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-background border-r z-40 transition-all duration-300 ease-in-out flex flex-col',
          // Mobile view: controlled by isMobileMenuOpen
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop view: controlled by isCollapsed
          'md:translate-x-0',
          isCollapsed ? 'md:w-20' : 'md:w-64',
          // Base width for mobile
          'w-64'
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex h-16 items-center border-b px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6" />
            {!isCollapsed && <span className="">Nexus</span>}
          </NavLink>
        </div>

      {/* Navigation Links Area */}
      <nav className="flex-1 flex flex-col p-4">
        <div className="space-y-1">{renderNavLinks(navItems, isCollapsed)}</div>

        {/* Gerenciamento Section */}
        <div className="my-4">
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Gerenciamento
            </h2>
          )}
          <div className="space-y-1">
            {renderNavLinks(agentManagementItems, isCollapsed)}
          </div>
        </div>

        {/* Recursos Section */}
        <div className="my-4">
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Recursos
            </h2>
          )}
          <div className="space-y-1">{renderNavLinks(resourcesItems, isCollapsed)}</div>
        </div>

        {/* Governance Section */}
        <div className="my-4">
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Governança
            </h2>
          )}
          <div className="space-y-1">{renderNavLinks(governanceItems, isCollapsed)}</div>
        </div>

        {/* Orchestration Section */}
        <div className="my-4">
          {!isCollapsed && (
            <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground/80 tracking-wider uppercase">
              Orquestração
            </h2>
          )}
          <div className="space-y-1">{renderNavLinks(orchestrationItems, isCollapsed)}</div>
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
    </>
  )
}
