import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  UserRound,
  MessageSquare,
  CalendarDays,
  LogOut
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import kprietLogo from '@/assets/kprietLogo.png';
import kprietLogoWhite from '@/assets/White_Logo.png';

const navItems = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/student/profile', icon: UserRound },
  { name: 'Available Jobs', href: '/student/availableJob', icon: Briefcase },
  { name: 'Applications', href: '/student/applications', icon: ClipboardList },
  { name: 'Calendar', href: '/student/calendar', icon: CalendarDays },
  { name: 'Posts', href: '/student/posts', icon: MessageSquare }
];

export function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Choose logo based on theme
  const logo = theme === 'dark' ? kprietLogoWhite : kprietLogo;

  return (
    <div className="flex h-full bg-white dark:bg-transparent">
      <div className="flex h-full w-full flex-col border-r border-gray-200 bg-white text-gray-900 dark:border-white/10 dark:bg-[#0f172a] dark:text-zinc-100">
        <div className="flex h-16 items-center gap-3 px-4 border-b border-gray-200 dark:border-white/10">
          <img 
            src={logo} 
            alt="KPRIET Logo" 
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-bold text-primary whitespace-nowrap dark:text-zinc-100">CDC KPRIET</h1>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = activePath.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/25 dark:text-zinc-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-[#182341] dark:hover:text-zinc-100'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/15"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSidebar;
