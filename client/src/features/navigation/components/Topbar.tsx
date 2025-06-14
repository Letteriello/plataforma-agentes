import { Bell, HelpCircle, LogOut,Menu, PlusCircle, Search, Settings, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Added Link and useNavigate

import { CreateAgentDialog } from '@/features/agents/components/CreateAgentDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added Avatar components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator, // Corrected to DropdownMenuSeparator if that's the intended component
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Added DropdownMenu components
import { Input } from '@/components/ui/input'; // Added Input
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { generateAvatarUrl } from '@/lib/utils'; // Added generateAvatarUrl
import { useAuthStore } from '@/store'; // Updated path

interface TopbarProps {
  pageTitle?: string;
  onMenuClick: () => void;
}

export function Topbar({ pageTitle, onMenuClick }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Or your desired logout destination
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Left section - Title & Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>

        <h2 className="text-lg font-medium text-foreground hidden sm:block">
          {pageTitle || 'Painel'}
        </h2>
        <Badge variant="info" size="sm" className="ml-3">
          Beta
        </Badge>
      </div>

      {/* Right section - User Actions */}
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        {/* Search Input - Added from DashboardHeader */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="w-48 sm:w-64 pl-9 h-9 bg-background/80 focus-visible:ring-offset-0 focus-visible:ring-0"
            // onChange={handleSearch} // TODO: Implement search handler
          />
        </div>

        {/* NEW "Criar Agente" Button */}
        <CreateAgentDialog>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Criar Agente
            </span>
          </Button>
        </CreateAgentDialog>

        {/* Existing ThemeToggle and Bell Button */}
        <ThemeToggle />
        {/* Updated Bell Button from DashboardHeader */}
        <Button variant="ghost" size="icon" className="rounded-full shrink-0 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          <span className="sr-only">Notificações</span>
        </Button>

        {/* User Dropdown Menu - Added from DashboardHeader */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user ? generateAvatarUrl(user.name) : undefined} alt={user?.name || 'User'} />
                <AvatarFallback>
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/perfil">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracoes">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ajuda">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ajuda</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
