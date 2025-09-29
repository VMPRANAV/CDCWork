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


export function Header({ sidebarOpen = true, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0f172a]/95 dark:text-zinc-100">
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
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100">
          <Bell className="w-5 h-5" />
          <span className="absolute w-2 h-2 bg-red-500 rounded-full top-2 right-2" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-8 h-8 rounded-full text-gray-600 hover:text-gray-900 dark:text-zinc-200 dark:hover:text-zinc-100">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
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
