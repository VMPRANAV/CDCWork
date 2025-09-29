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
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function StudentHeader({ sidebarOpen = true, onToggleSidebar }) {
  const navigate = useNavigate();
  // Re-render when user info updates in localStorage
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
  // Read user from localStorage
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();
  
  // Determine image URL and initials
  const imageUrl = storedUser.photoUrl
    || storedUser.profileImage
    || storedUser.avatar
    || storedUser.avatarUrl
    || storedUser.image
    || storedUser.imageUrl
    || storedUser.profilePic
    || '';
  const avatarSrc = imageUrl || '/avatars/student.png';
  const avatarSrcWithVersion = imageUrl
    ? `${avatarSrc}${avatarSrc.includes('?') ? '&' : '?'}_=${userVersion}`
    : avatarSrc;
  const firstInitial = (storedUser.firstName?.[0] || storedUser.name?.split(' ')?.[0]?.[0] || storedUser.collegeEmail?.[0] || 'S').toUpperCase();
  const secondInitial = (storedUser.lastName?.[0] || storedUser.name?.split(' ')?.[1]?.[0] || '').toUpperCase();
  const initials = `${firstInitial}${secondInitial}`.trim() || 'ST';

  // Fallback: if no imageUrl in localStorage, fetch profile once to hydrate it
  useEffect(() => {
    const shouldFetch = !imageUrl; // no photo known
    const token = localStorage.getItem('authToken');
    if (!shouldFetch || !token) return;
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:3002/api/users/profile', {
          headers: { Authorization: `Bearer ${token}`, role: 'student' },
        });
        if (data?.photoUrl) {
          const raw = localStorage.getItem('user');
          const obj = raw ? JSON.parse(raw) : {};
          obj.photoUrl = data.photoUrl;
          localStorage.setItem('user', JSON.stringify(obj));
          window.dispatchEvent(new Event('user-updated'));
        }
      } catch {
        // ignore
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  // Logout handler: clear auth and user data, then navigate to login
  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('student_notifications');
      window.dispatchEvent(new Event('user-updated'));
    } finally {
      navigate('/login', { replace: true });
    }
  };

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
                <AvatarImage src={avatarSrcWithVersion} alt={storedUser.firstName || storedUser.name || 'Student'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
        
          
            
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); navigate('/student/my-profile'); }}>Profile</DropdownMenuItem>
          
    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); navigate('/student/settings'); }}>Settings</DropdownMenuItem>

            <DropdownMenuItem className="text-red-600" onSelect={(e) => { e.preventDefault(); handleLogout(); }}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

export default StudentHeader;
