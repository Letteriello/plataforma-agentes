// src/components/navigation/Sidebar.tsx - Componente da barra lateral de navegação.
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bot,
  Wrench,
  Settings,
  FlaskConical,
  FileText,
  MessageCircle, // Added for Chat icon
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar'; // Added for User Avatar
import { useAuthStore } from '@/store/authStore'; // Added for user data

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
    title: 'Experimentação', // Translated (Playground)
    href: '/playground',
    icon: <FlaskConical className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const { user } = useAuthStore(); // Get user data

  const renderNavLinks = (items: NavItem[]) => {
    return items.map((item) => (
      <NavLink
        key={item.href}
        to={item.disabled ? '#' : item.href}
        className={({ isActive }) =>
          cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mb-1',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-primary hover:text-foreground', // Updated hover state
            item.disabled && 'cursor-not-allowed opacity-50'
          )
        }
      >
        <span className="mr-3">{item.icon}</span>
        <span>{item.title}</span>
      </NavLink>
    ));
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Nexus</h1>
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
                alt={user?.name || 'Usuário'} // Translated alt text
                className="rounded-full"
              />
            </Avatar>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-semibold">
                {user?.name || 'Usuário Admin'} {/* Translated default name */}
              </p>
              <p className="text-xs text-muted-foreground">Minha Conta</p> {/* Label */} 
            </div>
            <Settings className="h-5 w-5 ml-3 opacity-75" />
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
