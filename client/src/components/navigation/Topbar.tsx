import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Topbar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-full items-center justify-between px-6">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquisar agentes, ferramentas..."
          className="w-full rounded-full bg-background pl-10 focus-visible:ring-1"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <a href="/configuracoes">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </a>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sair</span>
        </Button>
      </div>
    </div>
  );
}
