import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

const SIDEBAR_WIDTH = 256;

export function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarTransform = useMemo(
    () => (sidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`),
    [sidebarOpen]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <div
        className="fixed inset-y-0 left-0 z-30"
        style={{
          width: SIDEBAR_WIDTH,
          transform: sidebarTransform,
          transition: 'transform 220ms ease'
        }}
      >
        <StudentSidebar />
      </div>
      <div
        className="flex flex-1 flex-col overflow-hidden"
        style={{ marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0, transition: 'margin-left 220ms ease' }}
      >
        <StudentHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div className="space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
