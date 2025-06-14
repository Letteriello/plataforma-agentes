import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  ChevronDown, 
  LayoutDashboard as LayoutDashboardIcon, 
  Bot as BotIcon, 
  Clock as ClockIcon, 
  TrendingUp as TrendingUpIcon, 
  FileText as FileTextIcon,
  Menu,
  Settings,
  LogOut
} from 'lucide-react';

// Define the shape of our navigation items
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Main navigation items
const navItems: NavItem[] = [
  { 
    title: 'Visão Geral', 
    href: '/dashboard',
    icon: <LayoutDashboardIcon className="h-5 w-5" />
  },
  { 
    title: 'Meus Agentes', 
    href: '/dashboard/agents',
    icon: <BotIcon className="h-5 w-5" />
  },
  { 
    title: 'Atividades Recentes', 
    href: '/dashboard/activities',
    icon: <ClockIcon className="h-5 w-5" />
  },
  { 
    title: 'Desempenho', 
    href: '/dashboard/performance',
    icon: <TrendingUpIcon className="h-5 w-5" />
  },
  { 
    title: 'Documentação', 
    href: '/docs',
    icon: <FileTextIcon className="h-5 w-5" />,
    disabled: true
  }
];

// Bottom navigation items
const bottomNavItems: NavItem[] = [
  {
    title: 'Configurações',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />
  },
  {
    title: 'Sair',
    href: '/logout',
    icon: <LogOut className="h-5 w-5" />
  }
];

export const DashboardSidebar = ({ isOpen, onToggle }: DashboardSidebarProps) => {
  const [activeItem, setActiveItem] = useState<string>('Visão Geral');

  const handleNavigation = (title: string, href: string) => {
    setActiveItem(title);
    // Here you would typically use a router to navigate
    console.log(`Navigating to ${href}`);
  };

  return (
    <motion.div 
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 80 }}
      className={cn(
        'h-full flex flex-col border-r border-border/40 bg-background',
        'transition-all duration-300',
        isOpen ? 'px-2' : 'px-1',
        'relative',
        'z-10',
        'overflow-hidden'
      )}
    >
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="md:hidden absolute right-2 top-2 p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Alternar menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BotIcon className="h-5 w-5 text-primary" />
          </div>
          {isOpen && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Plataforma IA
            </h2>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.title;
            return (
              <button
                key={item.title}
                type="button"
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  'transition-colors duration-200'
                )}
                onClick={() => !item.disabled && handleNavigation(item.title, item.href)}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  {isOpen && <span className="text-sm font-medium">{item.title}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="p-3 border-t border-border/40 mt-auto">
        <div className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = activeItem === item.title;
            return (
              <button
                key={item.title}
                type="button"
                className={cn(
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  'transition-colors duration-200'
                )}
                onClick={() => handleNavigation(item.title, item.href)}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  {isOpen && <span className="text-sm">{item.title}</span>}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  UN
                </AvatarFallback>
              </Avatar>
              {isOpen && (
                <div className="text-left">
                  <p className="text-sm font-medium">Usuário</p>
                  <p className="text-xs text-muted-foreground">admin@exemplo.com</p>
                </div>
              )}
            </div>
            {isOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  // Handle user menu toggle
                  console.log('Toggle user menu');
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
