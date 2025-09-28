import { Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function StudentHeader({ sidebarOpen = true, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur dark:border-white/10 dark:bg-[#0f172a]/95 dark:text-zinc-100">
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
        <span className="text-lg font-semibold">Student Portal</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full text-gray-600 hover:text-gray-900 dark:text-zinc-200 dark:hover:text-zinc-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/student.png" alt="Student" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
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

export default StudentHeader;
