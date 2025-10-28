import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PackageStats({ stats, loading }) {
  const formatLPA = (value) => {
    if (typeof value !== 'number' || value === 0) return 'N/A';
    return `${value.toFixed(2)} LPA`;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[108px]" />
        <Skeleton className="h-[108px]" />
        <Skeleton className="h-[108px]" />
      </div>
    );
  }

  if (!stats) {
    return null; // Or show an error/empty state
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLPA(stats.avgPackage)}</div>
          <p className="text-xs text-muted-foreground">
            For all placed students
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Highest Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLPA(stats.maxPackage)}</div>
          <p className="text-xs text-muted-foreground">
            Maximum salary offered
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLPA(stats.minPackage)}</div>
          <p className="text-xs text-muted-foreground">
            Minimum salary offered
          </p>
        </CardContent>
      </Card>
    </div>
  );
}