import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface TopbarProps {
  pageTitle?: string;
}

export function Topbar({ pageTitle }: TopbarProps) {
  const { user } = useAuthStore();

  return (
    <div className="flex h-16 items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Left section - Title */}
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">{pageTitle || 'Dashboard'}</h2>
        <Badge variant="info" size="sm" className="ml-3">
          Beta
        </Badge>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <Button variant="outline" size="icon" className="rounded-full border-slate-200 dark:border-slate-700">
          <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <Avatar className="h-8 w-8">
            <img 
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.name || 'user'}`} 
              alt={user?.name || 'User'} 
            />
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
