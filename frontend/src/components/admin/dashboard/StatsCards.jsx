import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, GraduationCap, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * StatCard - Reusable card component for displaying statistics
 */
function StatCard({ title, value, icon: Icon, description, trend, loading = false }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          {
            'bg-blue-100 text-blue-600': title === 'Total Students',
            'bg-green-100 text-green-600': title === 'Placed Students',
            'bg-purple-100 text-purple-600': title === 'Average CGPA',
            'bg-amber-100 text-amber-600': title === 'Recent Activity',
          }
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20 my-1" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {!loading && description && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn("flex items-center mr-1", {
                'text-green-600': trend === 'up',
                'text-red-600': trend === 'down',
              })}>
                <TrendingUp className="h-3 w-3 mr-0.5" />
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * StatsCards - Displays key metrics in a responsive grid
 */
export function StatsCards({ students = [], loading = false }) {
  const totalStudents = students.length;
  const placedStudents = students.filter(s => s.isPlaced).length;
  const avgCGPA = students.length > 0 
    ? (students.reduce((sum, s) => sum + (parseFloat(s.ugCgpa) || 0), 0) / students.length).toFixed(1)
    : '0.0';
  const placementRate = totalStudents > 0 
    ? Math.round((placedStudents / totalStudents) * 100) 
    : 0;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      description: `${totalStudents} enrolled`,
      trend: 'up',
    },
    {
      title: 'Placed Students',
      value: placedStudents,
      icon: Briefcase,
      description: `${placementRate}% placement rate`,
      trend: placedStudents > 0 ? 'up' : null,
    },
    {
      title: 'Average CGPA',
      value: avgCGPA,
      icon: GraduationCap,
      description: 'Across all students',
      trend: parseFloat(avgCGPA) > 7.5 ? 'up' : 'down',
    },
    {
      title: 'Recent Activity',
      value: students.filter(s => 
        new Date(s.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      icon: Clock,
      description: 'Updated this week',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          trend={stat.trend}
          loading={loading}
        />
      ))}
    </div>
  );
}
