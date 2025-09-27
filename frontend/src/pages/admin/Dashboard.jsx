import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudents } from '@/hooks/useStudents';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { StudentsTable } from '@/components/admin/dashboard/StudentsTable';
import { StudentDetails } from '@/components/admin/dashboard/StudentDetails';

/**
 * Dashboard - Main dashboard page for the admin panel
 * Displays key metrics and recent student activity
 */
export function Dashboard() {
  const {
    students,
    loading,
    studentDetails,
    detailsLoading,
    selectedStudent,
    selectStudent,
    clearSelectedStudent,
    refetch
  } = useStudents();

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your students.
          </p>
        </div>
      </div>
      
      <StatsCards students={students} loading={loading} />
      
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Students</CardTitle>
              <p className="text-sm text-muted-foreground">
                {recentStudents.length} {recentStudents.length === 1 ? 'student' : 'students'} registered recently
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/90"
              onClick={() => navigate('/admin/students')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StudentsTable 
            students={recentStudents}
            loading={loading}
            onViewDetails={selectStudent}
            className="border-t"
          />
        </CardContent>
      </Card>

      <StudentDetails 
        student={studentDetails}
        loading={detailsLoading}
        onClose={clearSelectedStudent}
      />
    </div>
  );
}
