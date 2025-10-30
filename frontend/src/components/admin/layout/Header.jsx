import { Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useEffect, useState } from 'react';

export function Header({ sidebarOpen = true, onToggleSidebar }) {
  // Trigger re-renders when the user object in localStorage updates
  const [userVersion, setUserVersion] = useState(0);
  useEffect(() => {
    const handler = () => setUserVersion(Date.now());
    window.addEventListener('user-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('user-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Read user info from localStorage (set during login)
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  // Try common image fields; fallback to empty string
  const imageUrl =
    storedUser.profileImage ||
    storedUser.avatar ||
    storedUser.avatarUrl ||
    storedUser.image ||
    storedUser.imageUrl ||
    storedUser.photo ||
    storedUser.photoUrl ||
    storedUser.profilePic ||
    '';

  const avatarSrc = imageUrl || "/avatars/admin.png";

  // Compute initials for fallback (FN LN | name | email)
  const firstInitial = (storedUser.firstName?.[0] || storedUser.name?.split(' ')?.[0]?.[0] || storedUser.collegeEmail?.[0] || 'U').toUpperCase();
  const secondInitial = (storedUser.lastName?.[0] || storedUser.name?.split(' ')?.[1]?.[0] || '').toUpperCase();
  const initials = `${firstInitial}${secondInitial}`.trim();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0f172a]/95 dark:text-zinc-100 sm:h-16 sm:px-6">
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        )}
        <span className="text-base font-semibold sm:text-lg">Admin Panel</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100">
          <Bell className="w-5 h-5" />
          <span className="absolute w-2 h-2 bg-red-500 rounded-full top-2 right-2" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-8 h-8 rounded-full text-gray-600 hover:text-gray-900 dark:text-zinc-200 dark:hover:text-zinc-100">
              <Avatar className="w-8 h-8">
                <AvatarImage src={avatarSrc} alt={storedUser.firstName || storedUser.name || 'User'} />
                <AvatarFallback>{initials || 'AD'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-57" align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
