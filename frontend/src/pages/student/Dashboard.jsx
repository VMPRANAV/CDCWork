import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, ClipboardList, Briefcase, User } from 'lucide-react';

import CodingProfile from '@/landingPage/dashboard/codingProfile';
import { MinimalApplicationsWidget } from '@/pages/student/widgets/MinimalApplicationsWidget';
import { LiveAttendanceWidget } from '@/pages/student/widgets/LiveAttendanceWidget';

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your placement journey and key actions.</p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 xl:col-span-2">
          {/* Applications */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">My Applications</CardTitle>
                  <CardDescription>Track your current application status</CardDescription>
                </div>
                <Badge variant="secondary">Overview</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MinimalApplicationsWidget />
            </CardContent>
          </Card>

          {/* Coding Profile */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Coding Profile</CardTitle>
              <CardDescription>Your coding stats and competitive progress</CardDescription>
            </CardHeader>
            <CardContent>
              <CodingProfile />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Attendance */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Attendance</CardTitle>
              <CardDescription>Join sessions that are currently live</CardDescription>
            </CardHeader>
            <CardContent>
              <LiveAttendanceWidget />
            </CardContent>
          </Card>

          {/* Tips / Announcements placeholder */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Announcements</CardTitle>
              <CardDescription>Stay updated with placement notices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>No announcements yet.</p>
                <Separator />
                <p>Check back later for updates.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
