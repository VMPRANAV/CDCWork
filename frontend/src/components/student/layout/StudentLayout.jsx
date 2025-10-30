import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

const SIDEBAR_WIDTH = 256;
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

export function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (event) => setIsDesktop(event.matches);

    handleChange(mediaQuery);

    const supportsEventListener = typeof mediaQuery.addEventListener === 'function';
    if (supportsEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (supportsEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const sidebarTransform = useMemo(
    () => (sidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`),
    [sidebarOpen]
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <div
        className="fixed inset-y-0 left-0 z-40 lg:z-30"
        style={{
          width: SIDEBAR_WIDTH,
          transform: sidebarTransform,
          transition: 'transform 220ms ease'
        }}
      >
        <StudentSidebar />
      </div>
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className="flex flex-1 flex-col overflow-hidden"
        style={{
          marginLeft: isDesktop && sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 220ms ease'
        }}
      >
        <StudentHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6">
          <div className="space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
