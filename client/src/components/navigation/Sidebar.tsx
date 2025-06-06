// src/components/navigation/Sidebar.tsx - Componente da barra lateral de navegação.
import { NavLink } from 'react-router-dom'; // useLocation removed as isActive is used from NavLink props
import { cn } from '@/lib/utils';
import { LayoutDashboard, Bot, Wrench, Settings, FlaskConical, FileText } from 'lucide-react'; // BarChart removed as example disabled item was commented out

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

// TODO: Consider moving this to a separate config file if it grows
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
  // Example of a disabled item
  // {
  //   title: 'Analytics (Soon)',
  //   href: '/analytics',
  //   icon: <BarChart className="h-5 w-5" />,
  //   disabled: true,
  // },
];

const settingsNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/configuracoes',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  // const { pathname } = useLocation(); // No longer needed if using NavLink's isActive prop

  const renderNavLinks = (items: NavItem[]) => {
    return items.map((item) => (
      <NavLink
        key={item.href}
        to={item.disabled ? '#' : item.href}
        className={({ isActive }) => // Updated to use isActive from NavLink
          cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mb-1', // Added mb-1 for spacing
            isActive
              ? 'bg-primary text-primary-foreground' // Active state
              : 'text-foreground hover:bg-zinc-800 hover:text-foreground', // Normal and hover state
            item.disabled && 'cursor-not-allowed opacity-50' // Disabled state
          )
        }
      >
        <span className="mr-3">{item.icon}</span>
        <span>{item.title}</span>
      </NavLink>
    ));
  };

  return (
    // Main sidebar container: bg-card, p-4 (applied to children containers), border-r
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-border px-4"> {/* Changed px-6 to px-4 */}
        <div className="flex items-center gap-2"> {/* Consider replacing with a proper Logo component */}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"> {/* Changed bg-blue-500 to bg-primary */}
            <span className="text-primary-foreground font-bold text-sm">N</span> {/* Changed text-white to text-primary-foreground, A to N for Nexus */}
          </div>
          <h1 className="text-lg font-semibold text-foreground">Nexus</h1> {/* Changed AgentSmith to Nexus, ensured text-foreground */}
        </div>
      </div>
      
      {/* Navigation Links Area */}
      <nav className="flex-1 flex flex-col justify-between p-4 space-y-0"> {/* Changed p-3 to p-4, removed space-y-1, added flex-col and justify-between */}
        <div> {/* Main navigation items */}
          {renderNavLinks(sidebarNavItems)}
        </div>
        <div> {/* Settings and other bottom items */}
          {renderNavLinks(settingsNavItems)}
        </div>
      </nav>
    </div>
  );
}
