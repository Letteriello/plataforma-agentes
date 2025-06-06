import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; // Assuming Badge is styled according to Nexus DS
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface TopbarProps {
  pageTitle?: string;
}

export function Topbar({ pageTitle }: TopbarProps) {
  const { user } = useAuthStore();

  return (
    // Main Topbar container: h-16, px-6, bg-card, border-b border-border
    <div className="flex h-16 items-center justify-between px-6 bg-card border-b border-border">
      {/* Left section - Title */}
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-foreground">{pageTitle || 'Dashboard'}</h2>
        {/* Assuming Badge component and its variants are aligned with Nexus Design System */}
        {/* For now, keeping variant="info" and size="sm" as they were */}
        <Badge variant="info" size="sm" className="ml-3">
          Beta
        </Badge>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* Notifications Button - variant="outline" should use border-border by default from shadcn/ui config */}
        <Button variant="outline" size="icon" className="rounded-full"> 
          <Bell className="h-4 w-4 text-muted-foreground" /> {/* Changed color to text-muted-foreground */}
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* User Info Section with left border */}
        <div className="flex items-center gap-2 pl-2 border-l border-border"> {/* Changed border color */}
          <Avatar className="h-8 w-8">
            <img 
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.name || 'user'}`} 
              alt={user?.name || 'User'} 
            />
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.name || 'Admin User'}</p> {/* Changed color */}
            <p className="text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</p> {/* Changed color */}
          </div>
        </div>
      </div>
    </div>
  );
}
