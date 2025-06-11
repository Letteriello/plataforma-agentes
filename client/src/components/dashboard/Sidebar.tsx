import { motion } from 'framer-motion';
import { LayoutDashboard, Bot, Cpu, BarChart2, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Sidebar({ isOpen, onToggle, user = { name: 'Usuário', email: 'admin@exemplo.com' } }: SidebarProps) {
  return (
    <motion.div 
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 80 }}
      className="h-full bg-card border-r border-border/40 flex flex-col transition-all duration-300 ease-in-out"
    >
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          {isOpen && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Plataforma IA
            </h2>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {[
          { name: 'Dashboard', icon: LayoutDashboard, active: true },
          { name: 'Agentes', icon: Bot },
          { name: 'Conexões', icon: Cpu },
          { name: 'Análises', icon: BarChart2 },
          { name: 'Relatórios', icon: FileText },
        ].map((item) => (
          <button
            key={item.name}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              item.active 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-3">{item.name}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-3 border-t border-border/40">
        <div className="flex items-center p-2 rounded-lg bg-muted/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="ml-2 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto"
            onClick={onToggle}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
