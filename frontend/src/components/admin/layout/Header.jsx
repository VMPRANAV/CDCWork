import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from "@/components/theme-switcher";


export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0f172a]/95 dark:text-zinc-100">
      <div className="relative w-full max-w-md">
        <Search className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2 dark:text-zinc-400" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 bg-white text-gray-900 dark:bg-[#111c32] dark:text-zinc-100 dark:placeholder:text-zinc-500 border border-transparent focus:border-primary/40"
        />
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
